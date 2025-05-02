import axios from 'axios';

// Definindo a baseURL para as APIs
const API_URL_ACCOUNTS = 'http://127.0.0.1:8000/api/accounts';
const API_URL_RELATORIOS = 'http://127.0.0.1:8000/api/relatorios';

const apiAccounts = axios.create({
  baseURL: API_URL_ACCOUNTS,
  withCredentials: true // Para garantir o envio de cookies, se necessário
});

const apiRelatorios = axios.create({
  baseURL: API_URL_RELATORIOS,
  withCredentials: true // Para garantir o envio de cookies, se necessário
});

// Funções auxiliares para acessar e manipular os tokens (agora com cookies)
const getAccessToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
};

const getRefreshToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)refresh_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
};

const setAccessToken = (token) => {
  document.cookie = `access_token=${token}; path=/; secure; HttpOnly`;
};

const setRefreshToken = (token) => {
  document.cookie = `refresh_token=${token}; path=/; secure; HttpOnly`;
};

const removeAccessToken = () => {
  document.cookie = "access_token=; Max-Age=0; path=/; secure; HttpOnly";
};

const removeRefreshToken = () => {
  document.cookie = "refresh_token=; Max-Age=0; path=/; secure; HttpOnly";
};

// Função para renovar o token de acesso
const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (refresh) {
    try {
      const response = await apiAccounts.post('/token/refresh/', { refresh });
      const { access } = response.data;
      setAccessToken(access);
      return access;
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      removeAccessToken();
      removeRefreshToken();
      throw error;
    }
  } else {
    console.error('Nenhum refresh token disponível.');
    removeAccessToken();
    throw new Error('Nenhum refresh token disponível.');
  }
};

// Interceptor para adicionar o token de acesso nas requisições da API de Contas
apiAccounts.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para adicionar o token de acesso nas requisições da API de Relatórios
apiRelatorios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com erros de token expirado na API de Contas
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
        console.error('Erro ao tentar renovar o token:', refreshError);
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Função principal de login
const AuthService = {
  login: async (credenciais) => {
    try {
      const response = await apiAccounts.post('/login/', credenciais);
      const { access, refresh, requires_2fa } = response.data;
      if (access) {
        setAccessToken(access);
      }
      if (refresh) {
        setRefreshToken(refresh);
      }

      if (requires_2fa) {
        return { requires_2fa: true };
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao efetuar login:', error);
      throw error;
    }
  },

  register: async (dadosUtilizador) => {
    try {
      const response = await apiAccounts.post('/register/', dadosUtilizador);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  // Logout e remoção dos tokens
  logout: () => {
    removeAccessToken();
    removeRefreshToken();
    window.location.href = '/login';  // Redirecionamento após logout
  },

  // Função para gerar o código 2FA
  generate2FA: async () => {
    try {
      const response = await apiAccounts.post('/generate-2fa/', {}, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar 2FA:', error);
      throw error;
    }
  },

  // Função para verificar o código 2FA
  verify2FA: async (token) => {
    try {
      const response = await apiAccounts.post('/verify-2fa/', { token }, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar 2FA:', error);
      throw error;
    }
  },

  // Função genérica para requisições autenticadas
  authenticatedRequest: async (method, baseURLType, url, data = null) => {
    let apiInstance;
    switch (baseURLType) {
      case 'accounts':
        apiInstance = apiAccounts;
        break;
      case 'relatorios':
        apiInstance = apiRelatorios;
        break;
      default:
        console.error('Tipo de URL base inválido:', baseURLType);
        throw new Error(`Tipo de URL base inválido: ${baseURLType}`);
    }

    try {
      const response = await apiInstance({
        method,
        url,
        data,
      });
      return response;
    } catch (error) {
      console.error(`Erro na requisição autenticada para ${baseURLType} ${url}:`, error);
      throw error;
    }
  },
};

export default AuthService;
