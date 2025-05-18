from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import Group
from core.models import Edificio, Quarto, Residente, Cama, Residencia
from candidaturas.models import Candidatura
from accounts.models import CustomUser
from estudantes.models import Estudante

class Command(BaseCommand):
    help = 'Populates the database with initial data for testing'

    def handle(self, *args, **options):
        print("Iniciando a população completa dos dados...")

        # -------------------- UTILIZADORES E GRUPOS --------------------
        print("Criando utilizadores e grupos...")
        grupo_estudante = Group.objects.get_or_create(name='estudante')[0]
        grupo_funcionario = Group.objects.get_or_create(name='funcionario')[0]
        grupo_administrador = Group.objects.get_or_create(name='administrador')[0]

        user_admin = CustomUser.objects.create_superuser(email='andreia.semedo@gmail.com', password='Unicv@2025', username='admin')
        user_admin.groups.add(grupo_administrador)
        print(f"Utilizador administrador '{user_admin.username}' criado.")

        user_func = CustomUser.objects.create_user(email='unicv@gmail.com', password='12345678', username='funcionario1')
        user_func.groups.add(grupo_funcionario)
        print(f"Utilizador funcionário '{user_func.username}' criado.")

        user_estudante1 = CustomUser.objects.create_user(email='aluno@gmail.com', password='12345678', username='estudante1')
        user_estudante1.groups.add(grupo_estudante)
        print(f"Utilizador estudante '{user_estudante1.username}' criado.")

        user_estudante2 = CustomUser.objects.create_user(email='estudante2@example.com', password='estudante123', username='estudante2')
        user_estudante2.groups.add(grupo_estudante)
        print(f"Utilizador estudante '{user_estudante2.username}' criado.")

        # -------------------- CORE --------------------
        print("Criando dados do núcleo...")
        edificio_a = Edificio.objects.create(nome='Edifício Alfa', endereco='Rua da Universidade, 100', numeroApartamentos=30, tipo='residencial')
        edificio_b = Edificio.objects.create(nome='Residência Beta', endereco='Avenida dos Estudantes, 200', numeroApartamentos=20, tipo='residencial')

        quarto_a1 = Quarto.objects.create(numero='A1-01', capacidade=2, edificio=edificio_a, tipo='duplo')
        quarto_a2 = Quarto.objects.create(numero='A1-02', capacidade=1, edificio=edificio_a, tipo='individual')
        quarto_b1 = Quarto.objects.create(numero='B-1', capacidade=2, edificio=edificio_b, tipo='duplo')

        residente_ana = Residente.objects.create(nome='Ana Oliveira', email='ana.o@example.com', telefone='912345678')
        residente_bruno = Residente.objects.create(nome='Bruno Santos', email='bruno.s@example.com', telefone='923456789')
        residente_carla = Residente.objects.create(nome='Carla Gomes', email='carla.g@example.com', telefone='934567890')

        cama_a1_1 = Cama.objects.create(numero='A1-01-A', quarto=quarto_a1, status='Ocupado', residente=residente_ana)
        cama_a1_2 = Cama.objects.create(numero='A1-01-B', quarto=quarto_a1, status='Ocupado', residente=residente_bruno)
        cama_a2_1 = Cama.objects.create(numero='A1-02-A', quarto=quarto_a2, status='Disponível')
        cama_b1_1 = Cama.objects.create(numero='B-1-A', quarto=quarto_b1, status='Ocupado', residente=residente_carla)
        cama_b1_2 = Cama.objects.create(numero='B-1-B', quarto=quarto_b1, status='Disponível')

        residencia_a = Residencia.objects.create(Nome='Alojamento A1-01', edificio=edificio_a)
        residencia_b = Residencia.objects.create(Nome='Apartamento B-1', edificio=edificio_b)
        residencia_individual = Residencia.objects.create(Nome='Quarto Individual A1-02', edificio=edificio_a)

        # -------------------- CANDIDATURAS --------------------
        print("Criando dados de candidaturas...")
        try:
            estudante1_user = CustomUser.objects.get(username='estudante1')
            estudante2_user = CustomUser.objects.get(username='estudante2')

            estudante1 = Estudante.objects.create(user=estudante1_user, Nome='Estudante Um')
            estudante2 = Estudante.objects.create(user=estudante2_user, Nome='Estudante Dois')

        except CustomUser.DoesNotExist:
            self.stdout.write(self.style.ERROR('Utilizadores estudante1 ou estudante2 não encontrados.'))
            return
        except Estudante.DoesNotExist:
            self.stdout.write(self.style.ERROR('Instâncias de Estudante não encontradas.'))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro ao criar/obter estudantes: {e}'))
            return

        candidatura_1 = Candidatura.objects.create(
            estudante=estudante1,
            data_submissao=timezone.now() - timezone.timedelta(days=5),
            status='pendente',
            residencia=residencia_individual,
        )
        print(f"Candidatura '{candidatura_1.id}' criada para '{estudante1_user.username}'.")

        candidatura_2 = Candidatura.objects.create(
            estudante=estudante2,
            data_submissao=timezone.now() - timezone.timedelta(days=10),
            status='aprovado',
            residencia=residencia_b,
        )
        print(f"Candidatura '{candidatura_2.id}' criada e aceite para '{estudante2_user.username}'.")

        candidatura_3 = Candidatura.objects.create(
            estudante=estudante1,
            data_submissao=timezone.now() - timezone.timedelta(hours=2),
            status='em_analise',
            residencia=residencia_b,
        )
        print(f"Segunda candidatura '{candidatura_3.id}' criada para '{estudante1_user.username}'.")

        candidatura_4 = Candidatura.objects.create(
            estudante=estudante2,
            data_submissao=timezone.now() - timezone.timedelta(hours=1),
            status='rejeitado',
            residencia=residencia_a,
        )
        print(f"Candidatura '{candidatura_4.id}' criada e rejeitada para '{estudante2_user.username}'.")

        self.stdout.write(self.style.SUCCESS('Dados de teste populados com sucesso!'))