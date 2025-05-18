from rest_framework import serializers
from .models import Candidatura, Residencia, Estudante

class ResidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residencia
        fields = '__all__'

class EstudanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudante
        fields = '__all__'

class CandidaturaSerializer(serializers.ModelSerializer):
    # Para leitura: mostra dados aninhados completos
    residencia = ResidenciaSerializer(read_only=True)
    estudante = EstudanteSerializer(read_only=True)

    # Para escrita: aceita somente IDs para relacionamentos
    residencia_id = serializers.PrimaryKeyRelatedField(
        queryset=Residencia.objects.all(), source='residencia', write_only=True
    )
    estudante_id = serializers.PrimaryKeyRelatedField(
        queryset=Estudante.objects.all(), source='estudante', write_only=True, required=False
    )

    class Meta:
        model = Candidatura
        fields = '__all__'
