from django.urls import path
from .views import (
    UserList, UserDetail, UserCreate, register_user, login_user,
    generate_2fa_qrcode, confirm_2fa_code, verify_2fa,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('users/create/', UserCreate.as_view(), name='user-create'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('2fa/generate/', generate_2fa_qrcode, name='generate-2fa'),
    path('2fa/confirm/', confirm_2fa_code, name='confirm-2fa'),
    path('2fa/verify/', verify_2fa, name='verify-2fa'),
]
