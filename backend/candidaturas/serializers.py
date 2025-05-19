from rest_framework import serializers
from .models import Candidatura, Residencia, Estudante
from core.models import Quarto, Edificio

class ResidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residencia
        fields = '__all__'

class EstudanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudante
        fields = '__all__'

class EdificioSerializerParaQuarto(serializers.ModelSerializer):
    class Meta:
        model = Edificio
        fields = ['nome', 'endereco']

class QuartoSerializer(serializers.ModelSerializer):
    num_residentes = serializers.IntegerField(read_only=True)
    edificio_detalhes = serializers.SerializerMethodField()

    class Meta:
        model = Quarto
        fields = ['id', 'numero', 'capacidade', 'tipo', 'edificio', 'num_residentes', 'edificio_detalhes']
        depth = 0  # Não precisa de depth aqui, pois usaremos SerializerMethodField

    def get_edificio_detalhes(self, instance):
        return EdificioSerializerParaQuarto(instance.edificio).data

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
