import AuthService from './AuthService';

const API_URL = '/users/';

const UserService = {
    // Função para buscar todos os utilizadores
    getUtilizadores: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'accounts', API_URL);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
            throw error;
        }
    },

    // Função para buscar um utilizador específico pelo ID
    getUtilizador: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'accounts', `${API_URL}${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar utilizador com ID ${id}:`, error);
            throw error;
        }
    },

    // Função para criar um novo utilizador
    criarUtilizador: async (utilizador) => {
        try {
            const response = await AuthService.authenticatedRequest('post', 'accounts', API_URL, utilizador);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            throw error;
        }
    },

    // Função para atualizar um utilizador existente
    atualizarUtilizador: async (id, utilizador) => {
        try {
            const response = await AuthService.authenticatedRequest('put', 'accounts', `${API_URL}${id}/`, utilizador);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar utilizador:', error);
            throw error;
        }
    },

    // Função para excluir um utilizador
    excluirUtilizador: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('delete', 'accounts', `${API_URL}${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir utilizador:', error);
            throw error;
        }
    },
};

export default UserService;