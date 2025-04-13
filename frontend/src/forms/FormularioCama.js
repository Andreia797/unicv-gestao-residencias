import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Paper, Container } from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService'; // Importe o AuthService

function FormularioCama() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cama, setCama] = useState({
        numero: '',
        quarto: '',
        status: '',
    });
    const [quartos, setQuartos] = useState([]);
    const [erros, setErros] = useState({});
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const quartosResponse = await AuthService.authenticatedRequest('get', 'relatorios', '/quartos/');
                setQuartos(quartosResponse.data);
                if (id) {
                    const camaResponse = await AuthService.authenticatedRequest('get', 'relatorios', `/camas/${id}/`);
                    setCama(camaResponse.data);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setMensagem('Erro ao buscar dados.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setCama({ ...cama, [e.target.name]: e.target.value });
    };

    const validarFormulario = () => {
        let novosErros = {};
        if (!cama.numero) novosErros.numero = 'Número é obrigatório.';
        if (!cama.quarto) novosErros.quarto = 'Quarto é obrigatório.';
        if (!cama.status) novosErros.status = 'Status é obrigatório.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            if (id) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/camas/${id}/`, cama);
                setMensagem('Cama atualizada com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', 'relatorios', '/camas/', cama);
                setMensagem('Cama criada com sucesso.');
            }
            setTipoMensagem('success');
            navigate('/camas');
        } catch (error) {
            console.error('Erro ao salvar cama:', error);
            setMensagem('Erro ao salvar cama.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    return (
        <Container maxWidth="sm">
            <Paper className="p-4 mt-4">
                <Typography variant="h5" className="mb-4 text-center">
                    {id ? 'Editar Cama' : 'Criar Cama'}
                </Typography>
                <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
                {loading ? (
                    <div className="mt-4 text-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <TextField
                            label="Número"
                            name="numero"
                            value={cama.numero}
                            onChange={handleChange}
                            error={!!erros.numero}
                            helperText={erros.numero}
                            fullWidth
                        />
                        <FormControl fullWidth error={!!erros.quarto}>
                            <InputLabel id="quarto-label">Quarto</InputLabel>
                            <Select
                                labelId="quarto-label"
                                id="quarto"
                                name="quarto"
                                value={cama.quarto}
                                onChange={handleChange}
                                label="Quarto"
                            >
                                {quartos.map((quarto) => (
                                    <MenuItem key={quarto.id} value={quarto.id}>
                                        {quarto.numero}
                                    </MenuItem>
                                ))}
                            </Select>
                            {erros.quarto && <Alert severity="error">{erros.quarto}</Alert>}
                        </FormControl>
                        <FormControl fullWidth error={!!erros.status}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status"
                                name="status"
                                value={cama.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                <MenuItem value="Disponível">Disponível</MenuItem>
                                <MenuItem value="Ocupado">Ocupado</MenuItem>
                                <MenuItem value="Em Manutenção">Manutencao</MenuItem>
                            </Select>
                            {erros.status && <Alert severity="error">{erros.status}</Alert>}
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" className="w-full">
                            {id ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button component={Link} to="/camas" variant="outlined" className="w-full mt-2">
                            Cancelar
                        </Button>
                    </form>
                )}
            </Paper>
        </Container>
    );
}

export default FormularioCama;