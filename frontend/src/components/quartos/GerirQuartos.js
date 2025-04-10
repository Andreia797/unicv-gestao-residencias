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
import AuthService from '../../services/AuthService';

function GerirQuartos() {
    const [quartos, setQuartos] = useState([]);
    const [novoQuarto, setNovoQuarto] = useState({
        numero: '',
        tipo: '',
        edificio: null, // Alterado para objeto
    });
    const [editQuartoId, setEditQuartoId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        numero: '',
        tipo: '',
        edificio: null, // Alterado para objeto
    });
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);

    const fetchQuartos = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/quartos/');
            setQuartos(response.data);
        } catch (error) {
            console.error('Erro ao buscar quartos:', error);
            setMensagem('Erro ao buscar quartos.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuartos();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'edificioId') {
            setNovoQuarto({ ...novoQuarto, edificio: { id: parseInt(e.target.value) } });
        } else {
            setNovoQuarto({ ...novoQuarto, [e.target.name]: e.target.value });
        }
    };

    const handleCriarQuarto = async () => {
        try {
            await AuthService.authenticatedRequest('post', 'relatorios', '/quartos/', {
                numero: novoQuarto.numero,
                tipo: novoQuarto.tipo,
                edificio: novoQuarto.edificio?.id ? novoQuarto.edificio : null,
            });
            setNovoQuarto({ numero: '', tipo: '', edificio: null });
            fetchQuartos();
            setMensagem('Quarto criado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao criar quarto:', error);
            setMensagem('Erro ao criar quarto.');
            setTipoMensagem('error');
        }
    };

    const handleEdit = (quarto) => {
        setEditQuartoId(quarto.id);
        setEditFormData({
            numero: quarto.numero,
            tipo: quarto.tipo,
            edificio: quarto.edificio, // Mantém o objeto edificio
        });
    };

    const handleEditInputChange = (e) => {
        if (e.target.name === 'edificioId') {
            setEditFormData({ ...editFormData, edificio: { id: parseInt(e.target.value) } });
        } else {
            setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
        }
    };

    const handleUpdate = async () => {
        try {
            await AuthService.authenticatedRequest('put', 'relatorios', `/quartos/${editQuartoId}/`, {
                numero: editFormData.numero,
                tipo: editFormData.tipo,
                edificio: editFormData.edificio?.id ? editFormData.edificio : null,
            });
            setEditQuartoId(null);
            fetchQuartos();
            setMensagem('Quarto atualizado com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao atualizar quarto:', error);
            setMensagem('Erro ao atualizar quarto.');
            setTipoMensagem('error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/quartos/${id}/`);
            fetchQuartos();
            setMensagem('Quarto excluído com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir quarto:', error);
            setMensagem('Erro ao excluir quarto.');
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
                <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Quarto</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField label="Número" name="numero" value={novoQuarto.numero} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Tipo" name="tipo" value={novoQuarto.tipo} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Edifício ID" name="edificioId" type="number" value={novoQuarto.edificio?.id || ''} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </div>
                <Button variant="contained" color="primary" onClick={handleCriarQuarto} className="mt-4">
                    Adicionar Quarto
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edifício</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {quartos
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((quarto) => (
                                        <tr key={quarto.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarto.numero}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarto.tipo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarto.edificio?.nome} ({quarto.edificio?.id})</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={Link} to={`/quartos/${quarto.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton onClick={() => handleEdit(quarto)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                        <Edit className="text-yellow-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton onClick={() => handleDelete(quarto.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
                                count={quartos.length}
                                rowsPerPage={resultadosPorPagina}
                                page={pagina}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Quartos por página:"
                                className="text-sm text-gray-700"
                            />
                        </div>
                    </Paper>
                </div>
            )}
            <Dialog open={!!editQuartoId} onClose={() => setEditQuartoId(null)}>
                <DialogTitle>Editar Quarto</DialogTitle>
                <DialogContent>
                    <TextField label="Número" name="numero" value={editFormData.numero} onChange={handleEditInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Tipo" name="tipo" value={editFormData.tipo} onChange={handleEditInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Edifício ID" name="edificioId" type="number" value={editFormData.edificio?.id || ''} onChange={handleEditInputChange} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditQuartoId(null)} color="primary">
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

export default GerirQuartos;