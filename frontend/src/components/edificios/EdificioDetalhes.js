import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import {
    Paper,
    Typography,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Button,
} from '@mui/material';

function EdificioDetalhes() {
    const { id } = useParams();
    const [edificio, setEdificio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEdificio = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/edificios/${id}/`);
                setEdificio(response.data);
            } catch (err) {
                console.error('Erro ao buscar edifício:', err);
                setError('Erro ao carregar detalhes do edifício.');
            } finally {
                setLoading(false);
            }
        };

        fetchEdificio();
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

    if (!edificio) {
        return <Alert severity="warning">Edifício não encontrado.</Alert>;
    }

    return (
        <Paper className="p-6 mt-4 shadow-md rounded-lg">
            <Typography variant="h5" gutterBottom className="font-semibold text-xl">
                Detalhes do Edifício
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="ID" secondary={edificio.id} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Nome do edifício" secondary={edificio.nome} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Número de quartos" secondary={edificio.numeroApartamentos} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Endereço" secondary={edificio.endereco} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Descrição" secondary={edificio.descricao || 'Sem descrição'} />
                </ListItem>
            </List>
            <div className="mt-4 flex gap-2">
            <Button
                component={Link}
                to="/edificios"
                variant="contained"
                color="primary"
                className="mt-4 mr-2"
            >
                Voltar
            </Button>
            <Button
                component={Link}
                to={`/edificios/editar/${edificio.id}`}
                variant="contained"
                color="secondary"
                className="mt-4"
            >
                Editar
            </Button>
            </div>
        </Paper>
    );
}

export default EdificioDetalhes;
