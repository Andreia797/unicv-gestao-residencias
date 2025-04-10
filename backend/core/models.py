from django.db import models

class Edificio(models.Model):
    nome = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255)
    numeroApartamentos = models.IntegerField()
    TIPO_CHOICES = [
        ('residencial', 'Residencial'),
        ('comercial', 'Comercial'),
        ('outros', 'Outros'),
    ]
    tipo = models.CharField(
        max_length=50,
        choices=TIPO_CHOICES,
        default='residencial',
    )

    def __str__(self):
        return f"{self.nome} ({self.get_tipo_display()})"

class Quarto(models.Model):
    TIPO_CHOICES = [
        ('individual', 'Individual'),
        ('duplo', 'Duplo'),
        ('triplo', 'Triplo'),
    ]

    numero = models.CharField(max_length=50, unique=True)
    capacidade = models.IntegerField()
    edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='individual')

    def __str__(self):
        return f"{self.numero} - {self.edificio.nome} ({self.get_tipo_display()})"


class Residente(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    endereco = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nome

class Cama(models.Model):
    numero = models.CharField(max_length=50)
    quarto = models.ForeignKey(Quarto, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ('Disponível', 'Disponível'),
        ('Ocupado', 'Ocupado'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Disponível')
    residente = models.ForeignKey(Residente, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ('numero', 'quarto')

    def __str__(self):
        return f"{self.numero} - {self.quarto}"

class Residencia(models.Model):
    Nome = models.CharField(max_length=255)
    edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE)

    def __str__(self):
        return self.Nome