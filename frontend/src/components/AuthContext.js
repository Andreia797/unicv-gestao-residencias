import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ isAdmin: true }); // Estado inicial do usuário com isAdmin true (acesso total)
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Estado inicial como autenticado (acesso total)
  const [loading, setLoading] = useState(false); // Define loading como false inicialmente para acesso imediato
  const navigate = useNavigate();

  useEffect(() => {
    // Lógica de verificação de autenticação do backend COMENTADA para acesso total
    // const checkAuth = async () => {
    //   const token = AuthService.getToken();
    //   if (token) {
    //     try {
    //       const response = await AuthService.authenticatedRequest('get', '/users/me/');
    //       if (response.data) {
    //         setUser(response.data);
    //         setIsAuthenticated(true);
    //       } else {
    //         AuthService.removeToken();
    //         setUser(null);
    //         setIsAuthenticated(false);
    //       }
    //     } catch (error) {
    //       console.error('Erro ao verificar autenticação:', error);
    //       AuthService.removeToken();
    //       setUser(null);
    //       setIsAuthenticated(false);
    //     }
    //   }
    //   setLoading(false);
    // };

    setLoading(false); // Garante que o loading seja definido como false
    // checkAuth(); // Lógica de autenticação do backend COMENTADA
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    // Lógica de login real COMENTADA para acesso total
    // try {
    //   const response = await AuthService.login(credentials);
    //   if (response?.access_token) {
    //     AuthService.setToken(response.access_token);
    //     const userResponse = await AuthService.authenticatedRequest('get', '/users/me/');
    //     setUser(userResponse.data);
    //     setIsAuthenticated(true);
    //     navigate('/dashboard');
    //   } else {
    //     setIsAuthenticated(false);
    //     setUser(null);
    //     return { error: 'Credenciais inválidas.' };
    //   }
    //   return {};
    // } catch (error) {
    //   console.error('Erro ao fazer login:', error);
    //   setIsAuthenticated(false);
    //   setUser(null);
    //   return { error: error?.response?.data?.detail || 'Erro ao fazer login.' };
    // } finally {
    //   setLoading(false);
    // }

    // Simulação de login com acesso total
    setUser({ isAdmin: true }); // Define um usuário mockado com isAdmin true
    setIsAuthenticated(true);
    setLoading(false);
    navigate('/dashboard');
    return {};
  };

  const logout = () => {
    AuthService.removeToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await AuthService.register(userData);
      navigate('/login');
      return {};
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { error: error?.response?.data?.error || 'Erro ao registrar usuário.' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && <div className="flex justify-center items-center h-screen"><p>Carregando...</p></div>}
    </AuthContext.Provider>
  );
};