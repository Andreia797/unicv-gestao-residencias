import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';// Use AuthService para requisições autenticadas
import { Paper, Typography, Alert, CircularProgress, List, ListItem, ListItemText, Button } from '@mui/material';

function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.authenticatedRequest('get', 'accounts', `/users/${id}/`);
                setUser(response.data);
            } catch (err) {
                console.error('Erro ao buscar detalhes do utilizador:', err);
                setError('Erro ao buscar detalhes do utilizador.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!user) {
        return <Typography>Utilizador não encontrado.</Typography>;
    }

    return (
        <Paper className="p-6 mt-4 shadow-md rounded-lg">
            <Typography variant="h5" gutterBottom className="font-semibold text-xl">
                Detalhes do Utilizador
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="ID" secondary={user.id} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Nome de Utilizador" secondary={user.username} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Nome" secondary={user.profile?.name} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Permissão" secondary={user.profile?.permissao} />
                </ListItem>
                {user.profile?.permissoes_detalhadas && user.profile.permissoes_detalhadas.length > 0 && (
                    <ListItem>
                        <ListItemText
                            primary="Permissões Detalhadas"
                            secondary={user.profile.permissoes_detalhadas.join(', ')}
                        />
                    </ListItem>
                )}
            </List>
            <Button component={Link} to="/gerirutilizadores" variant="contained" color="primary" className="mt-4">
                Voltar para Gerir Utilizadores
            </Button>
        </Paper>
    );
}

export default UserDetails;