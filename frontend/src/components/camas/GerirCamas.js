import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    IconButton,
    Tooltip,
    TablePagination,
    CircularProgress,
    Button,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import Notificacoes from '../Notificacoes';
import AuthService from '../../services/AuthService';

function GerirCamas() {
    const [camas, setCamas] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);

    useEffect(() => {
        fetchCamas();
    }, []);

    const fetchCamas = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/camas/');
            setCamas(response.data);
        } catch (error) {
            console.error('Erro ao buscar camas:', error);
            setMensagem('Erro ao buscar camas.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/camas/${id}/`);
            setCamas((prev) => prev.filter((cama) => cama.id !== id));
            setMensagem('Cama excluída com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir cama:', error);
            setMensagem('Erro ao excluir cama.');
            setTipoMensagem('error');
        }
    };

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={() => setMensagem(null)} />
            <h2 className="text-2xl font-semibold mb-4">Gestão de Camas</h2>
            <div className="flex justify-end mb-4">
                <Button component={Link} to="/camas/criar" variant="contained" color="primary">
                    Adicionar Nova Cama
                </Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <Paper className="shadow-md rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Quarto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {camas
                                .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                .map((cama) => (
                                    <tr key={cama.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.quarto?.tipo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.status}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <Tooltip title="Detalhes">
                                                <IconButton component={Link} to={`/camas/${cama.id}`} className="ml-1">
                                                    <Visibility className="text-blue-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton component={Link} to={`/camas/editar/${cama.id}`} className="ml-2">
                                                    <Edit className="text-yellow-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton onClick={() => handleDelete(cama.id)} className="ml-2">
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
                            count={camas.length}
                            rowsPerPage={resultadosPorPagina}
                            page={pagina}
                            onPageChange={(e, newPage) => setPagina(newPage)}
                            onRowsPerPageChange={(e) => {
                                setResultadosPorPagina(parseInt(e.target.value, 10));
                                setPagina(0);
                            }}
                            labelRowsPerPage="Camas por página:"
                        />
                    </div>
                </Paper>
            )}
        </div>
    );
}

export default GerirCamas;
