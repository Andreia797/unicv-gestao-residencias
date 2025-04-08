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

function CamaDetalhes() {
    const { id } = useParams();
    const [cama, setCama] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/camas/${id}/`);
                setCama(response.data);
            } catch (error) {
                console.error('Erro ao buscar cama:', error);
                setMensagem('Erro ao buscar detalhes da cama.');
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

    if (!cama) {
        return (
            <div className="p-4">
                <Typography variant="body1">Cama não encontrada.</Typography>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <Card className="shadow-md rounded-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 font-semibold">
                        Detalhes da Cama
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>ID:</strong> {cama.id}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Número:</strong> {cama.numero}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Quarto:</strong> {cama.quarto}
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        <strong>Estado:</strong> {cama.status}
                    </Typography>
                    <div className="flex space-x-2">
                        <Button component={Link} to="/camas" variant="contained" color="primary">
                            Voltar
                        </Button>
                        <Button component={Link} to={`/camas/editar/${cama.id}`} variant="contained" color="secondary">
                            Editar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CamaDetalhes;