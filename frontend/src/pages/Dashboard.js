import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Legend, Bar
} from 'recharts';
import { Alert } from '@mui/material';
import ReportService from '../services/ReportService';
import AuthService from '../services/AuthService';
import { AuthContext } from '../components/AuthContext';

function Dashboard() {
    const [candidaturasPorEstado, setCandidaturasPorEstado] = useState([]);
    const [residentesPorEdificio, setResidentesPorEdificio] = useState([]);
    const [erroCandidaturas, setErroCandidaturas] = useState(null);
    const [erroResidentes, setErroResidentes] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!AuthService.getToken()) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            // Buscar candidaturas por estado
            try {
                const responseCandidaturas = await ReportService.getCandidaturasPorEstado();
                // A correção está aqui: acessar responseCandidaturas.statusCounts
                if (responseCandidaturas && Array.isArray(responseCandidaturas.statusCounts) && responseCandidaturas.statusCounts.length > 0) {
                    const formatted = responseCandidaturas.statusCounts.map(item => ({
                        estado: item.status, // A chave correta é 'status'
                        quantidadeDeCandidaturas: item.count, // A chave correta é 'count'
                    }));
                    setCandidaturasPorEstado(formatted);
                } else {
                    setErroCandidaturas('Dados de candidaturas por estado não disponíveis.');
                }
            } catch (error) {
                console.error('Erro ao buscar candidaturas por estado:', error);
                setErroCandidaturas('Erro ao buscar candidaturas por estado.');
            }

            // Buscar residentes por edifício (para o gráfico diretamente)
            try {
                const responseResidentes = await ReportService.getListaEdificios();
                if (Array.isArray(responseResidentes) && responseResidentes.length > 0) {
                    const residentesPorEdificioData = await Promise.all(
                        responseResidentes.map(async (edificio) => {
                            try {
                                const residentes = await ReportService.getResidentesPorEdificio(edificio.id);
                                return { nome_edificio: edificio.nome, total_residentes: Array.isArray(residentes) ? residentes.length : 0 };
                            } catch (error) {
                                console.error(`Erro ao buscar residentes para o edifício ${edificio.nome}:`, error);
                                return { nome_edificio: edificio.nome, total_residentes: 0 };
                            }
                        })
                    );
                    setResidentesPorEdificio(residentesPorEdificioData);
                    setErroResidentes(null);
                } else {
                    setErroResidentes('Dados de edifícios não disponíveis para o gráfico de residentes.');
                }
            } catch (error) {
                console.error('Erro ao buscar dados para o gráfico de residentes:', error);
                setErroResidentes('Erro ao buscar dados para o gráfico de residentes.');
            }
        };

        fetchData();
    }, [navigate]);

    if (!user) {
        return null;
    }

    const podeVerDashboard = user.groups?.includes("administrador") || user.groups?.includes("funcionario") || user.groups?.includes("estudante");

    if (!podeVerDashboard) {
        return (
            <div className="p-6">
                <Alert severity="warning">Você não tem permissão para visualizar o dashboard.</Alert>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Visão Geral da Gestão das Residências</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de Candidaturas */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Candidaturas por Estado</h3>
                    {erroCandidaturas && <Alert severity="error">{erroCandidaturas}</Alert>}
                    {candidaturasPorEstado.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={candidaturasPorEstado}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidadeDeCandidaturas" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        !erroCandidaturas && <p className="text-gray-600">Nenhum dado disponível.</p>
                    )}
                </div>

                {/* Gráfico de Residentes */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Residentes por Edifício</h3>
                    {erroResidentes && <Alert severity="error">{erroResidentes}</Alert>}
                    {residentesPorEdificio.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={residentesPorEdificio}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nome_edificio" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_residentes" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        !erroResidentes && <p className="text-gray-600">Nenhum dado disponível.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;