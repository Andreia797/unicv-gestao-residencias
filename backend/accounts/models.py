from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.db import models

# Manager personalizado
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser precisa ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser precisa ter is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Modelo CustomUser
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    has_2fa = models.BooleanField(default=False)  # Adicione este campo

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def has_2fa_enabled(self):
        return self.has_2fa  # Use o campo 'has_2fa'


# Perfil de usuário
class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    nome = models.CharField(max_length=255, blank=True)

    PERMISSAO_CHOICES = [
        ('administrador', 'Administrador'),
        ('funcionario', 'Funcionário'),
        ('estudante', 'Estudante'),
    ]
    permissao = models.CharField(
        max_length=20,
        choices=PERMISSAO_CHOICES,
        default='estudante',
    )

    permissoes_detalhadas = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.permissao}"