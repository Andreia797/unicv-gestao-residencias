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

            # Verifica se o usuário tem 2FA configurado
            if user_has_device(user):
                return Response({
                    "msg": "2FA necessário",
                    "requires_2fa": True
                }, status=status.HTTP_200_OK)

            # Autenticação sem 2FA
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "requires_2fa": False
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class generate_2fa_qrcode(APIView):
    authentication_classes = [JWTAuthentication]  # <- Adicionado
    permission_classes = [IsAuthenticated]

    def post(self, request): 
        print("Authorization Header:", request.headers.get('Authorization'))
        print("User:", request.user)
        print("Authenticated?", request.user.is_authenticated)

        user = request.user
        if not user or not user.is_authenticated:
            return Response({"detail": "Usuário não autenticado."}, status=401)

        print(f"Usuário autenticado: {user.email}")

        # Recupera ou cria o dispositivo TOTP
        device, created = TOTPDevice.objects.get_or_create(user=user)

        if not device.configured:
            return Response({"msg": "Erro ao configurar o dispositivo 2FA."}, status=400)

        # Gera QRCode com URI do dispositivo
        otp_uri = device.config_url
        img = qrcode.make(otp_uri)
        buffer = BytesIO()
        img.save(buffer)
        buffer.seek(0)

        # Armazena temporariamente
        file_name = f"2fa_qrcode_{user.id}.png"
        file_path = default_storage.save(file_name, buffer)

        return Response({
            'qrcode_url': file_path,
            'secret': device.key
        })




class verify_2fa(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        code = request.data.get('code')

        device = TOTPDevice.objects.filter(user=user).first()
        if not device:
            return Response({"msg": "Dispositivo 2FA não configurado."}, status=status.HTTP_400_BAD_REQUEST)

        if not device.verify_token(code):
            return Response({"msg": "Código 2FA inválido!"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
