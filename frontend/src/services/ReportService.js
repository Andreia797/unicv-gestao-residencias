import AuthService from './AuthService';

const ReportService = {
    getCandidaturasPorEstado: async () => {
        try {
            // Corrigido: 'candidaturas' e a rota correta
            const response = await AuthService.authenticatedRequest('get', 'candidaturas', '/estado/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar candidaturas por estado:', error);
            throw error;
        }
    },

 
getResidentesPorEdificio: async (edificioId) => {
    try {
        const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/edificio/?edificio_id=${edificioId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar residentes por edifício:', error);
        throw error;
    }
},

    getListaResidentes: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/residentes/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista de residentes:', error);
            throw error;
        }
    },

    getDetalheResidente: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes do residente ${id}:`, error);
            throw error;
        }
    },

    getResidentesPorQuarto: async (quartoId) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/quarto/${quartoId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar residentes no quarto ${quartoId}:`, error);
            throw error;
        }
    },

    getTotalResidentes: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/residentes/total/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar o total de residentes:', error);
            throw error;
        }
    },

    getListaEdificios: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/edificios/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista de edifícios:', error);
            throw error;
        }
    },

    getDetalheEdificio: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/edificios/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes do edifício ${id}:`, error);
            throw error;
        }
    },

    getEdificiosPorTipo: async (tipo) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/edificios/tipo/${tipo}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar edifícios do tipo ${tipo}:`, error);
            throw error;
        }
    },

    getListaQuartos: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/quartos/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista de quartos:', error);
            throw error;
        }
    },

    getDetalheQuarto: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/quartos/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes do quarto ${id}:`, error);
            throw error;
        }
    },

    getQuartosPorEdificio: async (edificioId) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/quartos/edificio/${edificioId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar quartos no edifício ${edificioId}:`, error);
            throw error;
        }
    },

    getQuartosPorTipo: async (tipo) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/quartos/tipo/${tipo}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar quartos do tipo ${tipo}:`, error);
            throw error;
        }
    },

    getRelatorioQuartos: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/quartos/relatorio/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar relatório de quartos:', error);
            throw error;
        }
    },

    getListaCamas: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/camas/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista de camas:', error);
            throw error;
        }
    },

    getDetalheCama: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/camas/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes da cama ${id}:`, error);
            throw error;
        }
    },

    getCamasPorQuarto: async (quartoId) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/camas/quarto/${quartoId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar camas no quarto ${quartoId}:`, error);
            throw error;
        }
    },

    getCamasPorStatus: async (status) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/camas/status/${status}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar camas com status ${status}:`, error);
            throw error;
        }
    },

    getRelatorioCamas: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/camas/relatorio/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar relatório de camas:', error);
            throw error;
        }
    },

    getListaResidencias: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', '/residencias/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista de residências:', error);
            throw error;
        }
    },

    getDetalheResidencia: async (id) => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residencias/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes da residência ${id}:`, error);
            throw error;
        }
    },
};

export default ReportService;