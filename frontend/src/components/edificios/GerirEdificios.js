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

function GerirEdificios() {
    const [edificios, setEdificios] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchEdificios = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', '/edificios/');
                setEdificios(response.data);
            } catch (error) {
                console.error('Erro ao buscar edifícios:', error);
                setMensagem('Erro ao buscar edifícios.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };

        fetchEdificios();
    }, []);

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', `/edificios/${id}/`);
            // Após a exclusão bem-sucedida, refazer a busca de edifícios para atualizar a lista
            const response = await AuthService.authenticatedRequest('get', '/edificios/');
            setEdificios(response.data);
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

    const podeEditarExcluir = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeAdicionar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <h2 className="text-2xl font-semibold mb-4">Gestão de Edifícios</h2>
            {podeAdicionar && (
                <div className="flex justify-end mb-4">
                    <Button component={Link} to="/edificios/criar" variant="contained" color="primary">
                        Adicionar Novo Edifício
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do edificio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Quartos</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {edificios
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((edificio) => (
                                        <tr key={edificio.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{edificio.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.numeroApartamentos}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={Link} to={`/edificios/${edificio.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                {podeEditarExcluir && (
                                                    <>
                                                        <Tooltip title="Editar">
                                                            <IconButton component={Link} to={`/edificios/editar/${edificio.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                                <Edit className="text-yellow-500" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Excluir">
                                                            <IconButton onClick={() => handleDelete(edificio.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
        </div>
    );
}

export default GerirEdificios;