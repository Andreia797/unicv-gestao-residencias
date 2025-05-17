import React, { useState, useEffect, useRef } from 'react';
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
    Button
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Reports() {
    const [candidaturasReport, setCandidaturasReport] = useState(null);
    const [residentesReport, setResidentesReport] = useState(null);
    const [edificiosReport, setEdificiosReport] = useState(null);
    const [quartosReport, setQuartosReport] = useState(null);
    const [camasReport, setCamasReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reportRef = useRef(); // Referência para capturar a div do relatório

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

    const exportPDF = () => {
        const input = reportRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('relatorio.pdf');
        });
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">Relatórios</Typography>
                <Button variant="contained" color="primary" onClick={exportPDF}>
                    Download PDF
                </Button>
            </div>

            <div ref={reportRef}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        {/* Residentes */}
                        <Paper className="p-4 shadow rounded-lg mb-4">
                            <Typography variant="h6" className="font-semibold mb-2">Relatório de Residentes</Typography>
                            {residentesReport?.totalResidentes !== undefined ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Total de Residentes</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{residentesReport.totalResidentes}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography color="textSecondary">Dados de residentes não disponíveis.</Typography>
                            )}
                        </Paper>

                        {/* Quartos */}
                        <Paper className="p-4 shadow rounded-lg mb-4">
                            <Typography variant="h6" className="font-semibold mb-2">Relatório de Quartos</Typography>
                            {quartosReport ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Total de Quartos</TableCell>
                                                <TableCell>Quartos Livres</TableCell>
                                                <TableCell>Quartos Ocupados</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
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

                        {/* Camas */}
                        <Paper className="p-4 shadow rounded-lg">
                            <Typography variant="h6" className="font-semibold mb-2">Relatório de Camas</Typography>
                            {camasReport ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Total de Camas</TableCell>
                                                <TableCell>Camas Livres</TableCell>
                                                <TableCell>Camas Ocupadas</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
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

                    <Grid item xs={12} md={6}>
                        {/* Candidaturas */}
                        <Paper className="p-4 shadow rounded-lg mb-4">
                            <Typography variant="h6" className="font-semibold mb-2">Relatório de Candidaturas</Typography>
                            {candidaturasReport?.statusCounts ? (
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

                        {/* Edifícios */}
                        <Paper className="p-4 shadow rounded-lg">
                            <Typography variant="h6" className="font-semibold mb-2">Relatório de Edifícios</Typography>
                            {edificiosReport?.totalPorTipo ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={edificiosReport.totalPorTipo}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
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
        </div>
    );
}

export default Reports;