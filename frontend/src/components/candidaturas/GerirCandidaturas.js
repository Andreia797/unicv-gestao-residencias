import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    Typography,
    TextField,
    Pagination // Importe Pagination
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import NotificacoesCandidatura from '../NotificacoesCandidatura';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';

function GerirCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(1); // Começa na página 1
    const resultadosPorPagina = 8; // Definição fixa de 9 por 
    const [pesquisa, setPesquisa] = useState('');
    const { user } = useContext(AuthContext);

    const fetchCandidaturas = async () => {
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

    useEffect(() => {
        fetchCandidaturas();
    }, []);

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest('delete', 'candidaturas', `/${id}/`);
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

    const totalPaginas = Math.ceil(candidaturas.length / resultadosPorPagina);

    const candidaturasPaginadas = React.useMemo(() => {
        const inicio = (pagina - 1) * resultadosPorPagina;
        const fim = inicio + resultadosPorPagina;
        return candidaturas.slice(inicio, fim);
    }, [candidaturas, pagina]);

    const podeVerDetalhes = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeEditar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");
    const podeExcluir = user?.groups?.includes("administrador");

    return (
        <div className="p-4">
            <NotificacoesCandidatura mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
           <h2 className="text-2xl font-semibold mb-4">Gestão de Candidaturas</h2>    
          <TextField label="Pesquisar" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" variant="outlined" size="small" />
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
                                {candidaturasPaginadas.map((candidatura) => (
                                    <tr key={candidatura.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{candidatura.estudante?.Nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{candidatura.residencia?.Nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{candidatura.residencia?.edificio}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatarData(candidatura.data_submissao)}
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
                         {candidaturas.length > 0 && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Total de Candidaturas: {candidaturas.length}
                    </Typography>
                  )}
                        {candidaturas.length > 0 && (
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
                </div>
            )}
        </div>
    );
}

export default GerirCandidaturas;