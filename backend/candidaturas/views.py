from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics # Removido 'permissions' daqui
# Removido: from rest_framework.decorators import api_view, permission_classes # Não é mais necessário, todas as views são classes
from django.shortcuts import get_object_or_404
from django.db.models import Count, F

# Importações de modelos e serializers da aplicação 'candidaturas'
from .models import Candidatura
from .serializers import CandidaturaSerializer

# Importações de modelos e serializers da aplicação 'core'
from core.models import Quarto, Cama, Residente, Edificio, Residencia as ResidenciaCore
from core.serializers import (
    QuartoSerializer, ResidenciaSerializer as ResidenciaCoreSerializer,
    ResidenteSerializer, EdificioSerializer, CamaSerializer
)

# CORRIGIDO: Importação explícita de classes de permissão
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, BasePermission


class EstudantePermission(BasePermission): # Usando BasePermission diretamente
    """Permissão customizada para verificar se o usuário é um estudante."""
    def has_permission(self, request, view):
        """
        Verifica se o usuário autenticado tem um objeto 'estudante' associado.
        """
        return hasattr(request.user, 'estudante')


# ----- VIEWS DE CANDIDATURAS (Classes APIView) -----

class ListarCandidaturasView(APIView):
    """
    Lista todas as candidaturas e permite a criação de novas.
    Métodos suportados: GET (listar), POST (criar).
    Requer autenticação e permissões de modelo (view_candidatura para GET, add_candidatura para POST).
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        """
        Recupera a lista de todas as candidaturas.
        """
        candidaturas = Candidatura.objects.all()
        serializer = CandidaturaSerializer(candidaturas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Cria uma nova candidatura.
        """
        if not hasattr(request.user, 'estudante'):
            return Response({"detail": "Apenas estudantes podem criar candidaturas."}, status=status.HTTP_403_FORBIDDEN)

        if Candidatura.objects.filter(estudante=request.user.estudante).exists():
            return Response({"detail": "Você já possui uma candidatura."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CandidaturaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(estudante=request.user.estudante)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AtualizarEstadoCandidaturaView(APIView):
    """
    Atualiza o estado de uma candidatura específica.
    Método suportado: PUT.
    Requer autenticação e permissão de alteração (change_candidatura).
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def put(self, request, id, *args, **kwargs):
        """
        Atualiza o estado de uma candidatura.
        """
        candidatura = get_object_or_404(Candidatura, pk=id)
        serializer = CandidaturaSerializer(candidatura, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MinhaCandidaturaView(APIView):
    """
    Retorna a candidatura do estudante logado.
    Método suportado: GET.
    Requer que o usuário seja estudante e esteja autenticado.
    """
    permission_classes = [IsAuthenticated, EstudantePermission]

    def get(self, request, *args, **kwargs):
        """
        Recupera a candidatura do estudante autenticado.
        """
        try:
            minha_candidatura = Candidatura.objects.filter(estudante=request.user.estudante).first()
            if minha_candidatura:
                serializer = CandidaturaSerializer(minha_candidatura)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"detail": "Você não possui candidatura."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Erro inesperado ao buscar candidatura do estudante: {e}")
            return Response({"detail": f"Erro ao buscar candidatura: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CandidaturaDetailView(APIView):
    """
    Recupera, atualiza ou deleta uma candidatura específica.
    Métodos suportados: GET, PUT, PATCH, DELETE.
    Permissões: Administrador (via DjangoModelPermissions) ou o próprio estudante dono da candidatura.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_object(self, pk):
        """
        Helper para obter o objeto Candidatura e verificar permissões de objeto.
        Levanta PermissionDenied se o usuário não tiver acesso.
        """
        candidatura = get_object_or_404(Candidatura, pk=pk)
        if self.request.user.has_perm('candidaturas.view_candidatura') or \
           (hasattr(self.request.user, 'estudante') and candidatura.estudante == self.request.user.estudante):
            return candidatura
        raise permissions.PermissionDenied({"detail": "Você não tem permissão para acessar esta candidatura."})

    def get(self, request, pk, *args, **kwargs):
        """
        Recupera os detalhes de uma candidatura.
        """
        candidatura = self.get_object(pk)
        serializer = CandidaturaSerializer(candidatura)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        """
        Atualiza completamente uma candidatura.
        """
        candidatura = self.get_object(pk)
        serializer = CandidaturaSerializer(candidatura, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        """
        Atualiza parcialmente uma candidatura.
        """
        candidatura = self.get_object(pk)
        serializer = CandidaturaSerializer(candidatura, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        """
        Exclui uma candidatura.
        """
        candidatura = self.get_object(pk)
        candidatura.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidaturasPorResidenciaView(APIView):
    """
    Lista as candidaturas para uma residência específica.
    Método suportado: GET.
    Requer autenticação e permissão de visualização de candidatura.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, residencia_id, *args, **kwargs):
        """
        Recupera as candidaturas associadas a uma residência.
        """
        candidaturas = Candidatura.objects.filter(residencia_id=residencia_id)
        serializer = CandidaturaSerializer(candidaturas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CandidaturasPorEstudanteView(APIView):
    """
    Lista as candidaturas de um estudante específico (para admins/funcionários)
    ou a própria candidatura do usuário logado (se for estudante).
    Método suportado: GET.
    Requer autenticação e permissão de visualização de candidatura.
    """
    permission_classes = [IsAuthenticated] # DjangoModelPermissions não é necessário aqui para a lógica personalizada

    def get(self, request, estudante_id=None, *args, **kwargs):
        """
        Recupera as candidaturas de um estudante.
        """
        if estudante_id:
            # Para admins/funcionários visualizarem candidaturas de outros
            if not request.user.has_perm('candidaturas.view_candidatura'):
                return Response({"detail": "Você não tem permissão para ver candidaturas de outros estudantes."}, status=status.HTTP_403_FORBIDDEN)
            candidaturas = Candidatura.objects.filter(estudante_id=estudante_id)
            serializer = CandidaturaSerializer(candidaturas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Para o próprio estudante visualizar suas candidaturas
            if not hasattr(request.user, 'estudante'):
                return Response({"detail": "Usuário não é um estudante."}, status=status.HTTP_400_BAD_REQUEST)
            candidaturas = Candidatura.objects.filter(estudante=request.user.estudante)
            serializer = CandidaturaSerializer(candidaturas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class CandidaturasPorEstadoView(APIView):
    """
    Lista a contagem de candidaturas por estado.
    Método suportado: GET.
    Requer autenticação e permissão de visualização de candidatura.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        """
        Recupera a contagem de candidaturas agrupadas por estado.
        """
        estados = Candidatura.objects.values('status').annotate(total=Count('id'))
        status_counts = [{'status': estado['status'], 'count': estado['total']} for estado in estados]
        return Response({'statusCounts': status_counts}, status=status.HTTP_200_OK)


# ----- VIEWS DE QUARTOS (Classes APIView) -----
# Estas classes foram movidas para cá para resolver o problema no seu 'candidaturas/views.py'.
# Idealmente, se Quarto e Cama pertencem à app 'core', estas views deveriam estar em 'core/views.py'.

class ListaVagasView(APIView):
    """
    Retorna a lista de quartos com vagas disponíveis.
    Método suportado: GET.
    Requer autenticação e permissão de visualização de quarto.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        """
        Recupera os quartos com vagas disponíveis.
        """
        quartos_disponiveis = Quarto.objects.annotate(
            num_residentes=Count('camas__residente', distinct=True)
        ).filter(capacidade__gt=F('num_residentes'))
        serializer = QuartoSerializer(quartos_disponiveis, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListarTodosQuartosView(APIView):
    """
    Retorna a lista de todos os quartos para administradores e funcionários.
    Método suportado: GET.
    Requer autenticação e permissão de visualização de quarto.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        """
        Recupera a lista de todos os quartos.
        """
        quartos = Quarto.objects.annotate(
            num_residentes=Count('camas__residente', distinct=True)
        ).order_by('edificio__nome', 'numero')
        serializer = QuartoSerializer(quartos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuartoDetailView(APIView):
    """
    Recupera, atualiza, atualiza parcialmente ou deleta um quarto específico.
    Métodos suportados: GET, PUT, PATCH, DELETE.
    Requer autenticação e permissões de modelo (view_quarto, change_quarto, delete_quarto).
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_object(self, pk):
        """
        Helper para obter o objeto Quarto ou retornar 404.
        """
        return get_object_or_404(Quarto, pk=pk)

    def get(self, request, pk, *args, **kwargs):
        """
        Recupera os detalhes de um quarto.
        """
        quarto = self.get_object(pk)
        serializer = QuartoSerializer(quarto)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        """
        Atualiza completamente um quarto.
        """
        quarto = self.get_object(pk)
        serializer = QuartoSerializer(quarto, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        """
        Atualiza parcialmente um quarto ou sua disponibilidade.
        """
        quarto = self.get_object(pk)
        serializer = QuartoSerializer(quarto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Lógica de disponibilidade pode ser integrada aqui se o PATCH incluir esse campo
            # camas_ocupadas = Cama.objects.filter(quarto=quarto, residente__isnull=False).count()
            # disponivel = quarto.capacidade > camas_ocupadas
            # return Response({"id": quarto.id, "disponivel": disponivel}, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        """
        Exclui um quarto.
        """
        quarto = self.get_object(pk)
        quarto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AlterarDisponibilidadeQuartoView(APIView):
    """
    Altera a disponibilidade de um quarto com base na ocupação das camas.
    Método suportado: PATCH.
    Requer autenticação e permissão de alteração de quarto.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def patch(self, request, pk, *args, **kwargs):
        """
        Calcula e retorna a disponibilidade de um quarto.
        Opcionalmente, atualiza um campo 'disponivel' no modelo Quarto se existir.
        """
        quarto = get_object_or_404(Quarto, pk=pk)

        # Verifica a permissão para alterar o Quarto
        if not request.user.has_perm('core.change_quarto'):
            return Response({"detail": "Você não tem permissão para alterar a disponibilidade deste quarto."}, status=status.HTTP_403_FORBIDDEN)

        camas_ocupadas = Cama.objects.filter(quarto=quarto, residente__isnull=False).count()
        disponivel = quarto.capacidade > camas_ocupadas

        # Se o modelo Quarto tiver um campo 'disponivel', você pode atualizá-lo aqui.
        # Isso garante que a mudança seja persistida no banco de dados.
        # if hasattr(quarto, 'disponivel'):
        #     quarto.disponivel = disponivel
        #     quarto.save()

        return Response({"id": quarto.id, "disponivel": disponivel}, status=status.HTTP_200_OK)
