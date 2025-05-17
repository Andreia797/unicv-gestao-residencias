import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';
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

function PerfilResidente() {
    const { id } = useParams();
    const [residente, setResidente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchResidente = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/${id}/`);
                setResidente(response.data);
            } catch (err) {
                console.error('Erro ao buscar residente:', err);
                setError('Erro ao carregar perfil do residente.');
            } finally {
                setLoading(false);
            }
        };

        fetchResidente();
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

    if (!residente) {
        return <Typography>Residente não encontrado.</Typography>;
    }

    const podeEditar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeVerPerfil = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");

    if (!podeVerPerfil) {
        return <Alert severity="warning">Você não tem permissão para ver o perfil deste residente.</Alert>;
    }

    return (
        <Paper className="p-6 mt-4 shadow-md rounded-lg">
            <Typography variant="h5" gutterBottom className="font-semibold text-xl">
                Perfil do Residente
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="ID" secondary={residente.id} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Nome do Residente" secondary={residente.nome} />
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
            </List>
            <div className="mt-4 flex gap-2">
                <Button
                    component={Link}
                    to="/residentes"
                    variant="contained"
                    color="primary"
                >
                    Voltar
                </Button>
                {podeEditar && (
                    <Button
                        component={Link}
                        to={`/residentes/editar/${residente.id}`}
                        variant="contained"
                        color="secondary"
                    >
                        Editar
                    </Button>
                )}
            </div>
        </Paper>
    );
}

export default PerfilResidente;