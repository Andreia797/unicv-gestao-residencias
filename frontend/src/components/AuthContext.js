import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = AuthService.getToken();
            if (token) {
                try {
                    const decodedToken = jwtDecode(token); // Use jwtDecode
                    setUser(decodedToken);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Erro ao decodificar o token:', error);
                    AuthService.clearToken(); // Use clearToken para remover o token
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await AuthService.login(credentials);
            if (response?.access) { // Verifique a chave correta 'access'
                AuthService.setToken(response.access);
                const decodedToken = jwtDecode(response.access); // Use jwtDecode
                setUser(decodedToken);
                setIsAuthenticated(true);
                navigate('/dashboard');
                return {};
            } else {
                setIsAuthenticated(false);
                setUser(null);
                return { error: response?.detail || 'Credenciais inválidas.' }; // Use 'detail' para mensagens de erro padrão do DRF
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setIsAuthenticated(false);
            setUser(null);
            return { error: error?.response?.data?.detail || 'Erro ao fazer login.' }; // Use 'detail' para mensagens de erro padrão do DRF
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        AuthService.clearToken(); // Use clearToken
        AuthService.clearRefreshToken(); // Limpe também o refresh token
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

export const useAuth = () => {
    return React.useContext(AuthContext);
};