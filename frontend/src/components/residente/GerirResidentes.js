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
import AuthService from '../../services/AuthService';; // Importe o AuthService

function GerirResidentes() {
    const [residentes, setResidentes] = useState([]);
    const [novoResidente, setNovoResidente] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
    });
    const [editResidenteId, setEditResidenteId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
    });
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);

    const fetchResidentes = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/residentes/');
            setResidentes(response.data);
        } catch (error) {
            console.error('Erro ao buscar residentes:', error);
            setMensagem('Erro ao buscar residentes.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidentes();
    }, []);

    const handleInputChange = (e) => {
        setNovoResidente({ ...novoResidente, [e.target.name]: e.target.value });
    };

    const handleCriarResidente = async () => {
        try {
            await AuthService.authenticatedRequest('post', 'relatorios', '/residentes/', novoResidente);
            setNovoResidente({ nome: '', email: '', telefone: '', endereco: '' });
            fetchResidentes();
            setMensagem('Residente criado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao criar residente:', error);
            setMensagem('Erro ao criar residente.');
            setTipoMensagem('error');
        }
    };

    const handleEdit = (residente) => {
        setEditResidenteId(residente.id);
        setEditFormData({ ...residente });
    };

    const handleUpdate = async () => {
        try {
            await AuthService.authenticatedRequest('put', 'relatorios', `/residentes/${editResidenteId}/`, editFormData);
            setEditResidenteId(null);
            fetchResidentes();
            setMensagem('Residente atualizado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao atualizar residente:', error);
            setMensagem('Erro ao atualizar residente.');
            setTipoMensagem('error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/residentes/${id}/`);
            fetchResidentes();
            setMensagem('Residente excluído com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir residente:', error);
            setMensagem('Erro ao excluir residente.');
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
                <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Residente</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <TextField label="Nome" name="nome" value={novoResidente.nome} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Email" name="email" value={novoResidente.email} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Telefone" name="telefone" value={novoResidente.telefone} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Endereço" name="endereco" value={novoResidente.endereco} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </div>
                <Button variant="contained" color="primary" onClick={handleCriarResidente} className="mt-4">
                    Adicionar Residente
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {residentes
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((residente) => (
                                        <tr key={residente.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{residente.nome}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{residente.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{residente.telefone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{residente.endereco}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={Link} to={`/residentes/${residente.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton onClick={() => handleEdit(residente)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                        <Edit className="text-yellow-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton onClick={() => handleDelete(residente.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
                                count={residentes.length}
                                rowsPerPage={resultadosPorPagina}
                                page={pagina}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Residentes por página:"
                                className="text-sm text-gray-700"
                            />
                        </div>
                    </Paper>
                </div>
            )}
            <Dialog open={!!editResidenteId} onClose={() => setEditResidenteId(null)}>
                <DialogTitle>Editar Residente</DialogTitle>
                <DialogContent>
                    <TextField label="Nome" name="nome" value={editFormData.nome} onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Email" name="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Telefone" name="telefone" value={editFormData.telefone} onChange={(e) => setEditFormData({ ...editFormData, telefone: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Endereço" name="endereco" value={editFormData.endereco} onChange={(e) => setEditFormData({ ...editFormData, endereco: e.target.value })} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditResidenteId(null)} color="primary">
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

export default GerirResidentes;