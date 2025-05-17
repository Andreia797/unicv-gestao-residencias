import React, { useState, useEffect, useContext } from 'react';
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
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';

function CamasLista() {
    const [camas, setCamas] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [pesquisa, setPesquisa] = useState('');
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // Acesse as informações do usuário logado

    useEffect(() => {
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

        fetchCamas();
    }, []);

    const excluirCama = async (id) => {
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

    const camasFiltradas = camas.filter((cama) =>
        cama.numero?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        cama.quarto?.edificio?.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        cama.status?.toLowerCase().includes(pesquisa.toLowerCase())
    );

    // Lógica de controle de acesso para as ações de editar e excluir camas
    const podeEditarCama = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeExcluirCama = user?.groups?.includes("administrador");

    return (
        <div className="p-4">
            <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={() => setMensagem(null)} />
            <h2 className="text-2xl font-semibold mb-4">Lista de Camas</h2>
            <TextField
                label="Pesquisar por número, edifício ou estado"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                className="mb-4"
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edifício</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {camasFiltradas
                                .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                .map((cama) => (
                                    <tr key={cama.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.numero}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.quarto?.edificio?.nome}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cama.status}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <Tooltip title="Detalhes">
                                                <IconButton component={Link} to={`/camas/${cama.id}`} className="ml-1">
                                                    <Visibility className="text-blue-500" />
                                                </IconButton>
                                            </Tooltip>
                                            {podeEditarCama && (
                                                <Tooltip title="Editar">
                                                    <IconButton component={Link} to={`/camas/editar/${cama.id}`} className="ml-2">
                                                        <Edit className="text-yellow-500" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {podeExcluirCama && (
                                                <Tooltip title="Excluir">
                                                    <IconButton onClick={() => excluirCama(cama.id)} className="ml-2">
                                                        <Delete className="text-red-500" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={camasFiltradas.length}
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

export default CamasLista;