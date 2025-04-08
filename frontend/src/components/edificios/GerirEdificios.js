import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    IconButton,
    Tooltip,
    TablePagination,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import Notificacoes from '../Notificacoes';
import AuthService from '../../services/AuthService'; // Importe o AuthService

function GerirEdificios() {
    const [edificios, setEdificios] = useState([]);
    const [novoEdificio, setNovoEdificio] = useState({
        nome: '',
        endereco: '',
        numeroApartamentos: 0,
    });
    const [editEdificioId, setEditEdificioId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nome: '',
        endereco: '',
        numeroApartamentos: 0,
    });
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);

    const fetchEdificios = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/edificios/');
            setEdificios(response.data);
        } catch (error) {
            console.error('Erro ao buscar edifícios:', error);
            setMensagem('Erro ao buscar edifícios.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEdificios();
    }, []);

    const handleInputChange = (e) => {
        setNovoEdificio({ ...novoEdificio, [e.target.name]: e.target.value });
    };

    const handleCriarEdificio = async () => {
        try {
            await AuthService.authenticatedRequest('post', 'relatorios', '/edificios/', novoEdificio);
            setNovoEdificio({ nome: '', endereco: '', numeroApartamentos: 0 });
            fetchEdificios();
            setMensagem('Edifício criado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao criar edifício:', error);
            setMensagem('Erro ao criar edifício.');
            setTipoMensagem('error');
        }
    };

    const handleEdit = (edificio) => {
        setEditEdificioId(edificio.id);
        setEditFormData({ ...edificio });
    };

    const handleUpdate = async () => {
        try {
            await AuthService.authenticatedRequest('put', 'relatorios', `/edificios/${editEdificioId}/`, editFormData);
            setEditEdificioId(null);
            fetchEdificios();
            setMensagem('Edifício atualizado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao atualizar edifício:', error);
            setMensagem('Erro ao atualizar edifício.');
            setTipoMensagem('error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/edificios/${id}/`);
            fetchEdificios();
            setMensagem('Edifício excluído com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir edifício:', error);
            setMensagem('Erro ao excluir edifício.');
            setTipoMensagem('error');
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const handleChangeRowsPerPage = (event) => {
        setResultadosPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Edifício</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField label="Nome" name="nome" value={novoEdificio.nome} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Endereço" name="endereco" value={novoEdificio.endereco} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Número de Apartamentos" name="numeroApartamentos" type="number" value={novoEdificio.numeroApartamentos} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </div>
                <Button variant="contained" color="primary" onClick={handleCriarEdificio} className="mt-4">
                    Adicionar Edifício
                </Button>
            </div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Apartamentos</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {edificios
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((edificio) => (
                                        <tr key={edificio.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.nome}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{edificio.endereco}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.numeroApartamentos}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={Link} to={`/edificios/${edificio.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton onClick={() => handleEdit(edificio)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                        <Edit className="text-yellow-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton onClick={() => handleDelete(edificio.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
                                                        <Delete className="text-red-500" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={edificios.length}
                                rowsPerPage={resultadosPorPagina}
                                page={pagina}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Edifícios por página:"
                                className="text-sm text-gray-700"
                            />
                        </div>
                    </Paper>
                </div>
            )}
            <Dialog open={!!editEdificioId} onClose={() => setEditEdificioId(null)}>
                <DialogTitle>Editar Edifício</DialogTitle>
                <DialogContent>
                    <TextField label="Nome" name="nome" value={editFormData.nome} onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Endereço" name="endereco" value={editFormData.endereco} onChange={(e) => setEditFormData({ ...editFormData, endereco: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Número de Apartamentos" name="numeroApartamentos" type="number" value={editFormData.numeroApartamentos} onChange={(e) => setEditFormData({ ...editFormData, numeroApartamentos: parseInt(e.target.value, 10) })} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditEdificioId(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Atualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GerirEdificios;