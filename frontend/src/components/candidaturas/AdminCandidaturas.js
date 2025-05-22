import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Paper,
    IconButton,
    Tooltip,
    Pagination,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import { Visibility, CheckCircle, Close } from '@mui/icons-material';
import NotificacoesCandidatura from '../NotificacoesCandidatura';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';

function AdminCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [pagina, setPagina] = useState(1);
    const resultadosPorPagina = 7;
    const [pesquisa, setPesquisa] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'candidaturas', '/');
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
            await AuthService.authenticatedRequest('put', 'candidaturas', `/atualizar/${id}/`, { status: 'aprovado' });
            setCandidaturas(candidaturas.map(candidatura =>
                candidatura.id === id ? { ...candidatura, status: 'aprovado' } : candidatura
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
            await AuthService.authenticatedRequest('put', 'candidaturas', `/atualizar/${id}/`, { status: 'rejeitado' });
            setCandidaturas(candidaturas.map(candidatura =>
                candidatura.id === id ? { ...candidatura, status: 'rejeitado' } : candidatura
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
        String(candidatura.id)?.includes(pesquisa) ||
        candidatura.estudante?.Nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        candidatura.status?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        format(new Date(candidatura.data_submissao), 'dd/MM/yyyy', { locale: ptBR }).includes(pesquisa)
    );

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const totalPaginas = Math.ceil(candidaturasFiltradas.length / resultadosPorPagina);

    const candidaturasPaginadas = React.useMemo(() => {
        const inicio = (pagina - 1) * resultadosPorPagina;
        const fim = inicio + resultadosPorPagina;
        return candidaturasFiltradas.slice(inicio, fim);
    }, [candidaturasFiltradas, pagina]);

    const podeAprovarRejeitar = user?.groups?.includes("administrador");
    const podeVerDetalhes = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");

    return (
        <div className="p-4">
           <Typography variant="h5" className="mb-4">Verificar Candidaturas</Typography>
            <NotificacoesCandidatura mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <TextField label="Pesquisar" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" variant="outlined" size="small" />
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Estudante</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Submissão</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidaturasPaginadas.map((candidatura) => (
                                <tr key={candidatura.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{candidatura.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{candidatura.estudante?.Nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(new Date(candidatura.data_submissao), 'dd/MM/yyyy', { locale: ptBR })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{candidatura.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {podeAprovarRejeitar && (
                                            <>
                                                <Tooltip title="Aprovar">
                                                    <IconButton onClick={() => handleAprovar(candidatura.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full">
                                                        <CheckCircle color="success" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Rejeitar">
                                                    <IconButton onClick={() => handleRejeitar(candidatura.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
                                                        <Close color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        {podeVerDetalhes && (
                                            <Tooltip title="Detalhes">
                                                <IconButton component={Link} to={`/admin/candidaturas/${candidatura.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ml-2">
                                                    <Visibility color="info" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {candidaturas.length > 0 && (
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                          Total de Candidaturas: {candidaturas.length}
                                        </Typography>
                                      )}
                    {candidaturasFiltradas.length > 0 && (
                        <div className="px-4 py-3 bg-gray-50 flex justify-end items-center">
                            <Pagination
                                count={totalPaginas}
                                page={pagina}
                                onChange={handleChangePage}
                                color="primary"
                                size="large"
                            />
                        </div>
                    )}
                </Paper>
            )}
        </div>
    );
}

export default AdminCandidaturas;