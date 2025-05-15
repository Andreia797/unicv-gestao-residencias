import React, { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';
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

  useEffect(() => {
    const fetchCandidaturas = async () => {
      try {
        const response = await AuthService.authenticatedRequest('get', 'candidaturas', '/listar/');
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
      await AuthService.authenticatedRequest('patch', 'candidaturas', `/atualizar/${id}/`, { estado: statusMap[id] });
      setSuccessMsg(`Estado da candidatura ${id} atualizado para "${statusMap[id]}"`);
    } catch (err) {
      setError('Erro ao atualizar estado da candidatura.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  return (
    <Paper className="p-4 shadow rounded-lg">
      <Typography variant="h5" className="mb-4">Avaliar Candidaturas</Typography>
      {successMsg && <Alert severity="success" className="mb-4">{successMsg}</Alert>}
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
    </Paper>
  );
}

export default AvaliarCandidaturas;