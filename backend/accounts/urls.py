from django.urls import path
from .views import (
    UserList,
    UserDetail,
    UserCreate,
    register_user,
    login_user,
    CustomTokenObtainPairView,
    generate_2fa_qrcode,
    verify_2fa,
    RefreshTokenView,
)
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView

urlpatterns = [
    # Gestão de usuários
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('users/create/', UserCreate.as_view(), name='user-create'),

    # Registro de usuários públicos
    path('register/', register_user.as_view(), name='register'),

    # Login e verificação 2FA
    path('login/', login_user.as_view(), name='login'),
    path('login/verify-2fa/', verify_2fa.as_view(), name='verify-2fa'),

    # JWT token personalizado
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh de token JWT customizado e padrão do SimpleJWT
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh_custom'),
    path('token/refresh/simple/', SimpleJWTTokenRefreshView.as_view(), name='token_refresh_simplejwt'),

    # Geração de QR Code para 2FA
    path('2fa/generate/', generate_2fa_qrcode.as_view(), name='generate-2fa'),
]
