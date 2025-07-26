from django.urls import path
from .views import (
    # Residentes
    ResidenteListCreateView, ResidenteDetailView,
    ResidentesPorQuartoView, 
    TotalResidentesView,     
    ResidentesPorEdificioView, 

    # Edifícios
    ListaEdificiosView, DetalheEdificioView,
    EdificiosPorTipoView,    

    # Quartos
    QuartoListCreateView, DetalheQuartoView,
    QuartosPorEdificioView, 
    QuartosPorTipoView,      
    RelatorioQuartosView,    

    # Camas
    CamaListCreateView, DetalheCamaView,
    CamasPorQuartoView,      
    CamasPorStatusView,      
    RelatorioCamasView,      

    # Residências
    ListaResidenciasAPIView, DetalheResidenciaView
)

urlpatterns = [
    # ----- Residentes -----
    path('residentes/', ResidenteListCreateView.as_view(), name='lista_residentes'),
    path('residentes/<int:pk>/', ResidenteDetailView.as_view(), name='detalhe_residente'),
    path('residentes/quarto/<int:quarto_id>/', ResidentesPorQuartoView.as_view(), name='residentes_por_quarto'),
    path('residentes/total/', TotalResidentesView.as_view(), name='total_residentes'),
    path('residentes/edificio/', ResidentesPorEdificioView.as_view(), name='residentes_por_edificio'),

    # ----- Edifícios -----
    path('edificios/', ListaEdificiosView.as_view(), name='lista_edificios'),
    path('edificios/<int:pk>/', DetalheEdificioView.as_view(), name='detalhe_edificio'),
    path('edificios/tipo/', EdificiosPorTipoView.as_view(), name='edificios_por_tipo'),

    # ----- Quartos -----
    path('quartos/', QuartoListCreateView.as_view(), name='lista_quartos'),
    path('quartos/<int:pk>/', DetalheQuartoView.as_view(), name='detalhe_quarto'),
    path('quartos/edificio/<int:edificio_id>/', QuartosPorEdificioView.as_view(), name='quartos_por_edificio'),
    path('quartos/tipo/<str:tipo>/', QuartosPorTipoView.as_view(), name='quartos_por_tipo'),
    path('quartos/relatorio/', RelatorioQuartosView.as_view(), name='relatorio_quartos'),

    # ----- Camas -----
    path('camas/', CamaListCreateView.as_view(), name='lista_camas'),
    path('camas/<int:pk>/', DetalheCamaView.as_view(), name='detalhe_cama'),
    path('camas/quarto/<int:quarto_id>/', CamasPorQuartoView.as_view(), name='camas_por_quarto'),
    path('camas/status/<str:status_param>/', CamasPorStatusView.as_view(), name='camas_por_status'),
    path('camas/relatorio/', RelatorioCamasView.as_view(), name='relatorio_camas'),

    # ----- Residências -----
    path('residencias/', ListaResidenciasAPIView.as_view(), name='lista_residencias'),
    path('residencias/<int:pk>/', DetalheResidenciaView.as_view(), name='detalhe_residencia'),
]
