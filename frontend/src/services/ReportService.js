import AuthService from './AuthService';


const ReportService = {
    getCandidaturasPorEstado: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/candidaturas/estado/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar candidaturas por estado:', error);
            throw error;
        }
    },

    getResidentesPorEdificio: async () => {
        try {
            const response = await AuthService.authenticatedRequest('get', 'relatorios', `/residentes/edificio/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar residentes por edifício:', error);
            throw error;
        }
    },
   
};

export default ReportService;