import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import AuthService from '../../services/AuthService'; 

function QuartoDetalhes() {
    const { id } = useParams();
    const [quarto, setQuarto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuarto = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/quartos/${id}/`);
                setQuarto(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar quarto:', err);
                setError('Erro ao carregar detalhes do quarto.');
                setLoading(false);
            }
        };

        fetchQuarto();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Typography color="error">{error}</Typography>
                <Link to="/quartos" className="mt-4 inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </Link>
            </div>
        );
    }

    if (!quarto) {
        return (
            <div className="container mx-auto p-4">
                <Typography>Quarto não encontrado.</Typography>
                <Link to="/quartos" className="mt-4 inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h4" className="mb-4 text-2xl font-semibold">
                Detalhes do Quarto
            </Typography>
            <Card className="shadow-md rounded-lg p-6">
                <CardContent>
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
                            <ListItemText primary="Edifício" secondary={`${quarto.edificio?.nome} (ID: ${quarto.edificio?.id})`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Capacidade" secondary={quarto.capacidade} />
                        </ListItem>
                    </List>
                    <div className="mt-6">
                        <Button component={Link} to="/quartos" variant="contained" color="primary" className="mr-2">
                            Voltar
                        </Button>
                        <Button component={Link} to={`/quartos/editar/${quarto.id}`} variant="contained" color="secondary">
                            Editar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default QuartoDetalhes;