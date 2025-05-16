import axios from 'axios';

// URLs base da API
const API_URL_ACCOUNTS = 'http://127.0.0.1:8000/api/accounts';
const API_URL_RELATORIOS = 'http://127.0.0.1:8000/api/relatorios';
const API_URL_CANDIDATURAS = 'http://127.0.0.1:8000/api/candidaturas'; // Adicione a URL base para candidaturas

// Instâncias Axios
const apiAccounts = axios.create({
    baseURL: API_URL_ACCOUNTS,
    headers: { 'Content-Type': 'application/json' },
});

const apiRelatorios = axios.create({
    baseURL: API_URL_RELATORIOS,
    headers: { 'Content-Type': 'application/json' },
});

const apiCandidaturas = axios.create({ // Crie uma instância para o app candidaturas
    baseURL: API_URL_CANDIDATURAS,
    headers: { 'Content-Type': 'application/json' },
});

// Helpers de token

const getToken = () => {
    // Tenta pegar o token do cookie
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    if (match) {
        return match[2];
    }

    // Caso o token não esteja no cookie, tenta pegar do localStorage
    const token = localStorage.getItem('access_token');
    return token;
};


const getRefreshToken = () => localStorage.getItem('refresh_token');

const setToken = (token) => {

    localStorage.setItem('access_token', token); // Salva no localStorage
    document.cookie = `access_token=${token}; path=/; secure; SameSite=Strict`; // Salva no cookie
};



const setRefreshToken = (token) => localStorage.setItem('refresh_token', token);

const clearToken = () => localStorage.removeItem('access_token');
const clearRefreshToken = () => localStorage.removeItem('refresh_token');

const logout = () => {
    clearToken();
    clearRefreshToken();
    window.location.href = '/login';
};

const refreshToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
        throw new Error('Nenhum refresh token disponível.');
    }

    try {
        const response = await apiAccounts.post('/token/refresh/', { refresh });
        const { access } = response.data;
        setToken(access);
        return access;
    } catch (error) {
        clearToken();
        clearRefreshToken();
        throw error;
    }
};

// Interceptores para incluir token nas requisições
[apiAccounts, apiRelatorios, apiCandidaturas].forEach(api => { // Inclua apiCandidaturas nos interceptores
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
});

// Interceptor para renovar token automaticamente
apiAccounts.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiAccounts(originalRequest);
            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Serviço principal
const AuthService = {
    login: async (credenciais) => {
        try {
            const response = await apiAccounts.post('/login/', credenciais);
            const { access, refresh, requires_2fa } = response.data;

            if (access) setToken(access);
            if (refresh) setRefreshToken(refresh);

            return { requires_2fa: !!requires_2fa, ...response.data };
        } catch (error) {
            console.error('Erro no login:', error.response?.data || error);
            throw error;
        }
    },

    register: async (dadosUtilizador) => {
        try {
            const response = await apiAccounts.post('/register/', dadosUtilizador);
            return response.data;
        } catch (error) {
            console.error('Erro no registro:', error.response?.data || error);
            throw error;
        }
    },

    logout,

    generate2FA: async () => {
        const token = getToken();


        if (!token) {
            throw new Error("Token de acesso não encontrado");
        }

        try {
            const response = await apiAccounts.post(
                '/generate-2fa/',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao gerar 2FA:", error.response?.data || error);
            throw error;
        }
    },


    verify2FA: async ({ otp_token }) => {
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await apiAccounts.post(
                "/verify-2fa/",
                { otp_token }, // <- chave correta
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    },


    authenticatedRequest: async (method, baseURLType, url, data = null) => {
        let apiInstance;
        if (baseURLType === 'relatorios') {
            apiInstance = apiRelatorios;
        } else if (baseURLType === 'candidaturas') {
            apiInstance = apiCandidaturas;
        } else {
            apiInstance = apiAccounts; // Default para accounts
        }
        try {
            const response = await apiInstance({ method, url, data });
            return response;
        } catch (error) {
            console.error("Erro na requisição autenticada:", error.response?.data || error);
            throw error;
        }
    },

    // Exporta helpers
    getToken,
    setToken,
    clearToken,
};

export default AuthService;