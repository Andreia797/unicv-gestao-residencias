import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService'; // Importe o AuthService

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
        let novosErros = {};
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

    const limparMensagem = () => {
        setMensagem(null);
    };

    return (
        <div className="p-4 max-w-md mx-auto mt-8">
            <Card className="shadow-md rounded-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 text-blue-600">
                        {id ? 'Editar Residente' : 'Criar Residente'}
                    </Typography>
                    <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
                    {loading ? (
                        <div className="text-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextField
                                label="Nome"
                                name="nome"
                                value={residente.nome}
                                onChange={handleChange}
                                error={!!erros.nome}
                                helperText={erros.nome}
                                fullWidth
                                className="mt-2"
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
                                className="mt-2"
                            />
                            <TextField
                                label="Telefone"
                                name="telefone"
                                value={residente.telefone}
                                onChange={handleChange}
                                error={!!erros.telefone}
                                helperText={erros.telefone}
                                fullWidth
                                className="mt-2"
                            />
                            <TextField
                                label="Endereço"
                                name="endereco"
                                value={residente.endereco}
                                onChange={handleChange}
                                error={!!erros.endereco}
                                helperText={erros.endereco}
                                fullWidth
                                className="mt-2"
                                multiline
                                rows={3}
                            />
                            <Button type="submit" variant="contained" color="primary" className="w-full">
                                {id ? 'Atualizar' : 'Criar'}
                            </Button>
                            <Button component={Link} to="/residentes" variant="outlined" className="w-full mt-2">
                                Cancelar
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default FormularioResidente;