import AuthService from './AuthService';

const API_URL = '/residentes/';

const ResidenteService = {
    getResidentes: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar residentes:', error);
            throw error;
        }
    },

    getResidente: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `${API_URL}${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar residente com ID ${id}:`, error);
            throw error;
        }
    },

    criarResidente: async (residente) => {
        try {
            const response = await AuthService.authenticatedRequest('post', 'relatorios', `${API_URL}`, residente);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar residente:', error);
            throw error;
        }
    },

    atualizarResidente: async (id, residente) => {
        try {
            const response = await AuthService.authenticatedRequest('put', 'relatorios', `${API_URL}${id}/`, residente);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar residente:', error);
            throw error;
        }
    },

    excluirResidente: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('delete', 'relatorios', `${API_URL}${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir residente:', error);
            throw error;
        }
    },

    getResidentesPorQuarto: async (quartoId) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/quarto/${quartoId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar residentes para o quarto ${quartoId}:`, error);
            throw error;
        }
    },
};

export default ResidenteService;