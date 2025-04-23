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
                        <strong>Número da Cama:</strong> {cama.numero}
                    </Typography>
                    {cama.quarto && (
                        <>
                            <Typography variant="body1" className="mb-2">
                                <strong>Número do Quarto:</strong> {cama.quarto.numero}
                            </Typography>
                            {cama.quarto.edificio && (
                                <Typography variant="body1" className="mb-2">
                                    <strong>Edifício:</strong> {cama.quarto.edificio.nome}
                                </Typography>
                            )}
                            <Typography variant="body1" className="mb-2">
                                <strong>Capacidade do Quarto:</strong> {cama.quarto.capacidade}
                            </Typography>
                        </>
                    )}
                    <Typography variant="body1" className="mb-4">
                        <strong>Estado:</strong> {cama.status}
                    </Typography>
                    {cama.residente && (
                        <>
                            <Typography variant="h6" className="mt-4 mb-2 font-semibold">
                                Residente
                            </Typography>
                            <Typography variant="body1" className="mb-1">
                                <strong>Nome:</strong> {cama.residente.nome}
                            </Typography>
                            <Typography variant="body1" className="mb-1">
                                <strong>Email:</strong> {cama.residente.email}
                            </Typography>
                            <Typography variant="body1" className="mb-1">
                                <strong>Telefone:</strong> {cama.residente.telefone}
                            </Typography>
                            <Typography variant="body1" className="mb-1">
                                <strong>Endereço:</strong> {cama.residente.endereco}
                            </Typography>
                        </>
                    )}
                    <div className="mt-4">
                        <Typography variant="h6" className="mb-2 font-semibold">
                            Associar Residente
                        </Typography>
                    </div>
                    <div className="flex space-x-2 mt-4">
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