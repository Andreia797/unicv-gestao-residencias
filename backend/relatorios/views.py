from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import status, permissions, generics
# Removido: from rest_framework.decorators import api_view, permission_classes # Não é mais necessário para as views refatoradas
from django.shortcuts import get_object_or_404
from django.db.models import Count, F # Mantido para queries de anotação
from core.models import Edificio, Quarto, Residente, Cama, Residencia as ResidenciaCore
from core.serializers import (
    EdificioSerializer, QuartoSerializer, ResidenteSerializer,
    CamaSerializer, ResidenciaSerializer as ResidenciaCoreSerializer
)

# Definindo constantes para permissões
PERM_VIEW_RESIDENTE = 'core.view_residente'
PERM_VIEW_EDIFICIO = 'core.view_edificio'
PERM_VIEW_QUARTO = 'core.view_quarto'
PERM_VIEW_CAMA = 'core.view_cama'

# ----- RESIDENTES -----

class ResidenteListCreateView(generics.ListCreateAPIView):
    """
    Lista todos os residentes e permite a criação de novos.
    Requer permissão de visualização (GET) e adição (POST) de residente.
    """
    queryset = Residente.objects.all()
    serializer_class = ResidenteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        # DjangoModelPermissions já verifica 'core.view_residente'
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # DjangoModelPermissions já verifica 'core.add_residente'
        return super().post(request, *args, **kwargs)


class ResidenteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retorna, atualiza ou deleta um residente específico.
    Requer permissões de visualização, alteração ou exclusão de residente.
    """
    queryset = Residente.objects.all()
    serializer_class = ResidenteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class ResidentesPorQuartoView(APIView):
    """
    Lista os residentes em um quarto específico.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_residente

    def get(self, request, quarto_id, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_RESIDENTE):
            return Response({'detail': 'Você não tem permissão para listar residentes por quarto.'}, status=status.HTTP_403_FORBIDDEN)
        residentes = Residente.objects.filter(cama__quarto_id=quarto_id).distinct()
        serializer = ResidenteSerializer(residentes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TotalResidentesView(APIView):
    """
    Retorna o número total de residentes.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_residente

    def get(self, request, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_RESIDENTE):
            return Response({'detail': 'Você não tem permissão para ver o total de residentes.'}, status=status.HTTP_403_FORBIDDEN)
        total = Residente.objects.count()
        return Response({'totalResidentes': total}, status=status.HTTP_200_OK)


class ResidentesPorEdificioView(APIView):
    """
    Lista residentes de um edifício específico.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_residente

    def get(self, request, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_RESIDENTE):
            return Response({'detail': 'Você não tem permissão para visualizar residentes por edifício.'}, status=status.HTTP_403_FORBIDDEN)

        edificio_id = request.query_params.get('edificio_id')
        if not edificio_id:
            return Response({'detail': 'ID do edifício não fornecido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            residentes = Residente.objects.filter(cama__quarto__edificio_id=edificio_id).distinct()
        except ValueError:
            return Response({'detail': 'O ID do edifício fornecido é inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ResidenteSerializer(residentes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ----- EDIFÍCIOS -----

class ListaEdificiosView(generics.ListCreateAPIView):
    """
    Lista todos os edifícios e permite a criação de novos.
    Requer permissão de visualização (GET) e adição (POST) de edifício.
    """
    queryset = Edificio.objects.all()
    serializer_class = EdificioSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        # DjangoModelPermissions já verifica 'core.view_edificio'
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # DjangoModelPermissions já verifica 'core.add_edificio'
        return super().post(request, *args, **kwargs)


class DetalheEdificioView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retorna, atualiza ou deleta um edifício específico.
    Requer permissões de visualização, alteração ou exclusão de edifício.
    """
    queryset = Edificio.objects.all()
    serializer_class = EdificioSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class EdificiosPorTipoView(APIView):
    """
    Retorna a contagem de edifícios por tipo.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_edificio

    def get(self, request, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_EDIFICIO):
            return Response({'detail': 'Você não tem permissão para ver edifícios por tipo.'}, status=status.HTTP_403_FORBIDDEN)
        tipos = Edificio.objects.values('tipo').annotate(count=Count('id'))
        total_por_tipo = [{'name': t['tipo'], 'count': t['count']} for t in tipos]
        return Response({'totalPorTipo': total_por_tipo}, status=status.HTTP_200_OK)


# ----- QUARTOS -----

class QuartoListCreateView(generics.ListCreateAPIView):
    """
    Lista todos os quartos e permite a criação de novos.
    Requer permissão de visualização (GET) e adição (POST) de quarto.
    """
    queryset = Quarto.objects.all()
    serializer_class = QuartoSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class DetalheQuartoView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retorna, atualiza ou deleta um quarto específico.
    Requer permissões de visualização, alteração ou exclusão de quarto.
    """
    queryset = Quarto.objects.all()
    serializer_class = QuartoSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class QuartosPorEdificioView(APIView):
    """
    Lista os quartos de um edifício específico.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_quarto

    def get(self, request, edificio_id, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_QUARTO):
            return Response({'detail': 'Você não tem permissão para listar quartos por edifício.'}, status=status.HTTP_403_FORBIDDEN)
        quartos = Quarto.objects.filter(edificio_id=edificio_id)
        serializer = QuartoSerializer(quartos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuartosPorTipoView(APIView):
    """
    Lista os quartos de um tipo específico.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_quarto

    def get(self, request, tipo, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_QUARTO):
            return Response({'detail': 'Você não tem permissão para listar quartos por tipo.'}, status=status.HTTP_403_FORBIDDEN)
        quartos = Quarto.objects.filter(tipo=tipo)
        serializer = QuartoSerializer(quartos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RelatorioQuartosView(APIView):
    """
    Retorna um relatório sobre o total de quartos, livres e ocupados.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_quarto

    def get(self, request, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_QUARTO):
            return Response({'detail': 'Você não tem permissão para ver o relatório de quartos.'}, status=status.HTTP_403_FORBIDDEN)
        total_quartos = Quarto.objects.count()
        quartos_livres = Quarto.objects.filter(camas__residente__isnull=True).distinct().count()
        quartos_ocupados = total_quartos - quartos_livres
        return Response({
            'totalQuartos': total_quartos,
            'quartosLivres': quartos_livres,
            'quartosOcupados': quartos_ocupados,
        }, status=status.HTTP_200_OK)


# ----- CAMAS -----

class CamaListCreateView(generics.ListCreateAPIView):
    """
    Lista todas as camas e permite a criação de novas.
    Requer permissão de visualização (GET) e adição (POST) de cama.
    """
    queryset = Cama.objects.all()
    serializer_class = CamaSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class DetalheCamaView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retorna, atualiza ou deleta uma cama específica.
    Requer permissões de visualização, alteração ou exclusão de cama.
    """
    queryset = Cama.objects.all()
    serializer_class = CamaSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CamasPorQuartoView(APIView):
    """
    Lista as camas de um quarto específico.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_cama

    def get(self, request, quarto_id, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_CAMA):
            return Response({'detail': 'Você não tem permissão para listar camas por quarto.'}, status=status.HTTP_403_FORBIDDEN)
        camas = Cama.objects.filter(quarto_id=quarto_id)
        serializer = CamaSerializer(camas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CamasPorStatusView(APIView):
    """
    Lista as camas com um status específico.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_cama

    def get(self, request, status_param, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_CAMA):
            return Response({'detail': 'Você não tem permissão para listar camas por status.'}, status=status.HTTP_403_FORBIDDEN)
        camas = Cama.objects.filter(status=status_param)
        serializer = CamaSerializer(camas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RelatorioCamasView(APIView):
    """
    Retorna um relatório sobre o total de camas, livres e ocupadas.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions] # Adicione permissão de modelo para view_cama

    def get(self, request, *args, **kwargs):
        if not request.user.has_perm(PERM_VIEW_CAMA):
            return Response({'detail': 'Você não tem permissão para ver o relatório de camas.'}, status=status.HTTP_403_FORBIDDEN)
        total_camas = Cama.objects.count()
        camas_livres = Cama.objects.filter(residente__isnull=True).count()
        camas_ocupadas = total_camas - camas_livres
        return Response({
            'totalCamas': total_camas,
            'camasLivres': camas_livres,
            'camasOcupadas': camas_ocupadas,
        }, status=status.HTTP_200_OK)


# ----- RESIDÊNCIAS -----

class ListaResidenciasAPIView(generics.ListCreateAPIView):
    """
    Lista todas as residências e permite a criação de novas.
    Requer permissão de visualização (GET) e adição (POST) de residência.
    """
    queryset = ResidenciaCore.objects.all()
    serializer_class = ResidenciaCoreSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class DetalheResidenciaView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retorna, atualiza ou deleta uma residência específica.
    Requer permissões de visualização, alteração ou exclusão de residência.
    """
    queryset = ResidenciaCore.objects.all()
    serializer_class = ResidenciaCoreSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]