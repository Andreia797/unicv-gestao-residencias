import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import AuthService from '../../services/AuthService'; // Importe o AuthService
import Notificacoes from '../Notificacoes'; // Importe o componente de Notificações

function EdificioDetalhes() {
    const { id } = useParams();
    const [edificio, setEdificio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/edificios/${id}/`);
                setEdificio(response.data);
            } catch (error) {
                console.error('Erro ao buscar edifício:', error);
                setMensagem('Erro ao buscar detalhes do edifício.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const limparMensagem = () => {
        setMensagem(null);
    };

    if (loading) {
        return (
            <div className="p-4 flex justify-center items-center h-32">
                <CircularProgress />
            </div>
        );
    }

    if (!edificio) {
        return (
            <div className="p-4">
                <Typography variant="body1">Edifício não encontrado.</Typography>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <Card className="shadow-md rounded-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 font-semibold">
                        Detalhes do Edifício
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>ID:</strong> {edificio.id}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Nome:</strong> {edificio.nome}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Endereço:</strong> {edificio.endereco}
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        <strong>Número de Apartamentos:</strong> {edificio.numeroApartamentos}
                    </Typography>
                    <div className="flex space-x-2">
                        <Button component={Link} to="/edificios" variant="contained" color="primary">
                            Voltar
                        </Button>
                        <Button component={Link} to={`/edificios/editar/${edificio.id}`} variant="contained" color="secondary">
                            Editar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default EdificioDetalhes;