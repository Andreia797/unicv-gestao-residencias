from django.contrib.auth import get_user_model, authenticate
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
import pyotp
import qrcode
from io import BytesIO
from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, CustomTokenObtainPairSerializer
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import user_has_device
from .serializers import LoginSerializer
import base64
from django_otp import devices_for_user



User = get_user_model()


class UserList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"msg": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class register_user(APIView):
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"msg": "Usuário registrado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def user_has_device(user):
    return any(dev.confirmed for dev in devices_for_user(user))

class login_user(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password=password)

            if user is None:
                return Response({"msg": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

            # Gera token de acesso temporário
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Sempre exige 2FA (inclusive se o usuário ainda não tiver configurado)
            return Response({
                "msg": "2FA obrigatório",
                "requires_2fa": True,
                "access_token": access_token
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class generate_2fa_qrcode(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Cria ou recupera o dispositivo TOTP
        device, created = TOTPDevice.objects.get_or_create(user=user, name='default')

        if not device.key:
            device.generate_challenge()

        # Gera o QR code como imagem PIL padrão
        qr = qrcode.make(device.config_url)

        buffered = BytesIO()
        qr.save(buffered)  # sem format="PNG"
        qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

        return Response({
            'qr_code_base64': qr_code_base64,
            'otp_uri': device.config_url
        }, status=status.HTTP_200_OK)




class verify_2fa(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        otp_token = request.data.get("otp_token")

        if not otp_token:
            return Response({"error": "Código 2FA não fornecido"}, status=400)

        user = request.user

        if not user.is_authenticated:
            return Response({"error": "Usuário não autenticado"}, status=401)

        # Verifica o código TOTP
        for device in devices_for_user(user):
            if device.verify_token(otp_token):
                # Sucesso! Gera token final
                refresh = RefreshToken.for_user(user)
                return Response({
                    "msg": "2FA verificado com sucesso",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }, status=200)

        return Response({"error": "Código 2FA inválido"}, status=400)