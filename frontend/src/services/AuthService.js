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

// Helpers de token usando cookies
const getCookie = (name) => {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let c of cookies) {
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(name + "=") === 0) return c.substring(name.length + 1);
    }
    return null;
};

const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Strict`;
};

// Token functions
const getToken = () => getCookie("access_token");
const getRefreshToken = () => getCookie("refresh_token");
const setToken = (token) => setCookie("access_token", token, 1 / 24); // 1h
const setRefreshToken = (token) => setCookie("refresh_token", token, 7);
const clearToken = () => deleteCookie("access_token");
const clearRefreshToken = () => deleteCookie("refresh_token");

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
        const { requires_2fa, access_token, refresh_token } = response.data;

        if (refresh_token) setRefreshToken(refresh_token);
        return { requires_2fa: !!requires_2fa, access_token };
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
        const { access, refresh } = response.data;
        if (access && refresh) {
            setToken(access);
            setRefreshToken(refresh);
        }
        return response.data;
    },

    authenticatedRequest: async (method, baseURLType, url, data = null) => {
        let apiInstance = apiAccounts;
        if (baseURLType === "relatorios") apiInstance = apiRelatorios;
        else if (baseURLType === "candidaturas") apiInstance = apiCandidaturas;

        return await apiInstance({ method, url, data });
    },
};

export default AuthService;
