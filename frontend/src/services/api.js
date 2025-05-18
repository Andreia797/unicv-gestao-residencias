import axios from 'axios';
import AuthService from '../services/AuthService';

const apiRelatorios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/relatorios',
});

const apiCandidaturas = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/candidaturas',
});

const getAuthHeader = () => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- CAMAS ---
export const fetchCamas = async () => {
    try {
        const response = await apiRelatorios.get('/camas/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar camas:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCamasPorQuarto = async (quartoId) => {
    try {
        const response = await apiRelatorios.get(`/camas/quarto/${quartoId}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar camas do quarto ${quartoId}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCamasPorStatus = async (status) => {
    try {
        const response = await apiRelatorios.get(`/camas/status/${status}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar camas com status ${status}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

// --- EDIFÍCIOS ---
export const fetchEdificios = async () => {
    try {
        const response = await apiRelatorios.get('/edificios/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar edificios:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchEdificiosPorTipo = async (tipo) => {
    try {
        const response = await apiRelatorios.get(`/edificios/tipo/${tipo}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar edifícios do tipo ${tipo}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

// --- QUARTOS ---
export const fetchQuartos = async () => {
    try {
        const response = await apiRelatorios.get('/quartos/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchQuartosPorEdificio = async (edificioId) => {
    try {
        const response = await apiRelatorios.get(`/quartos/edificio/${edificioId}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar quartos do edifício ${edificioId}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchQuartosPorTipo = async (tipo) => {
    try {
        const response = await apiRelatorios.get(`/quartos/tipo/${tipo}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar quartos do tipo ${tipo}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

// --- RESIDENTES ---
export const fetchResidentes = async () => {
    try {
        const response = await apiRelatorios.get('/residentes/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar residentes:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchResidentesPorQuarto = async (quartoId) => {
    try {
        const response = await apiRelatorios.get(`/residentes/quarto/${quartoId}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar residentes do quarto ${quartoId}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchResidentesPorEdificio = async (edificioId) => {
    try {
        const response = await apiRelatorios.get(`/residentes/edificio/${edificioId}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar residentes do edifício ${edificioId}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchTotalResidentes = async () => {
    try {
        const response = await apiRelatorios.get('/residentes/total/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar total de residentes:', error);
        logErrorDetails(error);
        throw error;
    }
};

// --- CANDIDATURAS ---
export const fetchCandidaturas = async () => {
    try {
        const response = await apiCandidaturas.get('/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar candidaturas:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCandidaturaDetalhe = async (id) => {
    try {
        const response = await apiCandidaturas.get(`/${id}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar detalhes da candidatura ${id}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCandidaturasPorResidencia = async (residenciaId) => {
    try {
        const response = await apiCandidaturas.get(`/residencia/${residenciaId}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar candidaturas da residência ${residenciaId}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCandidaturasPorEstudante = async (estudanteId) => {
    try {
        const response = await apiCandidaturas.get(`/estudante/${estudanteId}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar candidaturas do estudante ${estudanteId}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCandidaturasPorEstado = async () => {
    try {
        const response = await apiCandidaturas.get('/estado/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar candidaturas por estado:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchListarCandidaturasCBV = async () => {
    try {
        const response = await apiCandidaturas.get('/listar/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar candidaturas (CBV):', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchAtualizarEstadoCandidatura = async (id) => {
    try {
        const response = await apiCandidaturas.get(`/atualizar/${id}/`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar o estado da candidatura ${id}:`, error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchMinhaCandidaturaCBV = async () => {
    try {
        const response = await apiCandidaturas.get('/minha/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar minha candidatura (CBV):', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchListaVagas = async () => {
    try {
        const response = await apiCandidaturas.get('/vagas/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        logErrorDetails(error);
        throw error;
    }
};

// --- LOG DE ERROS ---
const logErrorDetails = (error) => {
    if (error.response) {
        console.error('Dados do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
    } else if (error.request) {
        console.error('Nenhuma resposta recebida:', error.request);
    } else {
        console.error('Erro ao configurar a requisição:', error.message);
    }
};