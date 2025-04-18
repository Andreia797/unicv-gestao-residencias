import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Paper,
    IconButton,
    Tooltip,
    TablePagination,
    TextField,
    CircularProgress,
} from '@mui/material';
import { Visibility, CheckCircle, Close } from '@mui/icons-material';
import Notificacoes from '../Notificacoes';
import AuthService from '../../services/AuthService';// Importe o AuthService

function AdminCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(10);
    const [pesquisa, setPesquisa] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', '/admin/candidaturas/');
                setCandidaturas(response.data);
            } catch (error) {
                console.error('Erro ao buscar candidaturas:', error);
                setMensagem('Erro ao buscar candidaturas.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAprovar = async (id) => {
        try {
            await AuthService.authenticatedRequest('put', 'relatorios', `/admin/candidaturas/${id}/aprovar/`);
            setCandidaturas(candidaturas.map(candidatura =>
                candidatura.id === id ? { ...candidatura, status: 'Aprovada' } : candidatura
            ));
            setMensagem('Candidatura aprovada com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao aprovar candidatura:', error);
            setMensagem('Erro ao aprovar candidatura.');
            setTipoMensagem('error');
        }
    };

    const handleRejeitar = async (id) => {
        try {
            await AuthService.authenticatedRequest('put', 'relatorios', `/admin/candidaturas/${id}/rejeitar/`);
            setCandidaturas(candidaturas.map(candidatura =>
                candidatura.id === id ? { ...candidatura, status: 'Rejeitada' } : candidatura
            ));
            setMensagem('Candidatura rejeitada com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao rejeitar candidatura:', error);
            setMensagem('Erro ao rejeitar candidatura.');
            setTipoMensagem('error');
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    const candidaturasFiltradas = candidaturas.filter((candidatura) =>
        candidatura.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        String(candidatura.id)?.includes(pesquisa) ||
        candidatura.status?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        format(new Date(candidatura.dataCriacao), 'dd/MM/yyyy', { locale: ptBR }).includes(pesquisa)
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
            <h1 className="text-2xl font-bold mb-4">Gestão de Candidaturas</h1>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidaturasFiltradas
                                .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                .map((candidatura) => (
                                    <tr key={candidatura.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(candidatura.dataCriacao), 'dd/MM/yyyy', { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Tooltip title="Aprovar">
                                                <IconButton
                                                    onClick={() => handleAprovar(candidatura.id)}
                                                    color="success"
                                                    className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
                                                >
                                                    <CheckCircle />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Rejeitar">
                                                <IconButton
                                                    onClick={() => handleRejeitar(candidatura.id)}
                                                    color="error"
                                                    className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2"
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Detalhes">
                                                <IconButton component={Link} to={`/admin/candidaturas/${candidatura.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ml-2">
                                                    <Visibility color="info" />
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
                            count={candidaturasFiltradas.length}
                            rowsPerPage={resultadosPorPagina}
                            page={pagina}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Candidaturas por página:"
                            className="text-sm text-gray-700"
                        />
                    </div>
                </Paper>
            )}
        </div>
    );
}

export default AdminCandidaturas;