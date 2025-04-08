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
import AuthService from '../../services/AuthService'; // Importe o AuthService

function PerfilResidente() {
    const { id } = useParams();
    const [residente, setResidente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResidente = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/${id}/`);
                setResidente(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar residente:', err);
                setError('Erro ao carregar perfil do residente.');
                setLoading(false);
            }
        };

        fetchResidente();
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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erro!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
                <Link to="/residentes" className="mt-4 inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </Link>
            </div>
        );
    }

    if (!residente) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Aviso!</strong>
                    <span className="block sm:inline">Residente não encontrado.</span>
                </div>
                <Link to="/residentes" className="mt-4 inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h4" className="mb-4 text-2xl font-semibold">
                Perfil do Residente
            </Typography>
            <Card className="shadow-md rounded-lg p-6">
                <CardContent>
                    <List>
                        <ListItem>
                            <ListItemText primary="ID" secondary={residente.id} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Nome" secondary={residente.nome} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Email" secondary={residente.email} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Telefone" secondary={residente.telefone} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Endereço" secondary={residente.endereco} />
                        </ListItem>
                        {/* Adicione mais informações aqui, se necessário */}
                    </List>
                    <div className="mt-6 flex justify-end">
                        <Button component={Link} to="/residentes" variant="contained" color="primary" className="mr-2">
                            Voltar
                        </Button>
                        <Button component={Link} to={`/residentes/editar/${residente.id}`} variant="contained" color="secondary">
                            Editar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default PerfilResidente;