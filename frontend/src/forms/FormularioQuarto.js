import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService'; // Importe o AuthService

function FormularioQuarto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quarto, setQuarto] = useState({
        numero: '',
        capacidade: '',
        edificio: '',
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
        let novosErros = {};
        if (!quarto.numero) novosErros.numero = 'Número é obrigatório.';
        if (!quarto.capacidade) novosErros.capacidade = 'Capacidade é obrigatória.';
        if (!quarto.edificio) novosErros.edificio = 'Edifício é obrigatório.';
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

    const limparMensagem = () => {
        setMensagem(null);
    };

    return (
        <div className="p-4 max-w-md mx-auto mt-8">
            <Card className="shadow-md rounded-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 text-blue-600">
                        {id ? 'Editar Quarto' : 'Criar Quarto'}
                    </Typography>
                    <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
                    {loading ? (
                        <div className="text-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextField
                                label="Número"
                                name="numero"
                                value={quarto.numero}
                                onChange={handleChange}
                                error={!!erros.numero}
                                helperText={erros.numero}
                                fullWidth
                                className="mt-2"
                            />
                            <TextField
                                label="Capacidade"
                                name="capacidade"
                                value={quarto.capacidade}
                                onChange={handleChange}
                                error={!!erros.capacidade}
                                helperText={erros.capacidade}
                                fullWidth
                                className="mt-2"
                            />
                            <FormControl fullWidth error={!!erros.edificio}>
                                <InputLabel id="edificio-label">Edifício</InputLabel>
                                <Select
                                    labelId="edificio-label"
                                    id="edificio"
                                    name="edificio"
                                    value={quarto.edificio}
                                    onChange={handleChange}
                                    error={!!erros.edificio}
                                    renderValue={(value) => {
                                        const selectedEdificio = edificios.find((e) => e.id === value);
                                        return selectedEdificio ? selectedEdificio.nome : '';
                                    }}
                                >
                                    {edificios.map((edificio) => (
                                        <MenuItem key={edificio.id} value={edificio.id}>
                                            {edificio.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary" className="w-full">
                                {id ? 'Atualizar' : 'Criar'}
                            </Button>
                            <Button component={Link} to="/quartos" variant="outlined" className="w-full mt-2">
                                Cancelar
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default FormularioQuarto;