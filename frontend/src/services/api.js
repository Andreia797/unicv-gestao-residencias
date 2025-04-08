import axios from 'axios';
import AuthService from '../services/AuthService'; // Importe o AuthService para obter o token

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/relatorios', // Ajuste a URL base para /api/relatorios
});

// Função para obter o token de autenticação
const getAuthHeader = () => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCamas = async () => {
    try {
        const response = await api.get('/camas/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar camas:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        throw error;
    }
};

export const fetchCandidaturas = async () => {
    try {
        const response = await api.get('/candidaturas/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar candidaturas:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        throw error;
    }
};

export const fetchEdificios = async () => {
    try {
        const response = await api.get('/edificios/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar edificios:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        throw error;
    }
};

export const fetchQuartos = async () => {
    try {
        const response = await api.get('/quartos/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        throw error;
    }
};

export const fetchResidentes = async () => {
    try {
        const response = await api.get('/residentes/edificio/', { headers: getAuthHeader() }); // Rota específica para listagem por edifício, conforme seu urls.py
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar residentes por edifício:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        throw error;
    }
};

export const fetchCandidaturasEstado = async () => {
    try {
        const response = await api.get('/candidaturas/estado/', { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar candidaturas por estado:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        throw error;
    }
};