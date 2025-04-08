import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://127.0.0.1:8000/api/relatorios/edificios/';

const EdificioService = {
    getEdificios: async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar edifícios:', error);
            throw error;
        }
    },

    getEdificio: async (id) => {
        try {
            const response = await axios.get(`${API_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar edifício com ID ${id}:`, error);
            throw error;
        }
    },

    criarEdificio: async (edificio) => {
        try {
            const response = await axios.post(API_URL, edificio, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar edifício:', error);
            throw error;
        }
    },

    atualizarEdificio: async (id, edificio) => {
        try {
            const response = await axios.put(`${API_URL}${id}/`, edificio, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar edifício:', error);
            throw error;
        }
    },

    excluirEdificio: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir edifício:', error);
            throw error;
        }
    }
};

export default EdificioService;