import os
import django
import secrets # Importa o módulo secrets para geração de senhas seguras
from django.conf import settings

# Configurações do Django, caso ainda não estejam configuradas
if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

from django.contrib.auth.models import Group, Permission
from accounts.models import CustomUser
# make_password não é estritamente necessário aqui, pois create_user já faz o hashing
# from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType

def criar_aluno_estudante():
    """
    Cria ou verifica a existência do grupo 'estudante' e de um usuário 'aluno@gmail.com'.
    Se o usuário não existir, ele é criado com uma senha gerada aleatoriamente.
    """
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
        # Se o usuário não existe, crie um novo.
        # Gerar uma senha forte e aleatória em vez de hard-coded
        # secrets.token_urlsafe(16) gera uma string aleatória de 16 bytes (base64 URL-safe)
        # que é segura para senhas.
        generated_password = secrets.token_urlsafe(16)

        user = CustomUser.objects.create_user(
            email='aluno@gmail.com',
            password=generated_password,  # Usa a senha gerada aleatoriamente
            is_staff=False,              # Alunos geralmente não têm acesso ao admin
            is_active=True               # Certifique-se de que a conta está ativa
        )
        print("Usuário 'aluno@gmail.com' criado com sucesso!")
        # AVISO IMPORTANTE: Em produção, NUNCA imprima a senha no console.
        # Em vez disso, implemente um fluxo para enviar um e-mail ao usuário
        # com um link para ele definir a sua própria senha.
        print(f"ATENÇÃO: Senha gerada para 'aluno@gmail.com' (APENAS PARA DESENVOLVIMENTO): {generated_password}")
        print("Em produção, considere implementar um fluxo de definição de senha via e-mail para o usuário.")

    # Adicionar o usuário ao grupo 'estudante'
    user.groups.add(estudante_group)
    user.save()
    print(f"Usuário '{user.email}' adicionado ao grupo 'estudante'.")

    # Opcional: Adicionar permissões específicas ao grupo 'estudante'
    # Você pode definir permissões aqui, se necessário.
    # Exemplo: Dar permissão para visualizar certos modelos
    # from django.contrib.contenttypes.models import ContentType
    # content_type = ContentType.objects.get(app_label='sua_app', model='seu_model')
    # view_permission = Permission.objects.get(codename='view_seu_model', content_type=content_type)
    # estudante_group.permissions.add(view_permission)
    # estudante_group.save()
    # print("Permissões adicionadas ao grupo 'estudante'.")

if __name__ == '__main__':
    criar_aluno_estudante()