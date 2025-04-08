import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://127.0.0.1:8000/api/relatorios/candidaturas/';

const CandidaturaService = {
    getCandidaturas: async () => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', '/candidaturas/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar candidaturas:', error);
            throw error;
        }
    },

    getCandidatura: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', `/candidaturas/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar candidatura com ID ${id}:`, error);
            throw error;
        }
    },

    criarCandidatura: async (candidatura) => {
        try {
            const response = await AuthService.authenticatedRequest('POST', 'relatorios', '/candidaturas/', candidatura);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar candidatura:', error);
            throw error;
        }
    },

    atualizarCandidatura: async (id, candidatura) => {
        try {
            const response = await AuthService.authenticatedRequest('PUT', 'relatorios', `/candidaturas/${id}/`, candidatura);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar candidatura:', error);
            throw error;
        }
    },

    excluirCandidatura: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('DELETE', 'relatorios', `/candidaturas/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir candidatura:', error);
            throw error;
        }
    },

    getCandidaturasPorResidencia: async (residenciaId) => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', `/candidaturas/residencia/${residenciaId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar candidaturas para residência ${residenciaId}:`, error);
            throw error;
        }
    },

    getCandidaturasPorEstudante: async (estudanteId) => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', `/candidaturas/estudante/${estudanteId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar candidaturas para estudante ${estudanteId}:`, error);
            throw error;
        }
    },
};

export default CandidaturaService;