from django.db import models
from accounts.models import CustomUser  

class Estudante(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='estudante')
    Nome = models.CharField(max_length=255)

    def __str__(self):
        return self.Nome