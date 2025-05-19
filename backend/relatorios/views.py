from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework import permissions

from core.models import Edificio, Quarto, Residente, Cama, Residencia as ResidenciaCore
from core.serializers import (
    EdificioSerializer, QuartoSerializer, ResidenteSerializer,
    CamaSerializer, ResidenciaSerializer as ResidenciaCoreSerializer
)

# RESIDENTES
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lista_residentes(request):
    if request.method == 'GET':
        if request.user.has_perm('core.view_residente'):
            residentes = Residente.objects.all()
            serializer = ResidenteSerializer(residentes, many=True)
            return Response(serializer.data)
        return Response({'detail': 'Você não tem permissão para listar residentes.'}, status=status.HTTP_403_FORBIDDEN)
    elif request.method == 'POST':
        if request.user.has_perm('core.add_residente'):
            serializer = ResidenteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Você não tem permissão para adicionar residentes.'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_residente(request, pk):
    residente = get_object_or_404(Residente, pk=pk)
    if request.method == 'GET':
        serializer = ResidenteSerializer(residente)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ResidenteSerializer(residente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        residente.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def residentes_por_quarto(request, quarto_id):
    residentes = Residente.objects.filter(cama__quarto_id=quarto_id).distinct()
    serializer = ResidenteSerializer(residentes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def total_residentes(request):
    total = Residente.objects.count()
    return Response({'totalResidentes': total})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def residentes_por_edificio(request):
    if request.user.has_perm('core.view_residente'):
        edificio_id = request.query_params.get('edificio_id')
        if edificio_id:
            try:
                # Filtra as camas no edifício e depois pega os residentes dessas camas
                residentes = Residente.objects.filter(cama__quarto__edificio_id=edificio_id).distinct()
                serializer = ResidenteSerializer(residentes, many=True)
                return Response(serializer.data)
            except ValueError:
                return Response({'detail': 'O ID do edifício fornecido é inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Por favor, forneça o ID do edifício como um parâmetro de consulta (ex: ?edificio_id=...).'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'detail': 'Você não tem permissão para visualizar residentes por edifício.'}, status=status.HTTP_403_FORBIDDEN)

# EDIFÍCIOS
class ListaEdificiosView(ListCreateAPIView):
    queryset = Edificio.objects.all()
    serializer_class = EdificioSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

lista_edificios = ListaEdificiosView.as_view()
    
def get_queryset_edificios():
    return Edificio.objects.all()

lista_edificios.queryset = get_queryset_edificios()    


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_edificio(request, pk):
    edificio = get_object_or_404(Edificio, pk=pk)
    if request.method == 'GET':
        serializer = EdificioSerializer(edificio)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EdificioSerializer(edificio, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        edificio.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def edificios_por_tipo(request):
    tipos = Edificio.objects.values('tipo').annotate(count=Count('id'))
    total_por_tipo = [{'name': t['tipo'], 'count': t['count']} for t in tipos]
    return Response({'totalPorTipo': total_por_tipo})

# QUARTOS
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_quartos(request):
    if request.method == 'GET':
        quartos = Quarto.objects.all()
        serializer = QuartoSerializer(quartos, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = QuartoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_quarto(request, pk):
    quarto = get_object_or_404(Quarto, pk=pk)
    if request.method == 'GET':
        serializer = QuartoSerializer(quarto)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = QuartoSerializer(quarto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        quarto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def quartos_por_edificio(request, edificio_id):
    quartos = Quarto.objects.filter(edificio_id=edificio_id)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def quartos_por_tipo(request, tipo):
    quartos = Quarto.objects.filter(tipo=tipo)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_quartos(request):
    total_quartos = Quarto.objects.count()
    quartos_livres = Quarto.objects.filter(camas__residente__isnull=True).distinct().count()
    quartos_ocupados = total_quartos - quartos_livres
    return Response({
        'totalQuartos': total_quartos,
        'quartosLivres': quartos_livres,
        'quartosOcupados': quartos_ocupados,
    })


# CAMAS
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_camas(request):
    if request.method == 'GET':
        camas = Cama.objects.all()
        serializer = CamaSerializer(camas, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CamaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_cama(request, pk):
    cama = get_object_or_404(Cama, pk=pk)
    if request.method == 'GET':
        serializer = CamaSerializer(cama)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CamaSerializer(cama, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        cama.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def camas_por_quarto(request, quarto_id):
    camas = Cama.objects.filter(quarto_id=quarto_id)
    serializer = CamaSerializer(camas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def camas_por_status(request, status_param):
    camas = Cama.objects.filter(status=status_param)
    serializer = CamaSerializer(camas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_camas(request):
    total_camas = Cama.objects.count()
    camas_livres = Cama.objects.filter(residente__isnull=True).count()
    camas_ocupadas = total_camas - camas_livres
    return Response({
        'totalCamas': total_camas,
        'camasLivres': camas_livres,
        'camasOcupadas': camas_ocupadas,
    })

# RESIDÊNCIAS
class ListaResidenciasAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.DjangoModelPermissions]

    def get_queryset(self):
        return ResidenciaCore.objects.all()

    def get(self, request, *args, **kwargs):
        residencias = self.get_queryset()
        serializer = ResidenciaCoreSerializer(residencias, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ResidenciaCoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

lista_residencias_view = ListaResidenciasAPIView.as_view()

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_residencia_view(request, pk):
    residencia = get_object_or_404(ResidenciaCore, pk=pk)
    if request.method == 'GET':
        serializer = ResidenciaCoreSerializer(residencia)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ResidenciaCoreSerializer(residencia, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        residencia.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
