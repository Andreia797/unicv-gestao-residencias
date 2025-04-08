import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    IconButton,
    Tooltip,
    TextField,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import Notificacoes from '../Notificacoes';
import AuthService from '../../services/AuthService'; // Importe o AuthService

function EdificiosLista() {
    const [edificios, setEdificios] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [pesquisa, setPesquisa] = useState('');
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchEdificios();
    }, []);

    const excluirEdificio = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/edificios/${id}/`);
            // Atualiza a lista localmente após a exclusão
            setEdificios(edificios.filter((edificio) => edificio.id !== id));
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

    const edificiosFiltrados = edificios.filter((edificio) =>
        edificio.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        edificio.endereco?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        String(edificio.numero_apartamentos)?.includes(pesquisa.toLowerCase())
    );

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
            <TextField
                label="Pesquisar"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                variant="outlined"
                size="small"
            />
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <Paper className="shadow-md rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Apartamentos</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {edificiosFiltrados
                                .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                .map((edificio) => (
                                    <tr key={edificio.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.endereco}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{edificio.numeroApartamentos}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Tooltip title="Detalhes">
                                                <IconButton component={Link} to={`/edificios/${edificio.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                    <Visibility className="text-blue-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton component={Link} to={`/edificios/editar/${edificio.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                    <Edit className="text-yellow-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton onClick={() => excluirEdificio(edificio.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={edificiosFiltrados.length}
                            rowsPerPage={resultadosPorPagina}
                            page={pagina}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Edifícios por página:"
                            className="text-sm text-gray-700"
                        />
                    </div>
                </Paper>
            )}
        </div>
    );
}

export default EdificiosLista;