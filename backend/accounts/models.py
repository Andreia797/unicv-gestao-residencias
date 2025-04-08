from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nome = models.CharField(max_length=255, blank=True)
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
    permissoes_detalhadas = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.user.username