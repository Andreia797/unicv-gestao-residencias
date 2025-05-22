import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { TextField, Typography, Button, Paper, Container, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormHelperText, Checkbox, FormControlLabel } from '@mui/material';
import { AuthContext } from '../AuthContext';

function UserEdit() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        permissao: '',
        permissoesDetalhadas: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [permissoesDisponiveis, setPermissoesDisponiveis] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AuthService.authenticatedRequest('get', 'accounts', `/users/${id}/`);
                setFormData({
                    name: response.data.profile?.name || '',
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
        if (id) { 
            await AuthService.authenticatedRequest('put', 'accounts', `/users/${id}/`, { profile: formData });
        } else { 
            await AuthService.authenticatedRequest('post', 'accounts', '/users/create/', { profile: formData }); 
        }
        navigate('/gerirutilizadores'); 
    } catch (err) {
        console.error('Erro ao salvar utilizador:', err);
        setError('Erro ao salvar utilizador.'); 
    } finally {
        setLoading(false);
    }
    };

    const podeEditar = user?.groups?.includes("administrador");

    if (!podeEditar) {
        return (
            <Container maxWidth="sm">
                <Alert severity="warning" className="mt-4">Você não tem permissão para editar este utilizador.</Alert>
                <Button component={Link} to="/gerirutilizadores" variant="outlined" className="mt-2">
                    Voltar para Gerir Utilizadores
                </Button>
            </Container>
        );
    }

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
        <Container maxWidth="xl" className="py-6">
            <Paper className="p-8 shadow-md rounded-lg">
                <Typography variant="h5" gutterBottom>
                    Criar Novo Utilizador
                </Typography>
                <form onSubmit={handleUpdate}>
                    <TextField
                        label="Nome"
                        name="name"
                        value={formData.name}
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
                            <MenuItem value="administrador">Administrador</MenuItem>
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
                     <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                    <Button type="submit" variant="contained" color="primary" disabled={loading} className="mt-4">
                        {loading ? 'A Atualizar...' : 'Criar'}
                    </Button>
                    <Button component={Link} to="/gerirutilizadores" variant="outlined" className="mt-4 ml-2">
                        Cancelar
                    </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
}

export default UserEdit;