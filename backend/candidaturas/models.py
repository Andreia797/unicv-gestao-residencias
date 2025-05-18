from django.db import models
from core.models import Residencia
from estudantes.models import Estudante

class Candidatura(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
        ('em_analise', 'Em Análise'),
    ]

    data_submissao = models.DateTimeField(auto_now_add=True)
    residencia = models.ForeignKey(Residencia, on_delete=models.CASCADE, related_name='candidaturas')
    estudante = models.ForeignKey(Estudante, on_delete=models.CASCADE, related_name='candidaturas')

    cni_ou_passaporte_entregue = models.CharField(max_length=255, null=True, blank=True)
    declaracao_matricula_entregue = models.CharField(max_length=255, null=True, blank=True)
    declaracao_rendimento_entregue = models.CharField(max_length=255, null=True, blank=True)
    declaracao_subsistencia_entregue = models.CharField(max_length=255, null=True, blank=True)
    declaracao_residencia_entregue = models.CharField(max_length=255, null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente',
        verbose_name='Estado da Candidatura'
    )

    class Meta:
        permissions = [
            ('view_outras_candidaturas', 'Can view candidaturas of other students'),
        ]

    def __str__(self):
        return f"Candidatura de {self.estudante.Nome} para {self.residencia.Nome} ({self.get_status_display()})"