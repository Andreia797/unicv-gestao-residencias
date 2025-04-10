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
import AuthService from '../../services/AuthService'; 
import Notificacoes from '../Notificacoes';

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

    const formatarData = (dataISO) => {
        try {
            return format(new Date(dataISO), 'dd/MM/yyyy HH:mm', { locale: ptBR });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
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
                        <strong>Nome do Estudante:</strong> {candidatura.estudante?.Nome}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Residência:</strong> {candidatura.residencia?.Nome}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Edifício:</strong> {candidatura.residencia?.edificio}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                        <strong>Data de Submissão:</strong> {formatarData(candidatura.DataSubmissao)}
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        <strong>Estado:</strong> {candidatura.status}
                    </Typography>
                    <div className="flex space-x-2">
                        <Button component={Link} to="/candidaturas" variant="contained" color="primary">
                            Voltar
                        </Button>
                        <Button component={Link} to={`/candidaturas/editar/${id}`} variant="contained" color="secondary">
                            Editar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CandidaturaDetalhes;