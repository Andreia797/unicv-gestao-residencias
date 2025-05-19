import AuthService from './AuthService';

const CandidaturaService = {
    getCandidaturas: async () => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base
            const response = await AuthService.authenticatedRequest('GET', 'candidaturas', '/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar candidaturas:', error);
            throw error;
        }
    },

    getCandidatura: async (id) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota com o ID
            const response = await AuthService.authenticatedRequest('GET', 'candidaturas', `/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar candidatura com ID ${id}:`, error);
            throw error;
        }
    },

    criarCandidatura: async (candidatura) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base
            const response = await AuthService.authenticatedRequest('POST', 'candidaturas', '/');
            return response.data;
        } catch (error) {
            console.error('Erro ao criar candidatura:', error);
            throw error;
        }
    },

    atualizarCandidatura: async (id, candidatura) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota com o ID
            const response = await AuthService.authenticatedRequest('PUT', 'candidaturas', `/${id}/`, candidatura);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar candidatura:', error);
            throw error;
        }
    },

    excluirCandidatura: async (id) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota com o ID
            const response = await AuthService.authenticatedRequest('DELETE', 'candidaturas', `/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir candidatura:', error);
            throw error;
        }
    },

    getCandidaturasPorResidencia: async (residenciaId) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota específica
            const response = await AuthService.authenticatedRequest('GET', 'candidaturas', `/residencia/${residenciaId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar candidaturas para residência ${residenciaId}:`, error);
            throw error;
        }
    },

    getCandidaturasPorEstudante: async (estudanteId) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota específica
            const response = await AuthService.authenticatedRequest('GET', 'candidaturas', `/estudante/${estudanteId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar candidaturas para estudante ${estudanteId}:`, error);
            throw error;
        }
    },

    atualizarEstadoCandidatura: async (id, status) => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota específica
            const response = await AuthService.authenticatedRequest('PUT', 'candidaturas', `/atualizar/${id}/`, { status });
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar o estado da candidatura ${id}:`, error);
            throw error;
        }
    },

    getMinhaCandidatura: async () => {
        try {
            // Corrigido para usar o tipo 'candidaturas' na URL base e a rota específica
            const response = await AuthService.authenticatedRequest('GET', 'candidaturas', '/minha/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar a minha candidatura:', error);
            throw error;
        }
    },

    getVagas: async () => {
    try {
        const response = await AuthService.authenticatedRequest('GET', 'candidaturas', 'vagas/');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        throw error;
    }
},

};


export default CandidaturaService;