from django.urls import path
from . import views

urlpatterns = [
    # Rotas de Residentes
    path('residentes/', views.lista_residentes, name='lista_residentes'),
    path('residentes/<int:pk>/', views.detalhe_residente, name='detalhe_residente'),
    path('residentes/quarto/<int:quarto_id>/', views.residentes_por_quarto, name='residentes_por_quarto'),
    path('residentes/total/', views.total_residentes, name='total_residentes'),
    path('residentes/edificio/<int:edificio_id>/', views.residentes_por_edificio, name='residentes_por_edificio'),
    path('residentes/edificio/', views.residentes_por_edificio, name='residentes_por_edificio'),

    # Rotas de Edifícios
    path('edificios/', views.lista_edificios, name='lista_edificios'),
    path('edificios/<int:pk>/', views.detalhe_edificio, name='detalhe_edificio'),
    path('edificios/tipo/', views.edificios_por_tipo, name='edificios_por_tipo'),
    

    # Rotas de Quartos
    path('quartos/', views.lista_quartos, name='lista_quartos'),
    path('quartos/<int:pk>/', views.detalhe_quarto, name='detalhe_quarto'),
    path('quartos/edificio/<int:edificio_id>/', views.quartos_por_edificio, name='quartos_por_edificio'),
    path('quartos/tipo/<str:tipo>/', views.quartos_por_tipo, name='quartos_por_tipo'),
    path('quartos/relatorio/', views.relatorio_quartos, name='relatorio_quartos'),

    # Rotas de Camas
    path('camas/', views.lista_camas, name='lista_camas'),
    path('camas/<int:pk>/', views.detalhe_cama, name='detalhe_cama'),
    path('camas/quarto/<int:quarto_id>/', views.camas_por_quarto, name='camas_por_quarto'),
    path('camas/status/<str:status>/', views.camas_por_status, name='camas_por_status'),
    path('camas/relatorio/', views.relatorio_camas, name='relatorio_camas'),

    # Rotas de Residências
    path('residencias/', views.lista_residencias_view, name='lista_residencias'),
    path('residencias/<int:pk>/', views.detalhe_residencia_view, name='detalhe_residencia'),
]
