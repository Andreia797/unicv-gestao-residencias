import React, { useState, useEffect, useContext } from 'react';
import ReportService from '../services/ReportService';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { AuthContext } from '../components/AuthContext';
import { Alert } from '@mui/material';

function Dashboard() {
    const [candidaturasPorEstado, setCandidaturasPorEstado] = useState([]);
    const [residentesPorEdificio, setResidentesPorEdificio] = useState([]);
    const [erroCandidaturas, setErroCandidaturas] = useState(null);
    const [erroResidentes, setErroResidentes] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const candidaturasResponse = await ReportService.getCandidaturasPorEstado();
                if (candidaturasResponse && candidaturasResponse.statusCounts) {
                    const formattedCandidaturas = candidaturasResponse.statusCounts.map(item => ({
                        estado: item.status,
                        quantidadeDeCandidaturas: item.count,
                    }));
                    setCandidaturasPorEstado(formattedCandidaturas);
                } else {
                    setErroCandidaturas('Formato de dados de candidaturas inválido.');
                }
            } catch (error) {
                console.error('Erro ao buscar candidaturas por estado:', error);
                setErroCandidaturas('Erro ao buscar dados de candidaturas.');
            }

            try {
                const residentesResponse = await ReportService.getResidentesPorEdificio();
                const formattedResidentes = residentesResponse.map(item => ({
                    edificio: item.nome,
                    quantidadeDeResidentes: item.num_residentes,
                }));
                setResidentesPorEdificio(formattedResidentes);
            } catch (error) {
                console.error('Erro ao buscar residentes por edifício:', error);
                setErroResidentes('Erro ao buscar dados de residentes.');
            }
        };

        const checkAuthAndFetch = async () => {
            if (AuthService.getToken()) {
                await fetchData();
            } else {
                navigate('/login');
            }
        };

        checkAuthAndFetch();
    }, [navigate]);

    const podeVerDashboard = user?.groups?.includes("administrador") || user?.groups?.includes("funcionario");

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
                {/* Candidaturas por Estado */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Candidaturas por Estado</h3>
                    {erroCandidaturas && <Alert severity="error" className="mb-4">{erroCandidaturas}</Alert>}
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
                        <p className="text-gray-600">Não há dados de candidaturas disponíveis.</p>
                    )}
                </div>

                {/* Residentes por Edifício */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Residentes por Edifício</h3>
                    {erroResidentes && <Alert severity="error" className="mb-4">{erroResidentes}</Alert>}
                    {residentesPorEdificio.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={residentesPorEdificio}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="edificio" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidadeDeResidentes" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-600">Não há dados de residentes disponíveis.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;