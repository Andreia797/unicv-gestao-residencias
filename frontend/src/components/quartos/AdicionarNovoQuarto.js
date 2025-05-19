import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AuthContext } from '../AuthContext';
import AuthService from '../../services/AuthService';

const AdicionarNovoQuarto = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);
    const [numero, setNumero] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [tipo, setTipo] = useState('');
    const [edificio, setEdificio] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [edificiosOptions, setEdificiosOptions] = useState([]);

    useEffect(() => {
        const fetchEdificios = async () => {
            try {
                const response = await AuthService.authenticatedRequest('get', 'core', 'edificios/');
                setEdificiosOptions(response.data);
            } catch (err) {
                console.error('Erro ao buscar edifícios:', err);
                setError('Erro ao carregar lista de edifícios.');
            }
        };

        if (authToken) {
            fetchEdificios();
        }
    }, [authToken]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = { numero, capacidade, tipo, edificio };
            await AuthService.authenticatedRequest('post', 'candidaturas', 'quartos/', data);
            navigate('/gerirvagas'); // Redirecionar após adicionar
        } catch (err) {
            console.error('Erro ao adicionar novo quarto:', err);
            setError('Erro ao adicionar o quarto.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        navigate('/gerirvagas');
    };

    if (loading) {
        return <CircularProgress sx={{ mt: 2 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Adicionar Novo Quarto
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
                    Adicionar Quarto
                </Button>
                <Button onClick={handleCancelar} sx={{ mt: 2, ml: 2 }}>
                    Cancelar
                </Button>
            </form>
        </Paper>
    );
};

export default AdicionarNovoQuarto;