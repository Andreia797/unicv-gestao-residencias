from django.urls import path
from . import views
from .views import ListarCandidaturasView, AtualizarEstadoCandidaturaView, MinhaCandidaturaView, CandidaturaDetailView, CandidaturasPorEstadoView , CandidaturasPorEstudanteView , CandidaturasPorResidenciaView , ListaVagasView, ListarTodosQuartosView, QuartoDetailView , AlterarDisponibilidadeQuartoView

urlpatterns = [
    path('', ListarCandidaturasView.as_view(), name='lista_candidaturas'),
    path('candidaturas/', ListarCandidaturasView.as_view(), name='candidaturas'),
    path('<int:pk>/', CandidaturaDetailView.as_view(), name='detalhe_candidatura'),
    path('residencia/<int:residencia_id>/', CandidaturasPorResidenciaView.as_view(), name='candidaturas_por_residencia'),
    path('estudante/<int:estudante_id>/', CandidaturasPorEstudanteView.as_view(), name='candidaturas_por_estudante'),
    path('estado/', CandidaturasPorEstadoView.as_view(), name='candidaturas_por_estado'),
    path('listar/', ListarCandidaturasView.as_view(), name='listar_candidaturas_cbv'),
    path('atualizar/<int:id>/', AtualizarEstadoCandidaturaView.as_view(), name='atualizar_estado'),
    path('minha/', MinhaCandidaturaView.as_view(), name='minha_candidatura_cbv'),
    path('vagas/', ListaVagasView.as_view(), name='lista_vagas'),
    path('quartos/', ListarTodosQuartosView.as_view(), name='listar_todos_quartos'),
    path('quartos/<int:pk>/',QuartoDetailView.as_view(), name='editar_quarto'),
    path('quartos/<int:pk>/', QuartoDetailView.as_view(), name='excluir_quarto'),
    path('quartos/<int:pk>/disponibilidade/', AlterarDisponibilidadeQuartoView.as_view() , name='alterar_disponibilidade_quarto'),
]