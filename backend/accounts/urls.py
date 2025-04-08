from django.urls import path
from .views import UserList, UserDetail, UserCreate, register_user, login_user

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('users/create/', UserCreate.as_view(), name='user-create'),
]