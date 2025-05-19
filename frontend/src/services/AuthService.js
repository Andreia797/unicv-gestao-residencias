// services/AuthService.js
import axios from "axios";

// URLs base da API
const API_URL_ACCOUNTS = "http://127.0.0.1:8000/api/accounts";
const API_URL_RELATORIOS = "http://127.0.0.1:8000/api/relatorios";
const API_URL_CANDIDATURAS = "http://127.0.0.1:8000/api/candidaturas";

// Instâncias Axios
const apiAccounts = axios.create({ baseURL: API_URL_ACCOUNTS });
const apiRelatorios = axios.create({ baseURL: API_URL_RELATORIOS });
const apiCandidaturas = axios.create({ baseURL: API_URL_CANDIDATURAS });

// Helpers de token usando localStorage (mais comum para SPAs)
const getToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");
const setToken = (token) => localStorage.setItem("access_token", token);
const setRefreshToken = (token) => localStorage.setItem("refresh_token", token);
const clearToken = () => localStorage.removeItem("access_token");
const clearRefreshToken = () => localStorage.removeItem("refresh_token");

const logout = () => {
    clearToken();
    clearRefreshToken();
    window.location.href = "/login";
};

const refreshToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("Nenhum refresh token disponível.");
    try {
        const response = await apiAccounts.post("/token/refresh/", { refresh });
        const { access } = response.data;
        setToken(access);
        return access;
    } catch (error) {
        logout();
        throw error;
    }
};

// Adiciona interceptores para todas as instâncias
[apiAccounts, apiRelatorios, apiCandidaturas].forEach((api) => {
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );
});

// Renova token automaticamente em caso de 401
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
        const response = await apiAccounts.post("/login/", credenciais);
        const { requires_2fa, access_token, refresh_token, user } = response.data; // Adicionado 'user'

        if (access_token) setToken(access_token); // Salva access token
        if (refresh_token) setRefreshToken(refresh_token); // Salva refresh token
        return { requires_2fa: !!requires_2fa, access_token, user }; // Retorna 'user'
    },

    register: async (dadosUtilizador) => {
        const response = await apiAccounts.post("/register/", dadosUtilizador);
        return response.data;
    },

    logout,
    getToken,
    setToken,
    setRefreshToken,
    clearToken,
    clearRefreshToken,

    generate2FA: async (tempAccessToken) => {
        const response = await apiAccounts.post(
            "/2fa/generate/",
            {},
            { headers: { Authorization: `Bearer ${tempAccessToken}` } }
        );
        return response.data;
    },

    verify2FA: async ({ otp_token }, tempAccessToken) => {
        const response = await apiAccounts.post(
            "/login/verify-2fa/",
            { otp_token },
            { headers: { Authorization: `Bearer ${tempAccessToken}` } }
        );
        const { access, refresh, user } = response.data; // Adicionado 'user'
        if (access) setToken(access);
        if (refresh) setRefreshToken(refresh);
        return { access, refresh, user }; // Retorna 'user'
    },

    getEstadoCandidatura: async () => {
        return await AuthService.authenticatedRequest("get", "candidaturas", "/estado/");
    },

    authenticatedRequest: async (method, baseURLType, url, data = null) => {
        let apiInstance = apiAccounts;
        if (baseURLType === "relatorios") apiInstance = apiRelatorios;
        else if (baseURLType === "candidaturas") apiInstance = apiCandidaturas;

        return await apiInstance({ method, url, data });
    },

    async listarTodosQuartosAdmin() {
    return this.authenticatedRequest('get', 'candidaturas', 'quartos/');
  },

  async editarQuarto(id, data) {
    return this.authenticatedRequest('put', 'candidaturas', `quartos/${id}/`, data);
  },

  async excluirQuarto(id) {
    return this.authenticatedRequest('delete', 'candidaturas', `quartos/${id}/`);
  },

  async alterarDisponibilidadeQuarto(id) {
    return this.authenticatedRequest('patch', 'candidaturas', `quartos/${id}/disponibilidade/`);
  },

async obterDetalhesQuarto(id) {
    return this.authenticatedRequest('get', 'candidaturas', `quartos/${id}/`);
  },

  async adicionarQuarto(data) {
    return this.authenticatedRequest('post', 'candidaturas', 'quartos/', data);
  },

};

export default AuthService;