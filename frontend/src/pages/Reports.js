import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import {
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function Reports() {
    const [candidaturasReport, setCandidaturasReport] = useState(null);
    const [residentesReport, setResidentesReport] = useState(null);
    const [edificiosReport, setEdificiosReport] = useState(null);
    const [quartosReport, setQuartosReport] = useState(null);
    const [camasReport, setCamasReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const candidaturasData = await AuthService.authenticatedRequest('get', 'relatorios', '/candidaturas/estado/');
                setCandidaturasReport(candidaturasData.data);
                const residentesData = await AuthService.authenticatedRequest('get', 'relatorios', '/residentes/total/');
                setResidentesReport(residentesData.data);
                const edificiosData = await AuthService.authenticatedRequest('get', 'relatorios', '/edificios/tipo/');
                setEdificiosReport(edificiosData.data);
                const quartosData = await AuthService.authenticatedRequest('get', 'relatorios', '/quartos/relatorio/');
                setQuartosReport(quartosData.data);
                const camasData = await AuthService.authenticatedRequest('get', 'relatorios', '/camas/relatorio/');
                setCamasReport(camasData.data);
            } catch (err) {
                console.error('Erro ao buscar relatórios:', err);
                setError('Erro ao carregar os relatórios.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="p-4">
            <Typography variant="h4" className="font-bold mb-4">Relatórios</Typography>

            <Grid container spacing={4}>
                {/* Coluna 1: Residentes, Quartos e Camas */}
                <Grid item xs={12} md={6}>
                    {/* Relatório de Residentes */}
                    <Paper className="p-4 shadow rounded-lg mb-4">
                        <Typography variant="h6" className="font-semibold mb-2">Relatório de Residentes</Typography>
                        {residentesReport && residentesReport.totalResidentes !== undefined ? (
                            <TableContainer>
                                <Table aria-label="tabela de residentes">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-semibold">Total de Residentes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key="total">
                                            <TableCell>{residentesReport.totalResidentes}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography color="textSecondary">Dados de residentes não disponíveis.</Typography>
                        )}
                    </Paper>

                    {/* Relatório de Quartos */}
                    <Paper className="p-4 shadow rounded-lg mb-4">
                        <Typography variant="h6" className="font-semibold mb-2">Relatório de Quartos</Typography>
                        {quartosReport ? (
                            <TableContainer>
                                <Table aria-label="tabela de quartos">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-semibold">Total de Quartos</TableCell>
                                            <TableCell className="font-semibold">Quartos Livres</TableCell>
                                            <TableCell className="font-semibold">Quartos Ocupados</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key="quartos">
                                            <TableCell>{quartosReport.totalQuartos}</TableCell>
                                            <TableCell>{quartosReport.quartosLivres}</TableCell>
                                            <TableCell>{quartosReport.quartosOcupados}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography color="textSecondary">Dados de quartos não disponíveis.</Typography>
                        )}
                    </Paper>

                    {/* Relatório de Camas */}
                    <Paper className="p-4 shadow rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-2">Relatório de Camas</Typography>
                        {camasReport ? (
                            <TableContainer>
                                <Table aria-label="tabela de camas">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-semibold">Total de Camas</TableCell>
                                            <TableCell className="font-semibold">Camas Livres</TableCell>
                                            <TableCell className="font-semibold">Camas Ocupadas</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key="camas">
                                            <TableCell>{camasReport.totalCamas}</TableCell>
                                            <TableCell>{camasReport.camasLivres}</TableCell>
                                            <TableCell>{camasReport.camasOcupadas}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography color="textSecondary">Dados de camas não disponíveis.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Coluna 2: Candidaturas e Edifícios */}
                <Grid item xs={12} md={6}>
                    {/* Relatório de Candidaturas */}
                    <Paper className="p-4 shadow rounded-lg mb-4">
                        <Typography variant="h6" className="font-semibold mb-2">Relatório de Candidaturas</Typography>
                        {candidaturasReport && candidaturasReport.statusCounts ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={candidaturasReport.statusCounts}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography color="textSecondary">Dados de candidaturas não disponíveis.</Typography>
                        )}
                    </Paper>

                    {/* Relatório de Edifícios */}
                    <Paper className="p-4 shadow rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-2">Relatório de Edifícios</Typography>
                        {edificiosReport && edificiosReport.totalPorTipo ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={edificiosReport.totalPorTipo}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {edificiosReport.totalPorTipo.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography color="textSecondary">Dados de edifícios não disponíveis.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Reports;