import os
import django
from django.conf import settings

if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

from django.contrib.auth.models import Group, Permission
from accounts.models import CustomUser
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType

def criar_aluno_estudante():
    try:
        # Verificar e criar o grupo 'estudante' se não existir
        estudante_group = Group.objects.get(name='estudante')
        print("O grupo 'estudante' existe:", estudante_group)
    except Group.DoesNotExist:
        estudante_group = Group.objects.create(name='estudante')
        print("Grupo 'estudante' criado:", estudante_group)

    try:
        # Tentar obter o usuário. Se não existir, criar um novo.
        user = CustomUser.objects.get(email='aluno@gmail.com')
        print("Usuário encontrado:", user.email)
    except CustomUser.DoesNotExist:
        # Criar um novo usuário estudante
        user = CustomUser.objects.create_user(
            email='aluno@gmail.com',
            password='12345678',  # A senha será hashizada automaticamente
            is_staff=False,      # Alunos geralmente não têm acesso ao admin
            is_active=True       # Certifique-se de que a conta está ativa
        )
        print("Usuário 'aluno@gmail.com' criado.")

    # Adicionar o usuário ao grupo 'estudante'
    user.groups.add(estudante_group)
    user.save()
    print(f"Usuário '{user.email}' adicionado ao grupo 'estudante'.")

    # Opcional: Adicionar permissões específicas ao grupo 'estudante'
    # Você pode definir permissões aqui, se necessário.
    # Exemplo: Dar permissão para visualizar certos modelos
    # content_type = ContentType.objects.get(app_label='sua_app', model='seu_model')
    # view_permission = Permission.objects.get(codename='view_seu_model', content_type=content_type)
    # estudante_group.permissions.add(view_permission)
    # estudante_group.save()
    # print("Permissões adicionadas ao grupo 'estudante'.")

if __name__ == '__main__':
    criar_aluno_estudante()