import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../AuthContext';

function GerirQuartos() {
    const [quartos, setQuartos] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);
    const { user } = useContext(AuthContext);

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

    const podeEditarExcluir = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeAdicionar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <h2 className="text-2xl font-semibold mb-4">Gestão de Quartos</h2>
            {podeAdicionar && (
                <div className="flex justify-end mb-4">
                    <Button component={Link} to="/quartos/criar" variant="contained" color="primary">
                        Adicionar Novo Quarto
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de quarto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do edifício</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {quartos
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((quarto) => (
                                        <tr key={quarto.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarto.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarto.tipo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quarto.edificio?.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={Link} to={`/quartos/${quarto.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                {podeEditarExcluir && (
                                                    <>
                                                        <Tooltip title="Editar">
                                                            <IconButton component={Link} to={`/quartos/editar/${quarto.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                                <Edit className="text-yellow-500" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Excluir">
                                                            <IconButton onClick={() => handleDelete(quarto.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
            </div>
        );
    }

export default GerirQuartos;