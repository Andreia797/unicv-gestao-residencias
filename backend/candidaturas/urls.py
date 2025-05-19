from django.urls import path
from . import views
from .views import ListarCandidaturasView, AtualizarEstadoCandidaturaView, MinhaCandidaturaView

urlpatterns = [
    path('', views.lista_candidaturas, name='lista_candidaturas'),
    path('<int:pk>/', views.detalhe_candidatura, name='detalhe_candidatura'),
    path('residencia/<int:residencia_id>/', views.candidaturas_por_residencia, name='candidaturas_por_residencia'),
    path('estudante/<int:estudante_id>/', views.candidaturas_por_estudante, name='candidaturas_por_estudante'),
    path('estado/', views.candidaturas_por_estado, name='candidaturas_por_estado'),
    path('listar/', ListarCandidaturasView.as_view(), name='listar_candidaturas_cbv'),
    path('atualizar/<int:id>/', AtualizarEstadoCandidaturaView.as_view(), name='atualizar_estado'),
    path('minha/', MinhaCandidaturaView.as_view(), name='minha_candidatura_cbv'),
    path('vagas/', views.lista_vagas, name='lista_vagas'),
    path('quartos/', views.listar_todos_quartos, name='listar_todos_quartos'),
    path('quartos/<int:pk>/', views.editar_quarto, name='editar_quarto'),
    path('quartos/<int:pk>/', views.excluir_quarto, name='excluir_quarto'),
    path('quartos/<int:pk>/disponibilidade/', views.alterar_disponibilidade_quarto, name='alterar_disponibilidade_quarto'),
]