import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    IconButton,
    Tooltip,
    TablePagination,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';

function GerirUtilizadores() {
    const [utilizadores, setUtilizadores] = useState([]);
    const [editUtilizadorId, setEditUtilizadorId] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        permissao: '',
        permissoesDetalhadas: [],
    });
    const [permissoesDisponiveis, setPermissoesDisponiveis] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchUtilizadores();
        setPermissoesDisponiveis(['gerir_utilizadores', 'gerir_candidaturas', 'gerir_residentes', 'gerir_edificios', 'visualizar_candidaturas']);
    }, []);

    const fetchUtilizadores = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'accounts', '/users/');
            setUtilizadores(response.data.map(user => ({
                ...user,
                username: user.nome_utilizador || '', // Use nome_utilizador
                name: user.nome || '',             // Use nome
                permissao: user.nome_permissao || '', // Use nome_permissao
                // Você precisará buscar as permissoesDetalhadas separadamente se elas não vierem aqui
                permissoesDetalhadas: user.permissoes_detalhadas || [], // Assumindo que vem na resposta
            })));
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
            setMensagem('Erro ao buscar utilizadores.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (utilizador) => {
        setEditUtilizadorId(utilizador.id);
        setFormData({
            username: utilizador.nome_utilizador, // Use nome_utilizador
            name: utilizador.nome,             // Use nome
            permissao: utilizador.nome_permissao, // Use nome_permissao
            permissoesDetalhadas: utilizador.permissoesDetalhadas || [],
        });
    };

    const handleUpdate = async () => {
        try {
            await AuthService.authenticatedRequest('put', 'accounts', `/users/${editUtilizadorId}/`, {
                profile: {
                    name: formData.name,
                    permissao: formData.permissao,
                    permissoes_detalhadas: formData.permissoesDetalhadas,
                }
            });
            setEditUtilizadorId(null);
            fetchUtilizadores();
            setMensagem('Utilizador atualizado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao atualizar utilizador:', error);
            setMensagem('Erro ao atualizar utilizador.');
            setTipoMensagem('error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'accounts', `/users/${id}/`);
            fetchUtilizadores();
            setMensagem('Utilizador excluído com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir utilizador:', error);
            setMensagem('Erro ao excluir utilizador.');
            setTipoMensagem('error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCriarUtilizador = async () => {
        try {
            await AuthService.authenticatedRequest('post', 'accounts', '/users/create/', {
                username: formData.username,
                name: formData.name,
                email: '', // You might want to add an email field in the form
                password: 'passwordpadrao', // Consider generating a random password or requiring the user to set it
                profile: {
                    name: formData.name,
                    permissao: formData.permissao,
                    permissoes_detalhadas: formData.permissoesDetalhadas,
                },
            });
            setFormData({ username: '', name: '', permissao: '', permissoesDetalhadas: [] });
            fetchUtilizadores();
            setMensagem('Utilizador criado com sucesso.');
            setTipoMensagem('success');
            setEditUtilizadorId(null);
        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            setMensagem('Erro ao criar utilizador.');
            setTipoMensagem('error');
        }
    };

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const handleChangeRowsPerPage = (event) => {
        setResultadosPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    const podeEditarExcluir = user?.groups?.includes("administrador");
    const podeAdicionar = user?.groups?.includes("administrador");
    const podeVerDetalhes = user?.groups?.includes("administrador") || user?.groups?.includes("funcionario");

    return (
        <div className="p-4">
            {mensagem && <Alert severity={tipoMensagem}>{mensagem}</Alert>}
            <h2 className="text-2xl font-semibold mb-4">Gestão de Utilizadores</h2>
            {podeAdicionar && (
                <div className="flex justify-end mb-4">
                    <Button component={Link} to="/users/criar" variant="contained" color="primary" className="mb-4">
                        Adicionar Utilizador
                    </Button>
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <Paper className="shadow-md rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissão</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {utilizadores
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((utilizador) => (
                                        <tr key={utilizador.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{utilizador.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{utilizador.nome_utilizador}</td> {/* Use nome_utilizador */}         {/* Use nome */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{utilizador.nome_permissao}</td> {/* Use nome_permissao */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {podeVerDetalhes && (
                                                    <Tooltip title="Detalhes">
                                                        <IconButton component={Link} to={`/users/${utilizador.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                            <Visibility className="text-blue-500" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {podeEditarExcluir && (
                                                    <>
                                                        <Tooltip title="Editar">
                                                            <IconButton component={Link} to={`/users/edit/${utilizador.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                                <Edit className="text-yellow-500" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Excluir">
                                                            <IconButton onClick={() => handleDelete(utilizador.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
                                                                <Delete className="text-red-500" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={utilizadores.length}
                                    rowsPerPage={resultadosPorPagina}
                                    page={pagina}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Utilizadores por página:"
                                    className="text-sm text-gray-700"
                                />
                            </div>
                        </Paper>
                    </div>
                )}

            </div>
    );
}

export default GerirUtilizadores;