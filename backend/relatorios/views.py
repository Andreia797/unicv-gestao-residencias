from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, AllowAny
from django.contrib.auth.decorators import permission_required
from django.shortcuts import get_object_or_404
from core.models import Edificio, Quarto, Residente, Cama, Residencia as ResidenciaCore
from core.serializers import EdificioSerializer, QuartoSerializer, ResidenteSerializer, CamaSerializer, ResidenciaSerializer as ResidenciaCoreSerializer
from django.db.models import Count

# Residentes
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_residentes(request):
    # Requer permissão para listar e adicionar residentes
    if request.method == 'GET':
        residentes = Residente.objects.all()
        serializer = ResidenteSerializer(residentes, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ResidenteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def detalhe_residente(request, pk):
    # Requer permissão para visualizar, alterar e deletar residentes
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
    # Requer permissão para listar residentes
    residentes = Residente.objects.filter(cama__quarto_id=quarto_id).distinct()
    serializer = ResidenteSerializer(residentes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def total_residentes(request):
    # Requer permissão para visualizar informações gerais
    total = Residente.objects.count()
    return Response({'totalResidentes': total})

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def residentes_por_edificio(request):
    # Requer permissão para visualizar informações gerais
    residentes_por_edificio_data = Edificio.objects.annotate(num_residentes=Count('quarto__cama__residente', distinct=True)).values('nome', 'num_residentes')
    return Response(residentes_por_edificio_data)

# Edifícios
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_edificios(request):
    # Requer permissão para listar e adicionar edifícios
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
    # Requer permissão para visualizar, alterar e deletar edifícios
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
    # Requer permissão para visualizar informações gerais
    tipos = Edificio.objects.values('tipo').annotate(count=Count('id'))
    total_por_tipo = [{'name': edificio['tipo'], 'count': edificio['count']} for edificio in tipos]
    return Response({'totalPorTipo': total_por_tipo})

# Quartos
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def lista_quartos(request):
    # Requer permissão para listar e adicionar quartos
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
    # Requer permissão para visualizar, alterar e deletar quartos
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
    # Requer permissão para listar quartos
    quartos = Quarto.objects.filter(edificio_id=edificio_id)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def quartos_por_tipo(request, tipo):
    # Requer permissão para listar quartos
    quartos = Quarto.objects.filter(tipo=tipo)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def relatorio_quartos(request):
    # Requer permissão para visualizar relatórios
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
    # Requer permissão para listar e adicionar camas
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
    # Requer permissão para visualizar, alterar e deletar camas
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
    # Requer permissão para listar camas
    camas = Cama.objects.filter(quarto_id=quarto_id)
    serializer = CamaSerializer(camas, many=True)  # Provavelmente a linha 210
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def camas_por_status(request, status_param):
    # Requer permissão para listar camas
    camas = Cama.objects.filter(status=status_param)
    serializer = CamaSerializer(camas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, DjangoModelPermissions])
def relatorio_camas(request):
    # Requer permissão para visualizar relatórios
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
@permission_classes([AllowAny]) # Ajuste conforme a necessidade de autenticação
def lista_residencias_view(request):
    # Permissões para listar e adicionar residências
    if request.method == 'GET':
        residencias = ResidenciaCore.objects.all()
        serializer = ResidenciaCoreSerializer(residencias, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if request.user.is_staff or request.user.has_perm('core.add_residencia'): # Exemplo de permissão para funcionários/admins
            serializer = ResidenciaCoreSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para adicionar residências.")

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny]) # Ajuste conforme a necessidade de autenticação
def detalhe_residencia_view(request, pk):
    # Permissões para visualizar, alterar e deletar residências
    residencia = get_object_or_404(ResidenciaCore, pk=pk)
    serializer = ResidenciaCoreSerializer(residencia)
    if request.method == 'GET':
        return Response(serializer.data)
    elif request.method == 'PUT':
        if request.user.is_staff or request.user.has_perm('core.change_residencia'): # Exemplo de permissão para funcionários/admins
            serializer = ResidenciaCoreSerializer(residencia, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para alterar esta residência.")
    elif request.method == 'DELETE':
        if request.user.is_staff or request.user.has_perm('core.delete_residencia'): # Exemplo de permissão para funcionários/admins
            residencia.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para deletar esta residência.")