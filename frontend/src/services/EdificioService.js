import AuthService from './AuthService';

const EdificioService = {
    getEdificios: async () => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', '/edificios/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar edifícios:', error);
            throw error;
        }
    },

    getEdificio: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', `/edificios/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar edifício com ID ${id}:`, error);
            throw error;
        }
    },

    criarEdificio: async (edificio) => {
        try {
            const response = await AuthService.authenticatedRequest('POST', 'relatorios', '/edificios/', edificio);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar edifício:', error);
            throw error;
        }
    },

    atualizarEdificio: async (id, edificio) => {
        try {
            const response = await AuthService.authenticatedRequest('PUT', 'relatorios', `/edificios/${id}/`, edificio);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar edifício:', error);
            throw error;
        }
    },

    excluirEdificio: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('DELETE', 'relatorios', `/edificios/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir edifício:', error);
            throw error;
        }
    },

    getEdificiosPorTipo: async (tipo) => {
        try {
            const response = await AuthService.authenticatedRequest('GET', 'relatorios', `/edificios/tipo/?tipo=${tipo}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar edifícios do tipo ${tipo}:`, error);
            throw error;
        }
    },
};

export default EdificioService;