from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from candidaturas.models import Candidatura
from candidaturas.serializers import CandidaturaSerializer
from core.models import Edificio, Quarto, Residente, Cama, Residencia as ResidenciaCore
from core.serializers import EdificioSerializer, QuartoSerializer, ResidenteSerializer, CamaSerializer, ResidenciaSerializer as ResidenciaCoreSerializer
from estudantes.models import Estudante
from estudantes.serializers import EstudanteSerializer
from django.db.models import Count

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lista_candidaturas(request):
    if request.method == 'GET':
        candidaturas = Candidatura.objects.all()
        serializer = CandidaturaSerializer(candidaturas, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CandidaturaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def detalhe_candidatura(request, pk):
    try:
        candidatura = Candidatura.objects.get(pk=pk)
    except Candidatura.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CandidaturaSerializer(candidatura)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CandidaturaSerializer(candidatura, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        candidatura.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidaturas_por_residencia(request, residencia_id):
    candidaturas = Candidatura.objects.filter(residencia_id=residencia_id)
    serializer = CandidaturaSerializer(candidaturas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidaturas_por_estudante(request, estudante_id):
    candidaturas = Candidatura.objects.filter(estudante_id=estudante_id)
    serializer = CandidaturaSerializer(candidaturas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidaturas_por_estado(request):
    estados = Candidatura.objects.values('status').annotate(total=Count('id'))
    status_counts = [{'status': estado['status'], 'count': estado['total']} for estado in estados]
    return Response({'statusCounts': status_counts})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lista_residentes(request):
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
@permission_classes([IsAuthenticated])
def detalhe_residente(request, pk):
    try:
        residente = Residente.objects.get(pk=pk)
    except Residente.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
@permission_classes([IsAuthenticated])
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
    residentes_por_edificio_data = Edificio.objects.annotate(num_residentes=Count('quarto__cama__residente', distinct=True)).values('nome', 'num_residentes')
    return Response(residentes_por_edificio_data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lista_edificios(request):
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
@permission_classes([IsAuthenticated])
def detalhe_edificio(request, pk):
    try:
        edificio = Edificio.objects.get(pk=pk)
    except Edificio.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
    total_por_tipo = [{'name': edificio['tipo'], 'count': edificio['count']} for edificio in tipos]
    return Response({'totalPorTipo': total_por_tipo})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def detalhe_quarto(request, pk):
    try:
        quarto = Quarto.objects.get(pk=pk)
    except Quarto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
@permission_classes([IsAuthenticated])
def quartos_por_edificio(request, edificio_id):
    quartos = Quarto.objects.filter(edificio_id=edificio_id)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quartos_por_tipo(request, tipo):
    quartos = Quarto.objects.filter(tipo=tipo)
    serializer = QuartoSerializer(quartos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_quartos(request):
    total_quartos = Quarto.objects.count()
    quartos_livres = Quarto.objects.filter(cama__residente__isnull=True).distinct().count()
    quartos_ocupados = total_quartos - quartos_livres
    return Response({
        'totalQuartos': total_quartos,
        'quartosLivres': quartos_livres,
        'quartosOcupados': quartos_ocupados,
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def detalhe_cama(request, pk):
    try:
        cama = Cama.objects.get(pk=pk)
    except Cama.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
@permission_classes([IsAuthenticated])
def camas_por_quarto(request, quarto_id):
    camas = Cama.objects.filter(quarto_id=quarto_id)
    serializer = CamaSerializer(camas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def camas_por_status(request, status):
    camas = Cama.objects.filter(status=status)
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


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def lista_residencias_view(request):
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
@permission_classes([AllowAny]) 
def detalhe_residencia_view(request, pk):
    try:
        residencia = ResidenciaCore.objects.get(pk=pk)
    except ResidenciaCore.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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