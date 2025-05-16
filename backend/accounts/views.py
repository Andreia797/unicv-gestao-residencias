from django.contrib.auth import get_user_model, authenticate
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
import pyotp
import qrcode
from io import BytesIO
import base64
from django.shortcuts import get_object_or_404
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import devices_for_user

from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class IsAdminOrSelf(permissions.BasePermission):
    """
    Permissão customizada para permitir que administradores vejam/editem todos os usuários
    e usuários autenticados vejam/editem seu próprio perfil.
    """
    def has_object_permission(self, request, view, obj):
        # Administradores têm permissão total
        if request.user.is_staff:
            return True
        # Usuários autenticados podem acessar seu próprio perfil
        return obj == request.user

class UserList(APIView):
    """Lista todos os utilizadores (requer permissão de administrador)."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetail(APIView):
    """Detalhes de um utilizador específico (requer ser admin ou o próprio utilizador)."""
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        self.check_object_permissions(request, self.get_object())
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserCreate(APIView):
    """Cria um novo utilizador (requer permissão de administrador)."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"msg": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class register_user(APIView):
    """Regista um novo utilizador (permissão para qualquer um criar uma conta)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Usuário registrado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class login_user(APIView):
    """Faz login do utilizador e inicia o processo de 2FA."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password=password)

            if user is None:
                return Response({"msg": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "msg": "2FA obrigatório",
                "requires_2fa": True,
                "access_token": access_token
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class generate_2fa_qrcode(APIView):
    """Gera o QR code para configurar o 2FA (requer autenticação)."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        device, created = TOTPDevice.objects.get_or_create(user=user, name='default')

        if not device.key:
            device.generate_challenge()

        qr = qrcode.make(device.config_url)
        buffered = BytesIO()
        qr.save(buffered)
        qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

        return Response({
            'qr_code_base64': qr_code_base64,
            'otp_uri': device.config_url
        }, status=status.HTTP_200_OK)

class verify_2fa(APIView):
    """Verifica o código 2FA e retorna os tokens de acesso e refresh finais."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        otp_token = request.data.get("otp_token")

        if not otp_token:
            return Response({"error": "Código 2FA não fornecido"}, status=400)

        user = request.user

        if not user.is_authenticated:
            return Response({"error": "Usuário não autenticado"}, status=401)

        for device in devices_for_user(user):
            if device.verify_token(otp_token):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "msg": "2FA verificado com sucesso",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }, status=200)

        return Response({"error": "Código 2FA inválido"}, status=400)