import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthService from '../../services/AuthService'; // Importe o AuthService
import Notificacoes from '../Notificacoes'; // Importe o componente de Notificações

function CandidaturaDetalhes() {
    const { id } = useParams();
    const [candidatura, setCandidatura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', `/candidaturas/${id}/`);
                setCandidatura(response.data);
            } catch (error) {
                console.error('Erro ao buscar candidatura:', error);
                setMensagem('Erro ao buscar detalhes da candidatura.');
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

    if (!candidatura) {
        return (
            <div className="p-4">
                <Typography variant="body1">Candidatura não encontrada.</Typography>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <Card className="shadow-md rounded-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 font-semibold">
                        Detalhes da Candidatura
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Nome:</strong> {candidatura.nome}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Descrição:</strong> {candidatura.descricao}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Data de Criação:</strong> {format(new Date(candidatura.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        <strong>Estado:</strong> {candidatura.status}
                    </Typography>
                    <div className="flex space-x-2">
                        <Button component={Link} to="/candidaturas" variant="contained" color="primary">
                            Voltar
                        </Button>
                        <Button component={Link} to={`/candidaturas/editar/${candidatura.id}`} variant="contained" color="secondary">
                            Editar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CandidaturaDetalhes;