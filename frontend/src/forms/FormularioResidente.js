import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService';

function FormularioResidente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [residente, setResidente] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
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
                    const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/${id}/`);
                    setResidente(response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar residente:', error);
                setMensagem('Erro ao buscar residente.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setResidente({ ...residente, [e.target.name]: e.target.value });
    };

    const validarFormulario = () => {
        const novosErros = {};
        if (!residente.nome) novosErros.nome = 'Nome é obrigatório.';
        if (!residente.email) novosErros.email = 'Email é obrigatório.';
        if (!residente.telefone) novosErros.telefone = 'Telefone é obrigatório.';
        if (!residente.endereco) novosErros.endereco = 'Endereço é obrigatório.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            if (id) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/residentes/${id}/`, residente);
                setMensagem('Residente atualizado com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', 'relatorios', '/residentes/', residente);
                setMensagem('Residente criado com sucesso.');
            }
            setTipoMensagem('success');
            navigate('/residentes');
        } catch (error) {
            console.error('Erro ao salvar residente:', error);
            setMensagem('Erro ao salvar residente.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const limparMensagem = () => setMensagem(null);

    return (
        <Container maxWidth="xl" className="py-6">
            <Paper className="p-8 shadow-md rounded-lg">
                <Typography variant="h5" gutterBottom>
                    {id ? 'Editar Residente' : 'Criar Novo Residente'}
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
                            value={residente.nome}
                            onChange={handleChange}
                            error={!!erros.nome}
                            helperText={erros.nome}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={residente.email}
                            onChange={handleChange}
                            error={!!erros.email}
                            helperText={erros.email}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Telefone"
                            name="telefone"
                            value={residente.telefone}
                            onChange={handleChange}
                            error={!!erros.telefone}
                            helperText={erros.telefone}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Endereço"
                            name="endereco"
                            value={residente.endereco}
                            onChange={handleChange}
                            error={!!erros.endereco}
                            helperText={erros.endereco}
                            fullWidth
                            required
                        />
                        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : (id ? 'Atualizar' : 'Criar')}
                            </Button>
                            <Button component={Link} to="/residentes" variant="outlined">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}
            </Paper>
        </Container>
    );
}

export default FormularioResidente;