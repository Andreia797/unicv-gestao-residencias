from rest_framework import serializers
from .models import Edificio, Quarto, Residente, Cama, Residencia

class EdificioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edificio
        fields = '__all__'

class QuartoSerializer(serializers.ModelSerializer):
    edificio = EdificioSerializer(read_only=True)
    class Meta:
        model = Quarto
        fields = '__all__'

class ResidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residente
        fields = '__all__'

class CamaSerializer(serializers.ModelSerializer):
    quarto = QuartoSerializer(read_only=True)
    residente = ResidenteSerializer(read_only=True)
    class Meta:
        model = Cama
        fields = '__all__'

class ResidenciaSerializer(serializers.ModelSerializer):
    edificio = EdificioSerializer(read_only=True)
    class Meta:
        model = Residencia
        fields = '__all__'