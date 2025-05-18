import React, { useEffect, useState, useContext } from 'react';
import AuthService from '../../services/AuthService';
import { AuthContext } from '../AuthContext';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Select, MenuItem, Button, CircularProgress, Alert
} from '@mui/material';

function AvaliarCandidaturas() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const { user } = useContext(AuthContext); // Acesse as informações do usuário logado

    useEffect(() => {
        const fetchCandidaturas = async () => {
            try {
                // Corrigido para usar a rota base '/' com o tipo 'candidaturas'
                const response = await AuthService.authenticatedRequest('get', 'candidaturas', '/');
                setCandidaturas(response.data);
                const initialStatusMap = {};
                response.data.forEach(c => { initialStatusMap[c.id] = c.estado });
                setStatusMap(initialStatusMap);
            } catch (err) {
                setError('Erro ao carregar candidaturas.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidaturas();
    }, []);

    const handleStatusChange = (id, novoEstado) => {
        setStatusMap(prev => ({ ...prev, [id]: novoEstado }));
    };

    const atualizarEstado = async (id) => {
        try {
            // Corrigido para usar a rota base e o ID corretamente, e o método PATCH
            await AuthService.authenticatedRequest('patch', 'candidaturas', `/atualizar/${id}/`, { estado: statusMap[id] });
            setSuccessMsg(`Estado da candidatura ${id} atualizado para "${statusMap[id]}"`);
            // Opcional: Atualizar a lista localmente para refletir a mudança imediatamente
            setCandidaturas(prevCandidaturas =>
                prevCandidaturas.map(c =>
                    c.id === id ? { ...c, estado: statusMap[id] } : c
                )
            );
        } catch (err) {
            setError('Erro ao atualizar estado da candidatura.');
        }
    };

    // Lógica de controle de acesso: apenas funcionários e administradores podem avaliar candidaturas
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
                            {candidaturas.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.estudante_nome}</TableCell>
                                    <TableCell>{c.residencia_nome}</TableCell>
                                    <TableCell>{c.estado}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={statusMap[c.id] || ''}
                                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                        >
                                            <MenuItem value="pendente">Pendente</MenuItem>
                                            <MenuItem value="em_analise">Em Análise</MenuItem>
                                            <MenuItem value="aceite">Aceite</MenuItem>
                                            <MenuItem value="rejeitada">Rejeitada</MenuItem>
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
                </TableContainer>
            ) : (
                <Alert severity="warning">Você não tem permissão para avaliar candidaturas.</Alert>
            )}
        </Paper>
    );
}

export default AvaliarCandidaturas;