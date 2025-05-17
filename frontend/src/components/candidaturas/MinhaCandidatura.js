import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Paper, Typography, List, ListItem, ListItemText, Alert, CircularProgress
} from '@mui/material';
import  {AuthContext } from '../AuthContext';

const MinhaCandidatura = () => {
    const [candidatura, setCandidatura] = useState(null);
    const [erro, setErro] = useState(false);
    const [loading, setLoading] = useState(true);
    const { authToken } = useContext(AuthContext); // Acesse o token de autenticação

    useEffect(() => {
        const fetchMinhaCandidatura = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/candidaturas/minha/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Inclua o token no cabeçalho
                    },
                });
                setCandidatura(response.data);
            } catch (error) {
                console.error('Erro ao buscar minha candidatura:', error);
                setErro(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMinhaCandidatura();
    }, [authToken]); // Dependência no authToken para refetch em caso de mudança

    if (loading) {
        return <CircularProgress sx={{ mt: 2 }} />;
    }

    if (erro) {
        return <Alert severity="info" sx={{ mt: 2 }}>Nenhuma candidatura encontrada.</Alert>;
    }

    if (!candidatura) return null;

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                Minha Candidatura
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Residência" secondary={candidatura.residencia?.Nome || 'N/A'} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Status" secondary={candidatura.status || 'N/A'} />
                </ListItem>
                {['CNIouPassaporteEntregue', 'DeclaracaoMatriculaEntregue', 'DeclaracaoRendimentoEntregue',
                    'DeclaracaoSubsistenciaEntregue', 'DeclaracaoResidenciaEntregue'
                ].map(field => (
                    <ListItem key={field}>
                        <ListItemText primary={field.replace(/([A-Z])/g, ' $1')} secondary={candidatura[field] ? 'Sim' : 'Não'} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default MinhaCandidatura;