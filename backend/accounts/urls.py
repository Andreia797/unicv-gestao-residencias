from django.urls import path
from .views import UserList, UserDetail, UserCreate, register_user, login_user, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),  
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),  
    path('register/', register_user, name='register'),  
    path('login/', login_user, name='login'),  
    path('users/create/', UserCreate.as_view(), name='user-create'),  
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
]
