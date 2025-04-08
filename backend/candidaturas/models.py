from django.db import models
from core.models import Residencia
from estudantes.models import Estudante

class Candidatura(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
        ('em_analise', 'Em Análise'),
        # Adicione outros status conforme necessário
    ]

    DataSubmissao = models.DateTimeField(auto_now_add=True)
    residencia = models.ForeignKey(Residencia, on_delete=models.CASCADE)
    estudante = models.ForeignKey(Estudante, on_delete=models.CASCADE)
    CNIouPassaporteEntregue = models.CharField(max_length=255, null=True, blank=True)
    DeclaracaoMatriculaEntregue = models.CharField(max_length=255, null=True, blank=True)
    DeclaracaoRendimentoEntregue = models.CharField(max_length=255, null=True, blank=True)
    DeclaracaoSubsistenciaEntregue = models.CharField(max_length=255, null=True, blank=True)
    DeclaracaoResidenciaEntregue = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente',
        verbose_name='Estado da Candidatura'
    )

    def __str__(self):
        return f"Candidatura de {self.estudante.Nome} para {self.residencia.Nome} ({self.get_status_display()})"