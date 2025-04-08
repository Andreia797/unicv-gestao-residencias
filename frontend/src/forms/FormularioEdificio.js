import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService'; // Importe o AuthService

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
                    const response = await AuthService.authenticatedRequest('get', 'core', `/edificios/${id}/`);
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
        let novosErros = {};
        if (!edificio.nome) novosErros.nome = 'Nome é obrigatório.';
        if (!edificio.endereco) novosErros.endereco = 'Endereço é obrigatório.';
        if (!edificio.numeroApartamentos) novosErros.numeroApartamentos = 'Número de apartamentos é obrigatório.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            if (id) {
                await AuthService.authenticatedRequest('put', 'core', `/edificios/${id}/`, edificio);
                setMensagem('Edifício atualizado com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', 'core', '/edificios/', edificio);
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
        <div className="p-4 max-w-md mx-auto mt-8">
            <Card className="shadow-md rounded-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 text-blue-600">
                        {id ? 'Editar Edifício' : 'Criar Edifício'}
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
                                value={edificio.nome}
                                onChange={handleChange}
                                error={!!erros.nome}
                                helperText={erros.nome}
                                fullWidth
                                className="mt-2"
                            />
                            <TextField
                                label="Endereço"
                                name="endereco"
                                value={edificio.endereco}
                                onChange={handleChange}
                                error={!!erros.endereco}
                                helperText={erros.endereco}
                                fullWidth
                                className="mt-2"
                            />
                            <TextField
                                label="Número de Apartamentos"
                                name="numeroApartamentos"
                                type="number"
                                value={edificio.numeroApartamentos}
                                onChange={handleChange}
                                error={!!erros.numeroApartamentos}
                                helperText={erros.numeroApartamentos}
                                fullWidth
                                className="mt-2"
                            />
                            <Button type="submit" variant="contained" color="primary" className="w-full">
                                {id ? 'Atualizar' : 'Criar'}
                            </Button>
                            <Button component={Link} to="/edificios" variant="outlined" className="w-full mt-2">
                                Cancelar
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default FormularioEdificio;