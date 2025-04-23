from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, UserRegistrationSerializer, UserLoginSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.util import random_hex
from django.contrib.sites.shortcuts import get_current_site
import qrcode
import base64
from io import BytesIO

class UserList(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserCreate(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = []


@api_view(['POST'])
@permission_classes([])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Utilizador registado com sucesso!'
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            has_2fa = TOTPDevice.objects.filter(user=user, confirmed=True).exists()
            if has_2fa:
                return Response({'requires_2fa': True}, status=200)
            else:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login efetuado com sucesso!'
                }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_2fa_qrcode(request):
    user = request.user
    # Garantir que o dispositivo de 2FA seja único e confirmado
    TOTPDevice.objects.filter(user=user, confirmed=False).delete()
    device = TOTPDevice.objects.create(user=user, confirmed=False, name="default")
    
    current_site = get_current_site(request)
    issuer = current_site.name or "iDE!A Auth"
    otp_uri = device.config_url(user=user, issuer=issuer)

    # Gerar QR Code
    qr = qrcode.make(otp_uri)
    buffer = BytesIO()
    qr.save(buffer, format='PNG')
    image_base64 = base64.b64encode(buffer.getvalue()).decode()

    return Response({
        'qr_code_base64': image_base64,
        'otp_uri': otp_uri
    }, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_2fa_code(request):
    token = request.data.get('token')
    device = TOTPDevice.objects.filter(user=request.user, confirmed=False).first()
    if device and device.verify_token(token):
        device.confirmed = True
        device.save()
        return Response({'message': '2FA ativado com sucesso!'}, status=200)
    return Response({'error': 'Código inválido ou expirado'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_2fa(request):
    token = request.data.get('token')
    device = TOTPDevice.objects.filter(user=request.user, confirmed=True).first()
    if device and device.verify_token(token):
        refresh = RefreshToken.for_user(request.user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login com 2FA realizado com sucesso!'
        }, status=200)
    return Response({'error': 'Código 2FA inválido ou expirado'}, status=400)
