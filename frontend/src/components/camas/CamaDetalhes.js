import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, CircularProgress, Button } from '@mui/material';
import AuthService from '../../services/AuthService';
import Notificacoes from '../Notificacoes';

function CamaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cama, setCama] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');

    const fetchCama = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/camas/${id}/`);
            setCama(response.data);
        } catch (error) {
            console.error('Erro ao buscar cama:', error);
            setMensagem('Erro ao carregar detalhes da cama.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCama();
    }, [id]);

    const limparMensagem = () => setMensagem(null);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <CircularProgress />
            </div>
        );
    }

    if (!cama) {
        return null;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <Paper className="p-6 shadow-md">
                <Typography variant="h5" className="mb-4">Detalhes da Cama</Typography>
                <div className="space-y-2">
                    <Typography><strong>Número:</strong> {cama.numero}</Typography>
                    <Typography><strong>Tipo de Quarto:</strong> {cama.quarto?.tipo}</Typography>
                    <Typography><strong>Quarto ID:</strong> {cama.quarto?.id}</Typography>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="contained" onClick={() => navigate('/camas')}>Voltar</Button>
                </div>
            </Paper>
        </div>
    );
}

export default CamaDetalhes;
