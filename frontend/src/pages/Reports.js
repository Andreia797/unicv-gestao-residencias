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
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

function Reports() {
    const [candidaturasReport, setCandidaturasReport] = useState(null);
    const [residentesReport, setResidentesReport] = useState(null);
    const [edificiosReport, setEdificiosReport] = useState(null);
    const [quartosReport, setQuartosReport] = useState(null);
    const [camasReport, setCamasReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const chartRefs = {
        candidaturas: useRef(null),
        edificios: useRef(null),
    };

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const candidaturasData = await AuthService.authenticatedRequest('get', 'candidaturas', '/estado/');
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

    const exportPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        let yPosition = 20;
        const margin = 15;
        const sectionSpacing = 20; // Aumentei o espaçamento geral

        pdf.setFontSize(18);
        pdf.text('Relatório Geral', margin, yPosition);
        yPosition += sectionSpacing;

        // Função auxiliar para adicionar título e verificar dados antes de adicionar a tabela
        const addTableReport = (title, headers, data, y) => {
            pdf.setFontSize(16);
            pdf.text(title, margin, y);
            let currentY = y + 10;
            if (data && data.length > 0) {
                pdf.setFontSize(12);
                autoTable(pdf, {
                    startY: currentY,
                    head: [headers],
                    body: [data],
                    margin: { left: margin, right: margin },
                });
                return pdf.previousAutoTable ? pdf.previousAutoTable.finalY + sectionSpacing : currentY + sectionSpacing;
            } else {
                pdf.setFontSize(12);
                pdf.text(`Dados de ${title.toLowerCase()} não disponíveis.`, margin, currentY);
                return currentY + sectionSpacing;
            }
        };

        // Relatório de Residentes
        yPosition = addTableReport('Relatório de Residentes', ['Total de Residentes'], residentesReport?.totalResidentes !== undefined ? [residentesReport.totalResidentes] : [], yPosition);

        // Relatório de Quartos
        yPosition = addTableReport('Relatório de Quartos', ['Total de Quartos', 'Quartos Livres', 'Quartos Ocupados'], quartosReport ? [quartosReport.totalQuartos, quartosReport.quartosLivres, quartosReport.quartosOcupados] : [], yPosition);

        // Relatório de Camas
        yPosition = addTableReport('Relatório de Camas', ['Total de Camas', 'Camas Livres', 'Camas Ocupadas'], camasReport ? [camasReport.totalCamas, camasReport.camasLivres, camasReport.camasOcupadas] : [], yPosition);

        // Relatório de Candidaturas (Gráfico como imagem)
        if (candidaturasReport?.statusCounts && chartRefs.candidaturas.current) {
            pdf.setFontSize(16);
            pdf.text('Relatório de Candidaturas', margin, yPosition);
            yPosition += 10;
            const canvas = await html2canvas(chartRefs.candidaturas.current);
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const availableWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
            const imgHeight = (imgProps.height * availableWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', margin, yPosition, availableWidth, imgHeight * 0.85); // Aumentei um pouco mais a altura
            yPosition += imgHeight * 0.85 + sectionSpacing;
        } else {
            pdf.setFontSize(12);
            pdf.text('Dados de candidaturas não disponíveis.', margin, yPosition);
            yPosition += sectionSpacing;
        }

        // Relatório de Edifícios (Gráfico como imagem)
        if (edificiosReport?.totalPorTipo && chartRefs.edificios.current) {
            pdf.setFontSize(16);
            pdf.text('Relatório de Edifícios', margin, yPosition);
            yPosition += 10;
            const canvas = await html2canvas(chartRefs.edificios.current);
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const availableWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
            const imgHeight = (imgProps.height * availableWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', margin, yPosition, availableWidth * 0.75, imgHeight * 0.75); // Aumentei um pouco mais a largura e altura
            yPosition += imgHeight * 0.75 + sectionSpacing;
        } else {
            pdf.setFontSize(12);
            pdf.text('Dados de edifícios não disponíveis.', margin, yPosition);
        }

        pdf.save('relatorio.pdf');
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

            <div>
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
                            <div ref={chartRefs.candidaturas}>
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
                            </div>
                        </Paper>

                        {/* Edifícios */}
                        <Paper className="p-4 shadow rounded-lg">
                            <Typography variant="h6" className="font-semibold mb-2">Relatório de Edifícios</Typography>
                            <div ref={chartRefs.edificios}>
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
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default Reports;