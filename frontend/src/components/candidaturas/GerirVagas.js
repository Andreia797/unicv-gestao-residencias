import React, { useEffect, useState, useContext } from 'react';
import AuthService from '../../services/AuthService';
import {
    Paper, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button,
    IconButton, Tooltip, Pagination
} from '@mui/material';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const GerenciarVagas = () => {
    const [quartos, setQuartos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [pagina, setPagina] = useState(1);
    const resultadosPorPagina = 8;

    useEffect(() => {
        const fetchTodosQuartos = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.listarTodosQuartosAdmin();
                setQuartos(response.data);
            } catch (err) {
                console.error('Erro ao buscar todos os quartos:', err);
                setError('Erro ao carregar os quartos.');
            } finally {
                setLoading(false);
            }
        };

        if (authToken && (user?.groups?.includes('funcionario') || user?.groups?.includes('administrador'))) {
            fetchTodosQuartos();
        } else if (authToken) {
            navigate('/login'); // Redirecionar se não tiver permissão
        }
    }, [authToken, user, navigate]);

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const totalPaginas = Math.ceil(quartos.length / resultadosPorPagina);

    const quartosPaginados = React.useMemo(() => {
        const inicio = (pagina - 1) * resultadosPorPagina;
        const fim = inicio + resultadosPorPagina;
        return quartos.slice(inicio, fim);
    }, [quartos, pagina]);

    const handleEditarQuarto = (id) => {
        navigate(`/editarquarto/${id}`);
    };

    const handleExcluirQuarto = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
            setLoading(true);
            setError(null);
            try {
                await AuthService.excluirQuarto(id);
                setQuartos(quartos.filter(quarto => quarto.id !== id));
            } catch (err) {
                console.error('Erro ao excluir o quarto:', err);
                setError('Erro ao excluir o quarto.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAlterarDisponibilidadeQuarto = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.alterarDisponibilidadeQuarto(id);
            setQuartos(quartos.map(quarto =>
                quarto.id === id ? { ...quarto, disponivel: response.data.disponivel } : quarto
            ));
        } catch (err) {
            console.error('Erro ao alterar a disponibilidade:', err);
            setError('Erro ao alterar a disponibilidade.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress sx={{ mt: 2 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (!user?.groups?.includes('funcionario') && !user?.groups?.includes('administrador')) {
        return <Alert severity="warning" sx={{ mt: 2 }}>Você não tem permissão para gerenciar os quartos.</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                Gestão de Vagas de Quartos
            </Typography>
            <List>
                {quartosPaginados.map((quarto) => (
                    <ListItem key={quarto.id} divider secondaryAction={
                        <>
                            <Tooltip title="Editar">
                                <IconButton edge="end" aria-label="editar" onClick={() => handleEditarQuarto(quarto.id)}>
                                    <EditIcon className="text-yellow-500"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                                <IconButton edge="end" aria-label="excluir" onClick={() => handleExcluirQuarto(quarto.id)}>
                                    <DeleteIcon className="text-red-500" />
                                </IconButton>
                            </Tooltip>
                            {/* Se você tiver um campo 'disponivel' no modelo Quarto */}
                            {quarto.hasOwnProperty('disponivel') && (
                                <Tooltip title={quarto.disponivel ? 'Ocultar' : 'Mostrar'}>
                                    <IconButton edge="end" aria-label="disponibilidade" onClick={() => handleAlterarDisponibilidadeQuarto(quarto.id)}>
                                        <VisibilityIcon color={quarto.disponivel ? 'secondary' : 'primary'} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </>
                    }>
                        <ListItemText
                            primary={`Quarto: ${quarto.numero} - ${quarto.edificio_detalhes?.nome || 'N/A'}`}
                            secondary={`Edifício: ${quarto.edificio_detalhes?.endereco || 'N/A'} | Capacidade: ${quarto.capacidade || 'N/A'} | Residentes: ${quarto.num_residentes || 0} | Tipo: ${quarto.tipo || 'N/A'}${quarto.hasOwnProperty('disponivel') ? ` | Disponível: ${quarto.disponivel ? 'Sim' : 'Não'}` : ''}`}
                        />
                    </ListItem>
                ))}
            </List>
            {quartos.length > 0 && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Total de Quartos: {quartos.length}
                    </Typography>
                  )}
            {quartos.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 flex justify-end items-center">
                    <Pagination
                        count={totalPaginas}
                        page={pagina}
                        onChange={handleChangePage}
                        color="primary"
                        size="large"
                    />
                </div>
            )}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/adicionarquarto">
                Adicionar Novo Quarto
            </Button>
        </Paper>
    );
};

export default GerenciarVagas;