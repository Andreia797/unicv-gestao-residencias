from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import devices_for_user
from django.contrib.sites.shortcuts import get_current_site
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, CustomTokenObtainPairSerializer
import base64, qrcode
from io import BytesIO

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            response = Response({'success': 'Utilizador registado com sucesso!'}, status=status.HTTP_201_CREATED)
            response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
            response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(username=serializer.validated_data['email'], password=serializer.validated_data['password'])
        if user:
            devices = list(devices_for_user(user, confirmed=True))
            if devices:
                return Response({'requires_2fa': True}, status=200)
            refresh = RefreshToken.for_user(user)
            response = Response({'success': True})
            response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
            response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')
            return response
        return Response({'error': 'Credenciais inválidas'}, status=401)

class Generate2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        TOTPDevice.objects.filter(user=user, confirmed=False).delete()
        device = TOTPDevice.objects.create(user=user, confirmed=False, name="default")
        current_site = get_current_site(request)
        otp_uri = device.config_url(user=user, issuer=current_site.name or "App")
        qr = qrcode.make(otp_uri)
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        return Response({'qr_code_base64': image_base64, 'otp_uri': otp_uri}, status=200)

class Confirm2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        device = TOTPDevice.objects.filter(user=request.user, confirmed=False).first()
        if device and device.verify_token(token):
            device.confirmed = True
            device.save()
            return Response({'message': '2FA ativado com sucesso!'}, status=200)
        return Response({'error': 'Código inválido'}, status=400)

class Verify2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        device = TOTPDevice.objects.filter(user=request.user, confirmed=True).first()
        if device and device.verify_token(token):
            refresh = RefreshToken.for_user(request.user)
            response = Response({'success': True})
            response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
            response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')
            return response
        return Response({'error': 'Código 2FA inválido'}, status=400)

# ✅ Estas são as views que estavam a causar erro por não existirem:
class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserDetail(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Alias para manter compatibilidade com urls.py
register_user = RegisterView.as_view()
login_user = LoginView.as_view()
generate_2fa_qrcode = Generate2FAView.as_view()
