from django.urls import path
from .views import (
    UserList,
    UserDetail,
    UserCreate,
    register_user,
    login_user,
    CustomTokenObtainPairView,
    generate_2fa_qrcode,
    verify_2fa
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Lista e detalhes dos usuários
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),

    # Registro de usuários
    path('register/', register_user.as_view(), name='register'),

    # Criação de usuários
    path('users/create/', UserCreate.as_view(), name='user-create'),

    # Login com JWT (fluxo com 2FA inicial)
    path('login/', login_user.as_view(), name='login'),

    # Obtenção do par de tokens JWT (para fluxo padrão, se usado)
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh do Token JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Geração de QR Code para 2FA
    path('generate-2fa/', generate_2fa_qrcode.as_view(), name='generate-2fa'),

    # Verificação do código 2FA
    path('verify-2fa/', verify_2fa.as_view(), name='verify-2fa'),
]