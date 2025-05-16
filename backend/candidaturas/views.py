from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Count, OuterRef
from rest_framework.permissions import IsAuthenticated

from .models import Residencia, Candidatura
from .serializers import CandidaturaSerializer, ResidenciaSerializer

class EstudantePermission(permissions.BasePermission):
    """Permissão customizada para verificar se o usuário é um estudante."""
    def has_permission(self, request, view):
        return hasattr(request.user, 'estudante')

class ListarCandidaturasView(APIView):
    """Lista todas as candidaturas (requer permissão de visualização)."""
    permission_classes = [permissions.IsAuthenticated, permissions.DjangoModelPermissions]
    queryset = Candidatura.objects.all()
    serializer_class = CandidaturaSerializer

    def get(self, request, *args, **kwargs):
        if request.user.has_perm('candidaturas.view_candidatura'):
            candidaturas = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(candidaturas, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para listar as candidaturas.")

class AtualizarEstadoCandidaturaView(APIView):
    """Atualiza o estado de uma candidatura específica (requer permissão de alteração)."""
    permission_classes = [permissions.IsAuthenticated, permissions.DjangoModelPermissions]
    queryset = Candidatura.objects.all()
    serializer_class = CandidaturaSerializer

    def put(self, request, id, *args, **kwargs):
        candidatura = get_object_or_404(self.get_queryset(), pk=id)
        if not request.user.has_perm('candidaturas.change_candidatura'):
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para alterar o estado desta candidatura.")
        serializer = self.get_serializer(candidatura, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MinhaCandidaturaView(APIView):
    """Retorna a candidatura do estudante logado (requer que o usuário seja estudante)."""
    permission_classes = [permissions.IsAuthenticated, EstudantePermission]

    def get(self, request, *args, **kwargs):
        try:
            minha_candidatura = Candidatura.objects.get(estudante=request.user.estudante)
            serializer = CandidaturaSerializer(minha_candidatura)
            return Response(serializer.data)
        except Candidatura.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lista_candidaturas(request):
    """
    Lista todas as candidaturas (requer permissão de visualização).
    Permite criar uma nova candidatura (apenas estudantes autenticados).
    """
    if request.method == 'GET':
        if request.user.has_perm('candidaturas.view_candidatura'):
            candidaturas = Candidatura.objects.all()
            serializer = CandidaturaSerializer(candidaturas, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para listar as candidaturas.")
    elif request.method == 'POST':
        if hasattr(request.user, 'estudante'):
            serializer = CandidaturaSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(estudante=request.user.estudante)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Apenas estudantes podem criar candidaturas.")

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def detalhe_candidatura(request, pk):
    """
    Retorna, atualiza ou deleta uma candidatura específica (requer permissões correspondentes).
    """
    try:
        candidatura = get_object_or_404(Candidatura, pk=pk)
    except Candidatura.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if request.user.has_perm('candidaturas.view_candidatura') or (hasattr(request.user, 'estudante') and candidatura.estudante == request.user.estudante):
            serializer = CandidaturaSerializer(candidatura)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para ver esta candidatura.")
    elif request.method == 'PUT':
        if request.user.has_perm('candidaturas.change_candidatura'):
            serializer = CandidaturaSerializer(candidatura, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para alterar esta candidatura.")
    elif request.method == 'DELETE':
        if request.user.has_perm('candidaturas.delete_candidatura'):
            candidatura.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif hasattr(request.user, 'estudante') and candidatura.estudante == request.user.estudante:
            candidatura.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para deletar esta candidatura.")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidaturas_por_residencia(request, residencia_id):
    """
    Lista as candidaturas para uma residência específica (requer permissão de visualização).
    """
    if request.user.has_perm('candidaturas.view_candidatura'):
        candidaturas = Candidatura.objects.filter(residencia_id=residencia_id)
        serializer = CandidaturaSerializer(candidaturas, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para listar candidaturas por residência.")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidaturas_por_estudante(request, estudante_id=None):
    """
    Lista as candidaturas de um estudante específico (requer permissão para ver outros, ou vê a própria).
    """
    if estudante_id:
        if request.user.has_perm('candidaturas.view_outras_candidaturas'):
            candidaturas = Candidatura.objects.filter(estudante_id=estudante_id)
            serializer = CandidaturaSerializer(candidaturas, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para ver candidaturas de outros estudantes.")
    else:
        if hasattr(request.user, 'estudante'):
            candidaturas = Candidatura.objects.filter(estudante=request.user.estudante)
            serializer = CandidaturaSerializer(candidaturas, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, detail="Usuário não é um estudante.")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidaturas_por_estado(request):
    """
    Lista a contagem de candidaturas por estado (requer permissão de visualização).
    """
    if request.user.has_perm('candidaturas.view_candidatura'):
        estados = Candidatura.objects.values('status').annotate(total=Count('id'))
        status_counts = [{'status': estado['status'], 'count': estado['total']} for estado in estados]
        return Response({'statusCounts': status_counts})
    else:
        return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para ver o relatório de candidaturas por estado.")

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Proteja a rota conforme necessário
def lista_vagas(request):
    """Retorna a lista de vagas disponíveis (requer permissão de visualização de residencias)."""
    if request.user.has_perm('core.view_residencia'): # Assumindo que 'core' é o app da Residencia
        vagas = Residencia.objects.filter(capacidade__gt=Residencia.objects.annotate(num_residentes=Count('residente')).filter(pk=OuterRef('pk')).values('num_residentes')) # Exemplo de lógica para vagas
        serializer = ResidenciaSerializer(vagas, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para ver as vagas disponíveis.")