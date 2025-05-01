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
    Button
} from '@mui/material';

function QuartoDetalhes() {
    const { id } = useParams();
    const [quarto, setQuarto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuarto = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/quartos/${id}/`);
                setQuarto(response.data);
            } catch (err) {
                console.error('Erro ao buscar quarto:', err);
                setError('Erro ao carregar detalhes do quarto.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuarto();
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

    if (!quarto) {
        return <Typography>Quarto não encontrado.</Typography>;
    }

    return (
        <Paper className="p-6 mt-4 shadow-md rounded-lg">
            <Typography variant="h5" gutterBottom className="font-semibold text-xl">
                Detalhes do Quarto
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="ID" secondary={quarto.id} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Número" secondary={quarto.numero} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Tipo" secondary={quarto.tipo} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Capacidade" secondary={quarto.capacidade} />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Edifício"
                        secondary={`${quarto.edificio?.nome} (ID: ${quarto.edificio?.id})`}
                    />
                </ListItem>
            </List>
            <div className="mt-4 flex gap-2">
                <Button component={Link} to="/quartos" variant="contained" color="primary">
                    Voltar
                </Button>
                <Button component={Link} to={`/quartos/editar/${quarto.id}`} variant="contained" color="secondary">
                    Editar
                </Button>
            </div>
        </Paper>
    );
}

export default QuartoDetalhes;
