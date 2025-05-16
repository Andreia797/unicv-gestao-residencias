from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from rest_framework import status
from django.shortcuts import get_object_or_404
from core.models import Edificio, Quarto, Residente, Cama, Residencia as ResidenciaCore
from core.serializers import EdificioSerializer, QuartoSerializer, ResidenteSerializer, CamaSerializer, ResidenciaSerializer as ResidenciaCoreSerializer
from django.db.models import Count

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) # Mantemos a autenticação
def lista_residentes(request):
    if request.method == 'GET':
        if request.user.has_perm('core.view_residente'): # Verificação de permissão no app 'core'
            residentes = Residente.objects.all()
            serializer = ResidenteSerializer(residentes, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Você não tem permissão para listar residentes.'}, status=status.HTTP_403_FORBIDDEN)
    elif request.method == 'POST':
        if request.user.has_perm('core.add_residente'): # Verificação de permissão no app 'core'
            serializer = ResidenteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Você não tem permissão para adicionar residentes.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_residente(request, pk):
    # DjangoModelPermissions já cuidará das permissões view, change e delete
    residente = get_object_or_404(Residente, pk=pk)
    serializer = ResidenteSerializer(residente)
    if request.method == 'GET':
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
    # DjangoModelPermissions já cuidará da permissão view_residente
    residentes = Residente.objects.filter(cama__quarto_id=quarto_id).distinct()
    serializer = ResidenteSerializer(residentes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def total_residentes(request):
    # DjangoModelPermissions já cuidará da permissão view_residente
    total = Residente.objects.count()
    return Response({'totalResidentes': total})

@api_view(['GET']) # Assumindo que é apenas uma requisição GET
@permission_classes([IsAuthenticated])
def residentes_por_edificio(request):
    if request.user.has_perm('core.view_residente'):
        edificio_id = request.query_params.get('edificio_id') # Ou como você espera receber o ID do edifício
        if edificio_id:
            residentes = Residente.objects.filter(quarto__edificio_id=edificio_id)
            serializer = ResidenteSerializer(residentes, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Por favor, forneça o ID do edifício.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Você não tem permissão para visualizar residentes por edifício.'}, status=status.HTTP_403_FORBIDDEN)

# Edifícios
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_edificios(request):
    # DjangoModelPermissions cuidará de view_edificio e add_edificio
    if request.method == 'GET':
        edificios = Edificio.objects.all()
        serializer = EdificioSerializer(edificios, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EdificioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_edificio(request, pk):
    # DjangoModelPermissions cuidará de view_edificio, change_edificio e delete_edificio
    edificio = get_object_or_404(Edificio, pk=pk)
    serializer = EdificioSerializer(edificio)
    if request.method == 'GET':
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
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def edificios_por_tipo(request):
    # DjangoModelPermissions cuidará de view_edificio
    tipos = Edificio.objects.values('tipo').annotate(count=Count('id'))
    total_por_tipo = [{'name': edificio['tipo'], 'count': edificio['count']} for edificio in tipos]
    return Response({'totalPorTipo': total_por_tipo})

# Quartos
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_quartos(request):
    # DjangoModelPermissions cuidará de view_quarto e add_quarto
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
    # DjangoModelPermissions cuidará de view_quarto, change_quarto e delete_quarto
    quarto = get_object_or_404(Quarto, pk=pk)
    serializer = QuartoSerializer(quarto)
    if request.method == 'GET':
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
    # DjangoModelPermissions cuidará de view_quarto
    quartos = Quarto.objects.filter(edificio_id=edificio_id)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def quartos_por_tipo(request, tipo):
    # DjangoModelPermissions cuidará de view_quarto
    quartos = Quarto.objects.filter(tipo=tipo)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def relatorio_quartos(request):
    # DjangoModelPermissions cuidará da permissão necessária (provavelmente view_quarto)
    total_quartos = Quarto.objects.count()
    quartos_livres = Quarto.objects.filter(cama__residente__isnull=True).distinct().count()
    quartos_ocupados = total_quartos - quartos_livres
    return Response({
        'totalQuartos': total_quartos,
        'quartosLivres': quartos_livres,
        'quartosOcupados': quartos_ocupados,
    })

# Camas
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_camas(request):
    # DjangoModelPermissions cuidará de view_cama e add_cama
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
    # DjangoModelPermissions cuidará de view_cama, change_cama e delete_cama
    cama = get_object_or_404(Cama, pk=pk)
    serializer = CamaSerializer(cama)
    if request.method == 'GET':
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
    # DjangoModelPermissions cuidará de view_cama
    camas = Cama.objects.filter(quarto_id=quarto_id)
    serializer = CamaSerializer(camas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def camas_por_status(request, status_param):
    # DjangoModelPermissions cuidará de view_cama
    camas = Cama.objects.filter(status=status_param)
    serializer = CamaSerializer(camas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def relatorio_camas(request):
    # DjangoModelPermissions cuidará da permissão necessária (provavelmente view_cama)
    total_camas = Cama.objects.count()
    camas_livres = Cama.objects.filter(residente__isnull=True).count()
    camas_ocupadas = total_camas - camas_livres
    return Response({
        'totalCamas': total_camas,
        'camasLivres': camas_livres,
        'camasOcupadas': camas_ocupadas,
    })

# Residências (Core)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_residencias_view(request):
    # DjangoModelPermissions cuidará de view_residencia e add_residencia
    if request.method == 'GET':
        residencias = ResidenciaCore.objects.all()
        serializer = ResidenciaCoreSerializer(residencias, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ResidenciaCoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_residencia_view(request, pk):
    # DjangoModelPermissions cuidará de view_residencia, change_residencia e delete_residencia
    residencia = get_object_or_404(ResidenciaCore, pk=pk)
    serializer = ResidenciaCoreSerializer(residencia)
    if request.method == 'GET':
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