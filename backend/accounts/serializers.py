from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        # Removi 'username' do fields caso seu modelo não tenha
        fields = ['id', 'email', 'password', 'groups']

    def validate_password(self, value):
        if value and len(value) < 8:
            raise serializers.ValidationError("A senha deve ter pelo menos 8 caracteres.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        # Removido 'username' aqui também
        fields = ['email', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "A senha deve ter pelo menos 8 caracteres."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['user_id'] = user.id
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['groups'] = [group.name for group in user.groups.all()]

        return token


class DetailedUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nome_utilizador = serializers.CharField(source='email', read_only=True)  # Ou 'username'
    nome_permissao = serializers.CharField(source='profile.get_permissao_display', read_only=True)
    nome = serializers.CharField(source='profile.nome', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'nome', 'nome_utilizador', 'nome_permissao']

    def get_nome_utilizador(self, obj):
        return obj.username if hasattr(obj, 'username') and obj.username else obj.email

    def get_nome_permissao(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.get_permissao_display()
        return None

    def get_nome(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.nome
        return None