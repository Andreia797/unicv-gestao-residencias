import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Typography, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AuthContext } from '../AuthContext';
import AuthService from '../../services/AuthService';

const EditarQuarto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);
    const [quarto, setQuarto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [numero, setNumero] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [tipo, setTipo] = useState('');
    const [edificio, setEdificio] = useState('');
    const [edificiosOptions, setEdificiosOptions] = useState([]);

    useEffect(() => {
        const fetchQuarto = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.authenticatedRequest('get', 'candidaturas', `quartos/${id}/`);
                setQuarto(response.data);
                setNumero(response.data.numero);
                setCapacidade(response.data.capacidade);
                setTipo(response.data.tipo);
                setEdificio(response.data.edificio);
            } catch (err) {
                console.error('Erro ao buscar quarto para edição:', err);
                setError('Erro ao carregar detalhes do quarto.');
            } finally {
                setLoading(false);
            }
        };

        const fetchEdificios = async () => {
            try {
                const response = await AuthService.authenticatedRequest('get', 'core', 'edificios/');
                setEdificiosOptions(response.data);
            } catch (err) {
                console.error('Erro ao buscar edifícios:', err);
                setError('Erro ao carregar lista de edifícios.');
            }
        };

        if (authToken && id) {
            fetchQuarto();
            fetchEdificios();
        } else if (authToken && !id) {
            setError('ID do quarto inválido.');
            setLoading(false);
        }
    }, [authToken, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = { numero, capacidade, tipo, edificio };
            await AuthService.editarQuarto(id, data);
            navigate('/gerenciar-vagas'); // Redirecionar após a edição
        } catch (err) {
            console.error('Erro ao editar o quarto:', err);
            setError('Erro ao salvar as alterações.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        navigate('/gerenciar-vagas');
    };

    if (loading) {
        return <CircularProgress sx={{ mt: 2 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (!quarto) {
        return <Alert severity="warning" sx={{ mt: 2 }}>Quarto não encontrado.</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Editar Quarto
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Número"
                    fullWidth
                    margin="normal"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                />
                <TextField
                    label="Capacidade"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={capacidade}
                    onChange={(e) => setCapacidade(parseInt(e.target.value))}
                    required
                    inputProps={{ min: 1 }}
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="tipo-label">Tipo</InputLabel>
                    <Select
                        labelId="tipo-label"
                        id="tipo"
                        value={tipo}
                        label="Tipo"
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <MenuItem value="individual">Individual</MenuItem>
                        <MenuItem value="duplo">Duplo</MenuItem>
                        <MenuItem value="triplo">Triplo</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="edificio-label">Edifício</InputLabel>
                    <Select
                        labelId="edificio-label"
                        id="edificio"
                        value={edificio}
                        label="Edifício"
                        onChange={(e) => setEdificio(e.target.value)}
                    >
                        {edificiosOptions.map((edificio) => (
                            <MenuItem key={edificio.id} value={edificio.id}>{edificio.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Salvar Alterações
                </Button>
                <Button onClick={handleCancelar} sx={{ mt: 2, ml: 2 }}>
                    Cancelar
                </Button>
            </form>
        </Paper>
    );
};

export default EditarQuarto;