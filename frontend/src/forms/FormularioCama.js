import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Paper,
    Container,
    Alert
} from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService';

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
                    setCama({
                        numero: camaResponse.data.numero || '',
                        quarto: camaResponse.data.quarto?.id || '',
                        status: camaResponse.data.status || '',
                    });
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
        const novosErros = {};
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

    const limparMensagem = () => setMensagem(null);

    return (
        <Container maxWidth="xl" className="py-6">
            <Paper className="p-8 shadow-md rounded-lg">
                <Typography variant="h5" className="mb-6 font-semibold text-center">
                    {id ? 'Editar Cama' : 'Criar Nova Cama'}
                </Typography>

                <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <CircularProgress />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Número da Cama"
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
                                        {quarto.numero} - {quarto.tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                            {erros.quarto && <Alert severity="error" className="mt-1">{erros.quarto}</Alert>}
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
                                <MenuItem value="Em Manutenção">Em Manutenção</MenuItem>
                            </Select>
                            {erros.status && <Alert severity="error" className="mt-1">{erros.status}</Alert>}
                        </FormControl>

                        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : (id ? 'Atualizar' : 'Criar')}
                            </Button>
                            <Button component={Link} to="/camas" variant="outlined">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}
            </Paper>
        </Container>
    );
}

export default FormularioCama;