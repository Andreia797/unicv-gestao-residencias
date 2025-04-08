import React, { useState, useEffect } from 'react';
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
import Notificacoes from '../Notificacoes';
import AuthService from '../../services/AuthService';// Importe o AuthService

function CandidaturasLista() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);

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

    const filtrarCandidaturas = () =>
        candidaturas.filter(
            (candidatura) =>
                (filtroStatus === '' || candidatura.status?.toLowerCase() === filtroStatus.toLowerCase()) &&
                (pesquisa === '' ||
                    candidatura.nome_completo?.toLowerCase().includes(pesquisa.toLowerCase()) || // Assuming 'nome_completo' exists
                    candidatura.email?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                    candidatura.telefone?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                    candidatura.curso?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                    candidatura.data_submissao?.toLowerCase().includes(pesquisa.toLowerCase()))
        );

    const candidaturasFiltradas = filtrarCandidaturas();

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
            <div className="flex space-x-4 mb-4">
                <TextField
                    label="Pesquisar"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Pesquisar por nome, email, telefone, curso ou data"
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
                    <MenuItem value="">Todos os Status</MenuItem>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Submissão</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidaturasFiltradas
                                .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                .map((candidatura) => (
                                    <tr key={candidatura.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.estudante.Nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.telefone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.curso}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.data_submissao}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidatura.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Tooltip title="Detalhes">
                                                <IconButton component={Link} to={`/candidaturas/${candidatura.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                    <Visibility className="text-blue-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton component={Link} to={`/candidaturas/editar/${candidatura.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                    <Edit className="text-yellow-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton onClick={() => excluirCandidatura(candidatura.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
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