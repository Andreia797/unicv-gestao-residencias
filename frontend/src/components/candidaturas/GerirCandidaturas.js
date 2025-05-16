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
import NotificacoesCandidatura from '../NotificacoesCandidatura';
import AuthService from '../../services/AuthService';
import  {AuthContext, AuthProvider } from '../AuthContext';

function GerirCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);
    const { user } = useContext(AuthContext); // Acesse as informações do usuário logado

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

    // Lógica de controle de acesso para as ações
    const podeVerDetalhes = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeEditar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeExcluir = user?.groups?.includes("administrador");
    const podeAdicionar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");

    return (
        <div className="p-4">
            <NotificacoesCandidatura mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            {podeAdicionar && (
                <div className="flex justify-end mb-4">
                    <Button component={Link} to="/candidaturas/nova" variant="contained" color="primary">
                        Adicionar Nova Candidatura
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome do Estudante
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Residência
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Edifício
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data de Submissão
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {candidaturas
                                    .slice(pagina * resultadosPorPagina, (pagina + 1) * resultadosPorPagina)
                                    .map((candidatura) => (
                                        <tr key={candidatura.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{candidatura.estudante?.Nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{candidatura.residencia?.Nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{candidatura.residencia?.edificio}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatarData(candidatura.DataSubmissao)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{candidatura.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {podeVerDetalhes && (
                                                    <Tooltip title="Ver Detalhes">
                                                        <IconButton component={Link} to={`/candidaturas/${candidatura.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                            <Visibility className="text-blue-500" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {podeEditar && (
                                                    <Tooltip title="Editar">
                                                        <IconButton component={Link} to={`/candidaturas/editar/${candidatura.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                            <Edit className="text-yellow-500" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {podeExcluir && (
                                                    <Tooltip title="Excluir">
                                                        <IconButton onClick={() => handleDelete(candidatura.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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
        </div>
    );
}

export default GerirCandidaturas;