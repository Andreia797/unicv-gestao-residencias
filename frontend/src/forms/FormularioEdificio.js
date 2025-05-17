import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    CircularProgress,
    Container,
    Paper,
} from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService';

function FormularioEdificio() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [edificio, setEdificio] = useState({
        nome: '',
        endereco: '',
        numeroApartamentos: 0,
    });
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const response = await AuthService.authenticatedRequest('get', 'relatorios', `/edificios/${id}/`);
                    setEdificio(response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar edifício:', error);
                setMensagem('Erro ao buscar edifício.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setEdificio({ ...edificio, [e.target.name]: e.target.value });
    };

    const validarFormulario = () => {
        const novosErros = {};
        if (!edificio.nome) novosErros.nome = 'Nome é obrigatório.';
        if (!edificio.endereco) novosErros.endereco = 'Endereço é obrigatório.';
        if (!edificio.numeroApartamentos || edificio.numeroApartamentos <= 0)
            novosErros.numeroApartamentos = 'Informe um número válido.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            if (id) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/edificios/${id}/`, edificio);
                setMensagem('Edifício atualizado com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', 'relatorios', '/edificios/', edificio);
                setMensagem('Edifício criado com sucesso.');
            }
            setTipoMensagem('success');
            navigate('/edificios');
        } catch (error) {
            console.error('Erro ao salvar edifício:', error);
            setMensagem('Erro ao salvar edifício.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    return (
        <Container maxWidth="xl" className="py-6">
            <Paper className="p-8 shadow-md rounded-lg">
                <Typography variant="h5" className="mb-6 font-semibold text-center">
                    {id ? 'Editar Edifício' : 'Criar Novo Edifício'}
                </Typography>

                <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <CircularProgress />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Nome"
                            name="nome"
                            value={edificio.nome}
                            onChange={handleChange}
                            error={!!erros.nome}
                            helperText={erros.nome}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Endereço"
                            name="endereco"
                            value={edificio.endereco}
                            onChange={handleChange}
                            error={!!erros.endereco}
                            helperText={erros.endereco}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Número de Quartos"
                            name="numeroApartamentos"
                            type="number"
                            value={edificio.numeroApartamentos}
                            onChange={handleChange}
                            error={!!erros.numeroApartamentos}
                            helperText={erros.numeroApartamentos}
                            fullWidth
                            required
                        />

                        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : (id ? 'Atualizar' : 'Criar')}
                            </Button>
                            <Button component={Link} to="/edificios" variant="outlined">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}
            </Paper>
        </Container>
    );
}

export default FormularioEdificio;