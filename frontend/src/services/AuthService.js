import axios from 'axios';

// URLs base da API
const API_URL_ACCOUNTS = 'http://127.0.0.1:8000/api/accounts';
const API_URL_RELATORIOS = 'http://127.0.0.1:8000/api/relatorios';

// Instâncias Axios com baseURL e credenciais
const apiAccounts = axios.create({
  baseURL: API_URL_ACCOUNTS,
  headers: { 'Content-Type': 'application/json' },
});

const apiRelatorios = axios.create({
  baseURL: API_URL_RELATORIOS,
  headers: { 'Content-Type': 'application/json' },
});

// LocalStorage helpers
const getToken = () => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  return match ? match[2] : null;
};

const getRefreshToken = () => localStorage.getItem('refresh_token');

const setToken = (token) => {
  localStorage.setItem('access_token', token);
  // Optional: Set the token as a cookie for additional security (httpOnly flag is advised in production)
  document.cookie = `access_token=${token}; path=/; secure; SameSite=Strict`;
};

const setRefreshToken = (token) => localStorage.setItem('refresh_token', token);

const clearToken = () => {
  localStorage.removeItem('access_token');
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Clear cookie as well
};

const clearRefreshToken = () => localStorage.removeItem('refresh_token');

// Renova token se possível
const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (refresh) {
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
  } else {
    clearToken();
    throw new Error('Nenhum refresh token disponível.');
  }
};

// Interceptores para incluir o token em todas as requisições
[apiAccounts, apiRelatorios].forEach(api => {
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

// Interceptor de resposta para renovar token automaticamente
apiAccounts.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("Token enviado:", newAccessToken);
        return apiAccounts(originalRequest);
      } catch (refreshError) {
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Serviço de autenticação principal
const AuthService = {
 login: async (credenciais) => {
  try {
    const response = await apiAccounts.post('/login/', credenciais);
    const { access, refresh, requires_2fa } = response.data;

    if (access) {
      setToken(access);
      console.log("Token de acesso armazenado:", access);  // Verifique se o token está sendo salvo
    }
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

  logout: () => {
    clearToken();
    clearRefreshToken();
    window.location.href = '/login'; // Redireciona para a tela de login
  },

 generate2FA: async () => {
  try {
    const token = getToken(); // Verifique o token antes de enviar
    console.log("Token enviado para /generate-2fa:", token);  // Verifique se o token está sendo enviado
    const response = await apiAccounts.post('/generate-2fa/');
    return response.data;
  } catch (error) {
    console.error("Erro ao gerar 2FA:", error.response?.data || error);
    throw error;
  }
},

  verify2FA: async (token) => {
    try {
      const response = await apiAccounts.post('/verify-2fa/', { token });
      return response.data;
    } catch (error) {
      console.error("Erro ao verificar 2FA:", error.response?.data || error);
      throw error;
    }
  },

  authenticatedRequest: async (method, baseURLType, url, data = null) => {
    let apiInstance = baseURLType === 'relatorios' ? apiRelatorios : apiAccounts;
    try {
      const response = await apiInstance({ method, url, data });
      return response;
    } catch (error) {
      console.error("Erro na requisição autenticada:", error.response?.data || error);
      throw error;
    }
  },

  // Métodos auxiliares
  getToken,
  setToken,
  clearToken,
};

export default AuthService;
