import React, { useEffect, useState, useContext } from 'react';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Select, MenuItem, Button, CircularProgress, Alert,
    TablePagination // Importe TablePagination
} from '@mui/material';

function AvaliarCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const { user } = useContext(AuthContext);

    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(7); // Máximo de 9 por página

    useEffect(() => {
        const fetchCandidaturas = async () => {
            try {
                const response = await AuthService.authenticatedRequest('get', 'candidaturas', '/');
                setCandidaturas(response.data);
                const initialStatusMap = {};
                response.data.forEach(c => { initialStatusMap[c.id] = c.status });
                setStatusMap(initialStatusMap);
            } catch (err) {
                setError('Erro ao carregar candidaturas.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidaturas();
    }, []);

    const handleStatusChange = (id, novoStatus) => {
        setStatusMap(prev => ({ ...prev, [id]: novoStatus }));
    };

    const atualizarEstado = async (id) => {
        try {
            await AuthService.authenticatedRequest('patch', 'candidaturas', `/atualizar/${id}/`, { status: statusMap[id] });
            setSuccessMsg(`Estado da candidatura ${id} atualizado para "${statusMap[id]}"`);
            setCandidaturas(prevCandidaturas =>
                prevCandidaturas.map(c =>
                    c.id === id ? { ...c, status: statusMap[id] } : c
                )
            );
        } catch (err) {
            setError('Erro ao atualizar estado da candidatura.');
        }
    };

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const handleChangeRowsPerPage = (event) => {
        setResultadosPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    const candidaturasPaginadas = React.useMemo(() => {
        const inicio = pagina * resultadosPorPagina;
        const fim = inicio + resultadosPorPagina;
        return candidaturas.slice(inicio, fim);
    }, [candidaturas, pagina, resultadosPorPagina]);

    const podeAvaliar = user?.groups?.includes("funcionario") || user?.groups?.includes("administrador");

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        
        <Paper className="p-4 shadow rounded-lg">
            <Typography variant="h5" className="mb-4">Avaliar Candidaturas</Typography>
            {successMsg && <Alert severity="success" className="mb-4">{successMsg}</Alert>}
            {podeAvaliar ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Estudante</TableCell>
                                <TableCell>Residência</TableCell>
                                <TableCell>Estado Atual</TableCell>
                                <TableCell>Novo Estado</TableCell>
                                <TableCell>Ação</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidaturasPaginadas.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.estudante?.Nome}</TableCell>
                                    <TableCell>{c.residencia?.Nome}</TableCell>
                                    <TableCell>{c.status}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={statusMap[c.id] || ''}
                                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                        >
                                            <MenuItem value="pendente">Pendente</MenuItem>
                                            <MenuItem value="em_analise">Em Análise</MenuItem>
                                            <MenuItem value="aprovado">Aprovado</MenuItem>
                                            <MenuItem value="rejeitado">Rejeitado</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => atualizarEstado(c.id)}>
                                            Atualizar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {candidaturas.length > 0 && (
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                          Total de Candidaturas: {candidaturas.length}
                                        </Typography>
                                      )}
                    <TablePagination
                        rowsPerPageOptions={[7]} // Apenas a opção de 9 por página
                        component="div"
                        count={candidaturas.length}
                        rowsPerPage={resultadosPorPagina}
                        page={pagina}
                        onPageChange={handleChangePage}
                        labelRowsPerPage="Candidaturas por página:"
                        className="text-sm text-gray-700"
                        SelectProps={{
                            disabled: true, // Desabilita a seleção de itens por página
                        }}
                    />
                </TableContainer>
            ) : (
                <Alert severity="warning">Você não tem permissão para avaliar candidaturas.</Alert>
            )}
        </Paper>
    );
}

export default AvaliarCandidaturas;