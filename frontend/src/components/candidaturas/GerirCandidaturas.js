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

function GerirCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [novaCandidatura, setNovaCandidatura] = useState({
        nome: '',
        descricao: '',
        estado: '',
        utilizadorId: null,
    });
    const [editCandidaturaId, setEditCandidaturaId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nome: '',
        descricao: '',
        estado: '',
        utilizadorId: null,
    });
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);

    const fetchCandidaturas = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/candidaturas/');
            setCandidaturas(response.data);
        } catch (error) {
            console.error('Erro ao buscar candidaturas:', error);
            setMensagem('Erro ao buscar candidaturas.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidaturas();
    }, []);

    const handleInputChange = (e) => {
        setNovaCandidatura({ ...novaCandidatura, [e.target.name]: e.target.value });
    };

    const handleCriarCandidatura = async () => {
        try {
            await AuthService.authenticatedRequest('post', 'relatorios', '/candidaturas/', novaCandidatura);
            setNovaCandidatura({ nome: '', descricao: '', estado: '', utilizadorId: null });
            fetchCandidaturas();
            setMensagem('Candidatura criada com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao criar candidatura:', error);
            setMensagem('Erro ao criar candidatura.');
            setTipoMensagem('error');
        }
    };

    const handleEdit = (candidatura) => {
        setEditCandidaturaId(candidatura.id);
        // Assumindo que você quer editar esses campos. Adapte conforme necessário.
        setEditFormData({
            nome: candidatura.nome || '',
            descricao: candidatura.descricao || '',
            estado: candidatura.status || '', // Usando 'status' do seu JSON como 'estado'
            utilizadorId: candidatura.utilizadorId || null, // Se existir
        });
    };

    const handleUpdate = async () => {
        try {
            await AuthService.authenticatedRequest('put', 'relatorios', `/candidaturas/${editCandidaturaId}/`, editFormData);
            setEditCandidaturaId(null);
            fetchCandidaturas();
            setMensagem('Candidatura atualizada com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao atualizar candidatura:', error);
            setMensagem('Erro ao atualizar candidatura.');
            setTipoMensagem('error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/candidaturas/${id}/`);
            fetchCandidaturas();
            setMensagem('Candidatura excluída com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir candidatura:', error);
            setMensagem('Erro ao excluir candidatura.');
            setTipoMensagem('error');
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleDateString();
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
                <h2 className="text-2xl font-semibold mb-4">Adicionar Nova Candidatura</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <TextField label="Nome" name="nome" value={novaCandidatura.nome} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Descrição" name="descricao" value={novaCandidatura.descricao} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Estado" name="estado" value={novaCandidatura.estado} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Utilizador ID" name="utilizadorId" type="number" value={novaCandidatura.utilizadorId || ''} onChange={handleInputChange} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </div>
                <Button variant="contained" color="primary" onClick={handleCriarCandidatura} className="mt-4">
                    Adicionar Candidatura
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Estudante</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residência</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edifício</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Submissão</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {candidaturas
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((candidatura) => (
                                        <tr key={candidatura.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.estudante?.Nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.residencia?.Nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.residencia?.edificio}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatarData(candidatura.DataSubmissao)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={React.forwardRef((props, ref) => <Link to={`/candidaturas/${candidatura.id}`} {...props} ref={ref} />)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton onClick={() => handleEdit(candidatura)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                        <Edit className="text-yellow-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton onClick={() => handleDelete(candidatura.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
                                count={candidaturas.length}
                                rowsPerPage={resultadosPorPagina}
                                page={pagina}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Candidaturas por página:"
                                className="text-sm text-gray-700"
                            />
                        </div>
                    </Paper>
                </div>
            )}
            <Dialog open={!!editCandidaturaId} onClose={() => setEditCandidaturaId(null)}>
                <DialogTitle>Editar Candidatura</DialogTitle>
                <DialogContent>
                    <TextField label="Nome" name="nome" value={editFormData.nome} onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Descrição" name="descricao" value={editFormData.descricao} onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Estado" name="estado" value={editFormData.estado} onChange={(e) => setEditFormData({ ...editFormData, estado: e.target.value })} className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                    <TextField label="Utilizador ID" name="utilizadorId" type="number" value={editFormData.utilizadorId || ''} onChange={(e) => setEditFormData({ ...editFormData, utilizadorId: e.target.value })} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" fullWidth variant="outlined" size="small" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditCandidaturaId(null)} color="primary">
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

export default GerirCandidaturas;