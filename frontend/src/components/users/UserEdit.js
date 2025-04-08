import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';// Use AuthService para requisições autenticadas
import { TextField,Typography, Button, Paper, Container, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormHelperText, Checkbox, FormControlLabel } from '@mui/material';

function UserEdit() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nome: '',
        permissao: '',
        permissoesDetalhadas: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [permissoesDisponiveis, setPermissoesDisponiveis] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.authenticatedRequest('get', 'accounts', `/users/${id}/`);
                setFormData({
                    nome: response.data.profile?.nome || '',
                    permissao: response.data.profile?.permissao || '',
                    permissoesDetalhadas: response.data.profile?.permissoes_detalhadas || [],
                });
                setPermissoesDisponiveis(['gerir_utilizadores', 'gerir_candidaturas', 'gerir_residentes', 'gerir_edificios', 'visualizar_candidaturas']);
            } catch (err) {
                console.error('Erro ao buscar detalhes do utilizador:', err);
                setError('Erro ao buscar detalhes do utilizador.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissaoChange = (event) => {
        setFormData({ ...formData, permissao: event.target.value });
    };

    const handlePermissaoDetalhadaChange = (permissao) => {
        if (formData.permissoesDetalhadas.includes(permissao)) {
            setFormData({ ...formData, permissoesDetalhadas: formData.permissoesDetalhadas.filter((p) => p !== permissao) });
        } else {
            setFormData({ ...formData, permissoesDetalhadas: [...formData.permissoesDetalhadas, permissao] });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await AuthService.authenticatedRequest('put', 'accounts', `/users/${id}/`, { profile: formData });
            navigate('/users');
        } catch (err) {
            console.error('Erro ao atualizar utilizador:', err);
            setError('Erro ao atualizar utilizador.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Paper className="p-6 mt-4 text-center shadow-md rounded-lg">
                    <CircularProgress />
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Alert severity="error" className="mt-4">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper className="p-6 mt-4 shadow-md rounded-lg">
                <Typography variant="h6" gutterBottom className="font-semibold text-xl">
                    Editar Utilizador
                </Typography>
                <form onSubmit={handleUpdate}>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
                        size="small"
                    />
                    <FormControl fullWidth margin="normal" required variant="outlined" size="small">
                        <InputLabel id="permissao-label">Permissão</InputLabel>
                        <Select
                            labelId="permissao-label"
                            id="permissao"
                            name="permissao"
                            value={formData.permissao}
                            label="Permissão"
                            onChange={handlePermissaoChange}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="funcionario">Funcionário</MenuItem>
                            <MenuItem value="estudante">Estudante</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" className="mt-3 mb-1">Permissões Detalhadas:</Typography>
                    {permissoesDisponiveis.map((permissao) => (
                        <FormControlLabel
                            key={permissao}
                            control={
                                <Checkbox
                                    checked={formData.permissoesDetalhadas.includes(permissao)}
                                    onChange={() => handlePermissaoDetalhadaChange(permissao)}
                                    name={permissao}
                                />
                            }
                            label={permissao}
                        />
                    ))}
                    <FormHelperText>Selecione as permissões detalhadas para este utilizador.</FormHelperText>

                    <Button type="submit" variant="contained" color="primary" disabled={loading} className="mt-4">
                        {loading ? 'A Atualizar...' : 'Atualizar'}
                    </Button>
                    <Button component={Link} to="/users" variant="outlined" className="mt-4 ml-2">
                        Cancelar
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default UserEdit;