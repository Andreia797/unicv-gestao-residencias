import React, { useEffect, useState, useContext } from 'react';
import AuthService from '../../services/AuthService';
import {
    Paper, Typography, List, ListItem, ListItemText, CircularProgress, Alert
} from '@mui/material';
import { AuthContext } from '../AuthContext';

const Vagas = () => {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useContext(AuthContext); // token JWT

    useEffect(() => {
        const fetchVagas = async () => {
            setLoading(true);
            setError(null);
            try {
                // Corrigido para usar AuthService e a rota específica para listar vagas
                const response = await AuthService.authenticatedRequest('get', 'vagas', '/');
                setVagas(response.data);
            } catch (err) {
                console.error('Erro ao buscar vagas:', err);
                setError('Erro ao carregar as vagas disponíveis.');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchVagas();
        }
    }, [authToken]);

    if (loading) {
        return <CircularProgress sx={{ mt: 2 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                Vagas Disponíveis
            </Typography>
            <List>
                {vagas.length === 0 && (
                    <Typography variant="body1" color="textSecondary">
                        Não há vagas disponíveis no momento.
                    </Typography>
                )}
                {vagas.map((vaga) => (
                    <ListItem key={vaga.id} divider>
                        <ListItemText
                            primary={vaga.nome}
                            secondary={`Localização: ${vaga.localizacao || 'N/A'} | Capacidade: ${vaga.capacidade || 'N/A'}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default Vagas;