import os
import django
from django.conf import settings

if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

from django.contrib.auth.models import Group
from accounts.models import CustomUser
from django.contrib.auth.hashers import make_password

def criar_funcionario_unicv():
    try:
        # Verificar e criar o grupo 'funcionario' se não existir
        funcionario_group = Group.objects.get(name='funcionario')
        print("O grupo 'funcionario' existe:", funcionario_group)
    except Group.DoesNotExist:
        funcionario_group = Group.objects.create(name='funcionario')
        print("Grupo 'funcionario' criado:", funcionario_group)

    try:
        # Tentar obter o usuário. Se não existir, criar um novo.
        user = CustomUser.objects.get(email='unicv@gmail.com')
        print("Usuário encontrado:", user.email)
    except CustomUser.DoesNotExist:
        # Criar um novo usuário funcionario
        user = CustomUser.objects.create_user(
            email='unicv@gmail.com',
            password='12345678',  # A senha será hashizada automaticamente
            is_staff=True,       # Funcionários geralmente têm acesso ao admin
            is_active=True        # Certifique-se de que a conta está ativa
        )
        print("Usuário 'unicv@gmail.com' criado.")

    # Adicionar o usuário ao grupo 'funcionario'
    user.groups.add(funcionario_group)
    user.save()
    print(f"Usuário '{user.email}' adicionado ao grupo 'funcionario'.")

if __name__ == '__main__':
    criar_funcionario_unicv()