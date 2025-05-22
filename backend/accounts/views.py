from django.contrib.auth import get_user_model, authenticate
from rest_framework import status, permissions
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from django.conf import settings
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import devices_for_user

import qrcode
from io import BytesIO
import base64

from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, CustomTokenObtainPairSerializer, DetailedUserSerializer

User = get_user_model()
SECURE_COOKIE = not settings.DEBUG


class IsAdminOrSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user


class UserList(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, format=None):
        utilizadores = User.objects.all()
        serializer = DetailedUserSerializer(utilizadores, many=True) # Use DetailedUserSerializer aqui
        return Response(serializer.data)

class UserDetail(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        self.check_object_permissions(request, user)
        serializer = DetailedUserSerializer(user)
        return Response(serializer.data)


class UserCreate(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class register_user(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Usuário registrado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class login_user(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                # Usar seu CustomTokenObtainPairSerializer para gerar o token
                token_serializer = CustomTokenObtainPairSerializer()
                token = token_serializer.get_token(user)
                access_token = str(token.access_token)
                refresh_token = str(token)

                # Retornar token para frontend e informar necessidade de 2FA
                return Response({
                    "msg": "Verificação 2FA necessária",
                    "requires_2fa": True,
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            return Response({"msg": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class generate_2fa_qrcode(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        device, _ = TOTPDevice.objects.get_or_create(user=user, name='default')

        if not device.confirmed:
            device.confirmed = True
            device.save()

        qr = qrcode.make(device.config_url)
        buffered = BytesIO()
        qr.save(buffered)
        qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

        return Response({
            'qr_code_base64': qr_code_base64,
            'otp_uri': device.config_url
        }, status=status.HTTP_200_OK)


class verify_2fa(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        otp_token = request.data.get("otp_token")
        temp_token = request.headers.get('Authorization', '').split('Bearer ')[-1]

        if not otp_token:
            return Response({"error": "Código 2FA não fornecido"}, status=status.HTTP_400_BAD_REQUEST)

        if not temp_token:
            return Response({"error": "Token temporário ausente"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            decoded_token = AccessToken(temp_token)
            user = User.objects.get(id=decoded_token['user_id'])
        except Exception:
            return Response({"error": "Token temporário inválido"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "Usuário inativo"}, status=status.HTTP_401_UNAUTHORIZED)

        for device in devices_for_user(user):
            if device.verify_token(otp_token):
                # Gerar token customizado com grupos novamente para o token final
                token_serializer = CustomTokenObtainPairSerializer()
                token = token_serializer.get_token(user)

                access_token_final = str(token.access_token)
                refresh_token_final = str(token)

                response = Response({
                    "msg": "2FA verificado com sucesso",
                    "access": access_token_final,
                    "refresh": refresh_token_final,
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)

                response.set_cookie(
                    'access_token',
                    access_token_final,
                    httponly=True,
                    secure=SECURE_COOKIE,
                    samesite='Strict'
                )
                response.set_cookie(
                    'refresh_token',
                    refresh_token_final,
                    httponly=True,
                    secure=SECURE_COOKIE,
                    samesite='Strict'
                )
                return response

        return Response({"error": "Código 2FA inválido"}, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response = Response({'access': access_token}, status=status.HTTP_200_OK)
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=SECURE_COOKIE,
                samesite='Strict'
            )
            return response
        except Exception:
            return Response({'error': 'Token de refresh inválido'}, status=status.HTTP_400_BAD_REQUEST)
        

