import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Paper, Typography, List, ListItem, ListItemText, CircularProgress, Alert
} from '@mui/material';
import  {AuthContext} from '../AuthContext';


const Vagas = () => {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useContext(AuthContext); // Acesse o token de autenticação

    useEffect(() => {
        const fetchVagas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/candidaturas/vagas/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Inclua o token no cabeçalho
                    },
                });
                setVagas(response.data);
            } catch (error) {
                console.error('Erro ao buscar vagas:', error);
                setError('Erro ao carregar as vagas disponíveis.');
            } finally {
                setLoading(false);
            }
        };

        fetchVagas();
    }, [authToken]); // Dependência no authToken para refetch em caso de mudança

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
                {vagas.map((vaga) => (
                    <ListItem key={vaga.id} divider>
                        <ListItemText
                            primary={vaga.Nome}
                            secondary={`Localização: ${vaga.Localizacao || 'N/A'} | Capacidade: ${vaga.Capacidade || 'N/A'}`}
                        />
                    </ListItem>
                ))}
                {vagas.length === 0 && !loading && !error && (
                    <Typography variant="body1" color="textSecondary">
                        Não há vagas disponíveis no momento.
                    </Typography>
                )}
            </List>
        </Paper>
    );
};

export default Vagas;