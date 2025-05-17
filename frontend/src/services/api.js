import axios from 'axios';
import AuthService from '../services/AuthService';

const apiRelatorios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/relatorios',
});

const apiCandidaturas = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/candidaturas',
});

// Função para obter o token de autenticação
const getAuthHeader = () => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const fetchResidentes = async () => {
    try {
        // A rota no seu urls.py é '/residentes/edificio/', mas a função se chama fetchResidentes (genérico).
        // Se você quer todos os residentes, a rota correta seria '/residentes/'.
        // Se você realmente quer apenas por edifício, mantenha como está.
        const response = await apiRelatorios.get('/residentes/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar residentes:', error);
        logErrorDetails(error);
        throw error;
    }
};

export const fetchCandidaturasEstado = async () => {
    try {
        const response = await apiCandidaturas.get('/estado/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar candidaturas por estado:', error);
        logErrorDetails(error);
        throw error;
    }
};

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