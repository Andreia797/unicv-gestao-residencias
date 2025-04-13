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
    residencia = ResidenciaSerializer(read_only=True)
    estudante = EstudanteSerializer(read_only=True)

    class Meta:
        model = Candidatura
        fields = '__all__'