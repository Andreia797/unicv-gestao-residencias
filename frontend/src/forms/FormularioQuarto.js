import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    CircularProgress,
    Container,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService';

function FormularioQuarto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quarto, setQuarto] = useState({
        numero: '',
        capacidade: '',
        edificio: '',
        tipo: '', // Adicionado o campo tipo
    });
    const [edificios, setEdificios] = useState([]);
    const [erros, setErros] = useState({});
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const edificiosResponse = await AuthService.authenticatedRequest('get', 'relatorios', '/edificios/');
                setEdificios(edificiosResponse.data);
                if (id) {
                    const quartoResponse = await AuthService.authenticatedRequest('get', 'relatorios', `/quartos/${id}/`);
                    setQuarto(quartoResponse.data);
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
        setQuarto({ ...quarto, [e.target.name]: e.target.value });
    };

    const validarFormulario = () => {
        const novosErros = {};
        if (!quarto.numero) novosErros.numero = 'Número é obrigatório.';
        if (!quarto.capacidade) novosErros.capacidade = 'Capacidade é obrigatória.';
        if (!quarto.edificio) novosErros.edificio = 'Edifício é obrigatório.';
        if (!quarto.tipo) novosErros.tipo = 'Tipo de Quarto é obrigatório.'; // Validação para o novo campo
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            if (id) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/quartos/${id}/`, quarto);
                setMensagem('Quarto atualizado com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', 'relatorios', '/quartos/', quarto);
                setMensagem('Quarto criado com sucesso.');
            }
            setTipoMensagem('success');
            navigate('/quartos');
        } catch (error) {
            console.error('Erro ao salvar quarto:', error);
            setMensagem('Erro ao salvar quarto.');
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
                    {id ? 'Editar Quarto' : 'Criar Novo Quarto'}
                </Typography>

                <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <CircularProgress />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Número do Quarto"
                            name="numero"
                            value={quarto.numero}
                            onChange={handleChange}
                            error={!!erros.numero}
                            helperText={erros.numero}
                            fullWidth
                        />
                        <TextField
                            label="Capacidade"
                            name="capacidade"
                            type="number"
                            value={quarto.capacidade}
                            onChange={handleChange}
                            error={!!erros.capacidade}
                            helperText={erros.capacidade}
                            fullWidth
                        />
                        <FormControl fullWidth error={!!erros.edificio}>
                            <InputLabel id="edificio-label">Edifício</InputLabel>
                            <Select
                                labelId="edificio-label"
                                id="edificio"
                                name="edificio"
                                value={quarto.edificio}
                                onChange={handleChange}
                                label="Edifício"
                            >
                                {edificios.map((edificio) => (
                                    <MenuItem key={edificio.id} value={edificio.id}>
                                        {edificio.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                            {erros.edificio && <Alert severity="error" className="mt-1">{erros.edificio}</Alert>}
                        </FormControl>

                        {/* Novo campo para o tipo de quarto */}
                        <TextField
                            label="Tipo de Quarto"
                            name="tipo"
                            value={quarto.tipo}
                            onChange={handleChange}
                            error={!!erros.tipo}
                            helperText={erros.tipo}
                            fullWidth
                        />

                        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                            <Button type="submit" variant="contained" color="primary">
                                {id ? 'Atualizar' : 'Criar'}
                            </Button>
                            <Button component={Link} to="/quartos" variant="outlined">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}
            </Paper>
        </Container>
    );
}

export default FormularioQuarto;