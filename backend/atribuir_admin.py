import os
import django
from django.conf import settings

if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

from django.contrib.auth.models import Group
from accounts.models import CustomUser

def atribuir_admin_andreia():
    try:
        # Verificar e criar o grupo 'administrador' se não existir
        admin_group = Group.objects.get(name='administrador')
        print("O grupo 'administrador' existe:", admin_group)
    except Group.DoesNotExist:
        admin_group = Group.objects.create(name='administrador')
        print("Grupo 'administrador' criado:", admin_group)

    try:
        # Obter o usuário com o email fornecido USANDO CustomUser
        user = CustomUser.objects.get(email='andreia.semedo@gmail.com')
        print("Usuário encontrado:", user.email)  # Alterado para user.email

        # Adicionar o usuário ao grupo 'administrador'
        user.groups.add(admin_group)
        user.save()
        print(f"Usuário '{user.email}' adicionado ao grupo 'administrador'.")  # Alterado para user.email

    except CustomUser.DoesNotExist:
        print("Usuário com o email fornecido não encontrado.")
    except Exception as e:
        print("Ocorreu um erro:", e)

if __name__ == '__main__':
    atribuir_admin_andreia()