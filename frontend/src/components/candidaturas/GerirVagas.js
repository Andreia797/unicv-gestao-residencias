// GerenciarVagas.js
import React, { useEffect, useState, useContext } from 'react';
import AuthService from '../../services/AuthService';
import {
    Paper, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button
} from '@mui/material';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const GerenciarVagas = () => {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodasVagas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.listarTodasVagasAdmin();
                setVagas(response.data);
            } catch (err) {
                console.error('Erro ao buscar todas as vagas:', err);
                setError('Erro ao carregar as vagas.');
            } finally {
                setLoading(false);
            }
        };

        if (authToken && (user?.groups?.includes('funcionario') || user?.groups?.includes('administrador'))) {
            fetchTodasVagas();
        } else if (authToken) {
            navigate('/sem-permissao'); // Redirecionar se não tiver permissão
        }
    }, [authToken, user, navigate]);

    if (loading) {
        return <CircularProgress sx={{ mt: 2 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (!user?.groups?.includes('funcionario') && !user?.groups?.includes('administrador')) {
        return <Alert severity="warning" sx={{ mt: 2 }}>Você não tem permissão para gerenciar as vagas.</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                Gerenciar Vagas
            </Typography>
            <List>
                {vagas.map((vaga) => (
                    <ListItem key={vaga.id} divider>
                        <ListItemText
                            primary={vaga.nome}
                            secondary={`Localização: ${vaga.localizacao || 'N/A'} | Capacidade: ${vaga.capacidade || 'N/A'} | Disponível: ${vaga.disponivel ? 'Sim' : 'Não'}`}
                        />
                        {/* Adicionar botões de editar, excluir, alterar disponibilidade */}
                        <Button size="small" sx={{ ml: 2 }}>Editar</Button>
                        <Button size="small" color="error" sx={{ ml: 1 }}>Excluir</Button>
                        <Button size="small" color={vaga.disponivel ? 'secondary' : 'primary'} sx={{ ml: 1 }}>
                            {vaga.disponivel ? 'Ocultar' : 'Mostrar'}
                        </Button>
                    </ListItem>
                ))}
            </List>
            {/* Adicionar botão para criar nova vaga */}
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Adicionar Nova Vaga
            </Button>
        </Paper>
    );
};

export default GerenciarVagas;