import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    IconButton,
    Tooltip,
    TextField,
    Select,
    MenuItem,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import NotificacoesCandidatura from '../NotificacoesCandidatura';
import AuthService from '../../services/AuthService';
import  {AuthContext, AuthProvider } from '../AuthContext';

function CandidaturasLista() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // Acesse as informações do usuário logado

    useEffect(() => {
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

        fetchCandidaturas();
    }, []);


    const excluirCandidatura = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'relatorios', `/candidaturas/${id}/`);
            // Atualiza a lista localmente após a exclusão
            setCandidaturas(candidaturas.filter((candidatura) => candidatura.id !== id));
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

    const filtrarCandidaturas = () =>
        candidaturas.filter(
            (candidatura) =>
                (filtroStatus === '' || candidatura.status?.toLowerCase() === filtroStatus.toLowerCase()) &&
                (pesquisa === '' ||
                    candidatura.estudante?.Nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                    candidatura.DataSubmissao?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                    candidatura.residencia?.Nome?.toLowerCase().includes(pesquisa.toLowerCase()))
        );

    const candidaturasFiltradas = filtrarCandidaturas();

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const handleChangeRowsPerPage = (event) => {
        setResultadosPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    // Lógica de controle de acesso para as ações
    const podeVerDetalhes = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador") || user?.groups?.includes("estudante");
    const podeEditar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeExcluir = user?.groups?.includes("administrador");

    return (
        <div className="p-4">
            <NotificacoesCandidatura mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
            <div className="flex space-x-4 mb-4">
                <TextField
                    label="Pesquisar"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Pesquisar por nome do estudante, residência ou data"
                    variant="outlined"
                    size="small"
                />
                <Select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="min-w-[150px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    variant="outlined"
                    size="small"
                >
                    <MenuItem value="">Todos os Estados</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="aprovado">Aprovado</MenuItem>
                    <MenuItem value="rejeitado">Rejeitado</MenuItem>
                    <MenuItem value="em_analise">Em Análise</MenuItem>
                </Select>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estudante
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
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidaturasFiltradas
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
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
                                                    <IconButton onClick={() => excluirCandidatura(candidatura.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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

export default CandidaturasLista;