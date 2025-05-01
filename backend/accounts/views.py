from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer, UserRegistrationSerializer,
    UserLoginSerializer, CustomTokenObtainPairSerializer
)
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib.sites.shortcuts import get_current_site
import qrcode
import base64
from io import BytesIO

User = get_user_model()

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['POST'])
@permission_classes([])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Utilizador registado com sucesso!'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=user.username, password=password)
        if user:
            has_2fa = TOTPDevice.objects.filter(user=user, confirmed=True).exists()
            if has_2fa:
                return Response({'requires_2fa': True}, status=200)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login efetuado com sucesso!'
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_2fa_qrcode(request):
    user = request.user
    TOTPDevice.objects.filter(user=user, confirmed=False).delete()
    device = TOTPDevice.objects.create(user=user, confirmed=False, name='default')

    otp_uri = device.config_url(user=user, issuer=get_current_site(request).name)
    qr = qrcode.make(otp_uri)
    buffer = BytesIO()
    qr.save(buffer, format='PNG')
    image_base64 = base64.b64encode(buffer.getvalue()).decode()

    return Response({'otp_uri': otp_uri, 'qr_code_base64': image_base64})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_2fa_code(request):
    token = request.data.get('token')
    device = TOTPDevice.objects.filter(user=request.user, confirmed=False).first()
    if device and device.verify_token(token):
        device.confirmed = True
        device.save()
        return Response({'message': '2FA ativado com sucesso!'})
    return Response({'error': 'Código inválido'}, status=400)

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
        })
    return Response({'error': 'Código 2FA inválido ou expirado'}, status=400)
