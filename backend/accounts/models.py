from django.contrib.auth.models import AbstractUser
from django.db import models

# Custom User baseado em AbstractUser para personalizar o modelo de usuário
class CustomUser(AbstractUser):
    def __str__(self):
        return self.username  # Retorna o nome de usuário quando for impresso

# Modelo para o perfil de usuário (UserProfile) com permissões personalizadas
class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    nome = models.CharField(max_length=255, blank=True)

    # Definindo permissões específicas para o perfil do usuário
    PERMISSAO_CHOICES = [
        ('admin', 'Admin'),
        ('funcionario', 'Funcionário'),
        ('estudante', 'Estudante'),
    ]
    permissao = models.CharField(
        max_length=20,
        choices=PERMISSAO_CHOICES,
        default='estudante',
    )
    
    # Permissões detalhadas em formato JSON
    permissoes_detalhadas = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.permissao}"  # Exibe o nome de usuário e a permissão associada
