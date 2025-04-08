from django.db import models

class Estudante(models.Model):
    Nome = models.CharField(max_length=255)

    def __str__(self):
        return self.Nome