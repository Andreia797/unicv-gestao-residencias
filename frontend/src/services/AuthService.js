import axios from 'axios';

const API_URL_ACCOUNTS = 'http://127.0.0.1:8000/api/accounts';
const API_URL_RELATORIOS = 'http://127.0.0.1:8000/api/relatorios';
const API_URL_CORE = 'http://127.0.0.1:8000/api/core'; 

const apiAccounts = axios.create({
    baseURL: API_URL_ACCOUNTS,
});

const apiRelatorios = axios.create({
    baseURL: API_URL_RELATORIOS,
});

const apiCore = axios.create({
    baseURL: API_URL_CORE,
});

const authHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AuthService = {
    login: async (credenciais) => {
        try {
            const response = await apiAccounts.post('/login/', credenciais);
            const data = response.data;
            if (data && data.access) {
                localStorage.setItem('access_token', data.access);
            }
            return data;
        } catch (error) {
            console.error('Erro ao efetuar login:', error);
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
    },

    register: async (dadosUtilizador) => {
        try {
            const response = await apiAccounts.post('/register/', dadosUtilizador);
            return response.data;
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
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
    },

    getToken: () => {
        return localStorage.getItem('access_token');
    },

    setToken: (token) => {
        localStorage.setItem('access_token', token);
    },

    logout: () => {
        localStorage.removeItem('access_token');
    },

    // Função genérica para requisições autenticadas
    authenticatedRequest: async (method, baseURLType, url, data = null) => {
        let apiInstance;
        switch (baseURLType) {
            case 'accounts':
                apiInstance = apiAccounts;
                break;
            case 'relatorios':
                apiInstance = apiRelatorios;
                break;
            case 'core':
                apiInstance = apiCore;
                break;
            default:
                console.error('Tipo de URL base inválido');
                throw new Error('Tipo de URL base inválido');
        }

        try {
            const response = await apiInstance({
                method,
                url,
                data,
                headers: authHeader(),
            });
            return response;
        } catch (error) {
            console.error(`Erro na requisição autenticada para ${baseURLType} ${url}:`, error);
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
    },

    // Métodos específicos para acessar diferentes partes da API (usando authenticatedRequest)
    fetchUsers: async () => {
        return AuthService.authenticatedRequest('GET', 'accounts', '/users/');
    },

    fetchCamas: async () => {
        return AuthService.authenticatedRequest('GET', 'relatorios', '/camas/');
    },

    fetchCandidaturas: async () => {
        return AuthService.authenticatedRequest('GET', 'relatorios', '/candidaturas/');
    },

    fetchEdificios: async () => {
        return AuthService.authenticatedRequest('GET', 'relatorios', '/edificios/');
    },

    fetchQuartos: async () => {
        return AuthService.authenticatedRequest('GET', 'relatorios', '/quartos/');
    },

    fetchResidentes: async () => {
        return AuthService.authenticatedRequest('GET', 'relatorios', '/residentes/edificio/'); 
    },

    fetchCandidaturasEstado: async () => {
        return AuthService.authenticatedRequest('GET', 'relatorios', '/candidaturas/estado/');
    },

   
};

export default AuthService;