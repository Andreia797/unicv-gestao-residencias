import os
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Edificio, Quarto, Residente, Cama, Residencia
from candidaturas.models import Candidatura, Estudante
from accounts.models import CustomUser

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados de teste'

    def handle(self, *args, **options):
        # -------------------- CORE --------------------
        self.stdout.write(self.style.NOTICE("Criando dados do núcleo..."))
        edificios = [
            Edificio.objects.create(nome='Edifício Gama', endereco='Alameda dos Cientistas, 300', numeroApartamentos=25, tipo='residencial'),
            Edificio.objects.create(nome='Moradia Delta', endereco='Travessa da Inovação, 400', numeroApartamentos=15, tipo='residencial'),
            Edificio.objects.create(nome='Bloco Epsilon', endereco='Praça do Conhecimento, 500', numeroApartamentos=35, tipo='misto'),
            Edificio.objects.create(nome='Edifício Zeta', endereco='Avenida Tecnológica, 600', numeroApartamentos=18, tipo='residencial'),
            Edificio.objects.create(nome='Residencial Eta', endereco='Rua dos Inventores, 700', numeroApartamentos=22, tipo='residencial'),
            Edificio.objects.create(nome='Conjunto Teta', endereco='Largo da Descoberta, 800', numeroApartamentos=28, tipo='misto'),
            Edificio.objects.create(nome='Edifício Iota', endereco='Estrada da Pesquisa, 900', numeroApartamentos=12, tipo='residencial'),
            Edificio.objects.create(nome='Moradas Kappa', endereco='Viela do Saber, 1000', numeroApartamentos=32, tipo='residencial'),
            Edificio.objects.create(nome='Bloco Lambda', endereco='Rotunda do Futuro, 1100', numeroApartamentos=16, tipo='misto'),
            Edificio.objects.create(nome='Edifício Mi', endereco='Avenida da Criatividade, 1200', numeroApartamentos=20, tipo='residencial'),
        ]

        quartos = [
            Quarto.objects.create(numero='G-101', capacidade=2, edificio=edificios[0], tipo='duplo'),
            Quarto.objects.create(numero='G-102', capacidade=1, edificio=edificios[0], tipo='individual'),
            Quarto.objects.create(numero='D-201', capacidade=2, edificio=edificios[1], tipo='duplo'),
            Quarto.objects.create(numero='E-301', capacidade=3, edificio=edificios[2], tipo='triplo'),
            Quarto.objects.create(numero='Z-401', capacidade=1, edificio=edificios[3], tipo='individual'),
            Quarto.objects.create(numero='H-501', capacidade=2, edificio=edificios[4], tipo='duplo'),
            Quarto.objects.create(numero='T-601', capacidade=2, edificio=edificios[5], tipo='duplo'),
            Quarto.objects.create(numero='I-701', capacidade=1, edificio=edificios[6], tipo='individual'),
            Quarto.objects.create(numero='K-801', capacidade=3, edificio=edificios[7], tipo='triplo'),
            Quarto.objects.create(numero='L-901', capacidade=2, edificio=edificios[8], tipo='duplo'),
        ]

        residentes = [
            Residente.objects.create(nome='Diana Sousa', email='diana.s@example.com', telefone='945678901'),
            Residente.objects.create(nome='Eduardo Ferreira', email='eduardo.f@example.com', telefone='956789012'),
            Residente.objects.create(nome='Filipa Martins', email='filipa.m@example.com', telefone='967890123'),
            Residente.objects.create(nome='Gustavo Pereira', email='gustavo.p@example.com', telefone='978901234'),
            Residente.objects.create(nome='Helena Rodrigues', email='helena.r@example.com', telefone='989012345'),
            Residente.objects.create(nome='Ivo Costa', email='ivo.c@example.com', telefone='990123456'),
            Residente.objects.create(nome='Júlia Fernandes', email='julia.f@example.com', telefone='901234567'),
            Residente.objects.create(nome='Luís Gonçalves', email='luis.g@example.com', telefone='912345670'),
            Residente.objects.create(nome='Mariana Alves', email='mariana.a@example.com', telefone='923456701'),
            Residente.objects.create(nome='Nuno Ribeiro', email='nuno.r@example.com', telefone='934567012'),
        ]

        camas = [
            Cama.objects.create(numero='G-101-A', quarto=quartos[0], status='Disponível'),
            Cama.objects.create(numero='G-101-B', quarto=quartos[0], status='Ocupado', residente=residentes[0]),
            Cama.objects.create(numero='G-102-A', quarto=quartos[1], status='Disponível'),
            Cama.objects.create(numero='D-201-A', quarto=quartos[2], status='Ocupado', residente=residentes[1]),
            Cama.objects.create(numero='D-201-B', quarto=quartos[2], status='Disponível'),
            Cama.objects.create(numero='E-301-A', quarto=quartos[3], status='Ocupado', residente=residentes[2]),
            Cama.objects.create(numero='E-301-B', quarto=quartos[3], status='Disponível'),
            Cama.objects.create(numero='E-301-C', quarto=quartos[3], status='Ocupado', residente=residentes[3]),
            Cama.objects.create(numero='Z-401-A', quarto=quartos[4], status='Disponível'),
            Cama.objects.create(numero='H-501-A', quarto=quartos[5], status='Ocupado', residente=residentes[4]),
            Cama.objects.create(numero='H-501-B', quarto=quartos[5], status='Disponível'),
            Cama.objects.create(numero='T-601-A', quarto=quartos[6], status='Disponível'),
            Cama.objects.create(numero='T-601-B', quarto=quartos[6], status='Ocupado', residente=residentes[5]),
            Cama.objects.create(numero='I-701-A', quarto=quartos[7], status='Disponível'),
            Cama.objects.create(numero='K-801-A', quarto=quartos[8], status='Ocupado', residente=residentes[6]),
            Cama.objects.create(numero='K-801-B', quarto=quartos[8], status='Disponível'),
            Cama.objects.create(numero='K-801-C', quarto=quartos[8], status='Ocupado', residente=residentes[7]),
            Cama.objects.create(numero='L-901-A', quarto=quartos[9], status='Disponível'),
            Cama.objects.create(numero='L-901-B', quarto=quartos[9], status='Ocupado', residente=residentes[8]),
            Cama.objects.create(numero='M-1001-A', quarto=quartos[0], status='Disponível'), # Adicionando mais uma cama para completar 10
        ]

        residencias = [
            Residencia.objects.create(Nome='Alojamento G-101', edificio=edificios[0]),
            Residencia.objects.create(Nome='Quarto Individual G-102', edificio=edificios[0]),
            Residencia.objects.create(Nome='Apartamento D-201', edificio=edificios[1]),
            Residencia.objects.create(Nome='Residência E-301', edificio=edificios[2]),
            Residencia.objects.create(Nome='Quarto Individual Z-401', edificio=edificios[3]),
            Residencia.objects.create(Nome='Alojamento H-501', edificio=edificios[4]),
            Residencia.objects.create(Nome='Apartamento T-601', edificio=edificios[5]),
            Residencia.objects.create(Nome='Quarto Individual I-701', edificio=edificios[6]),
            Residencia.objects.create(Nome='Residência K-801', edificio=edificios[7]),
            Residencia.objects.create(Nome='Alojamento L-901', edificio=edificios[8]),
        ]

        # -------------------- CANDIDATURAS --------------------
        self.stdout.write(self.style.NOTICE("Criando dados de candidaturas..."))
        try:
            estudantes = list(Estudante.objects.all())
            residencias_disponiveis = list(Residencia.objects.all())

            if not estudantes:
                self.stdout.write(self.style.WARNING("Atenção: Não existem estudantes para criar candidaturas."))
            else:
                candidaturas_criadas = []
                for i in range(10):
                    estudante = estudantes[i % len(estudantes)]
                    residencia = residencias_disponiveis[i % len(residencias_disponiveis)]
                    data_submissao = timezone.now() - timezone.timedelta(days=i)
                    status_opcoes = ['pendente', 'aprovado', 'em_analise', 'rejeitado']
                    status = status_opcoes[i % len(status_opcoes)]

                    # Tentar garantir que as candidaturas não sejam exatamente iguais
                    # (você pode precisar de uma lógica mais sofisticada aqui dependendo dos seus requisitos)
                    while Candidatura.objects.filter(estudante=estudante, residencia=residencia, data_submissao=data_submissao).exists():
                        data_submissao = timezone.now() - timezone.timedelta(hours=i) # Varia a data um pouco

                    candidatura = Candidatura.objects.create(
                        estudante=estudante,
                        data_submissao=data_submissao,
                        status=status,
                        residencia=residencia,
                    )
                    candidaturas_criadas.append(candidatura)
                    self.stdout.write(self.style.SUCCESS(f"Candidatura '{candidatura.id}' criada para '{estudante.user.username}' para '{residencia.Nome}'."))

        except Estudante.DoesNotExist:
            self.stdout.write(self.style.ERROR("Erro: Instância de Estudante não encontrada."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erro ao criar dados de candidaturas: {e}"))

        self.stdout.write(self.style.SUCCESS('Dados de teste populados com sucesso!'))

if __name__ == '__main__':
    # Configurar o Django (se ainda não estiver configurado em um script standalone)
    import django
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings") # Substitua 'backend.settings' pelo seu arquivo de settings
    django.setup()
    # A chamada para popular_dados() agora está dentro da classe Command
    pass