import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo
} from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(AuthService.getToken());
    const navigate = useNavigate();

    const checkAuth = useCallback(() => {
        const token = AuthService.getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Token inválido no checkAuth:", error);
                AuthService.logout();
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [authToken, checkAuth]);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const response = await AuthService.login(credentials);

            if (response.requires_2fa && response.access_token) {
                // Salva token temporário para 2FA
                localStorage.setItem("tempAccessToken", response.access_token);
                localStorage.setItem("pre_2fa_email", credentials.email);
                navigate("/2fa-verification");
                return { requires2fa: true };
            }

            if (response.access_token) {
                AuthService.setToken(response.access_token);
                setAuthToken(response.access_token);

                const decoded = jwtDecode(response.access_token);
                setUser(decoded);
                setIsAuthenticated(true);
                navigate("/dashboard");
                return {};
            }

            if (response.error) {
                return { error: `Falha no login: ${response.error}` };
            }

            return { error: "Erro inesperado durante o login." };
        } catch (err) {
            return { error: err?.response?.data?.detail || "Erro ao fazer login." };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const verify2FA = useCallback(async (otp_token, tempToken) => {
        setLoading(true);
        try {
            const response = await AuthService.verify2FA({ otp_token }, tempToken);
            localStorage.removeItem("tempAccessToken");
            localStorage.removeItem("pre_2fa_email");

            if (response.access) {
                AuthService.setToken(response.access);
                setAuthToken(response.access);

                const decoded = jwtDecode(response.access);
                setUser(decoded);
                setIsAuthenticated(true);
                navigate("/dashboard");
                return {};
            }

            return { error: "Token de acesso não recebido após 2FA." };
        } catch (err) {
            return { error: err?.response?.data?.detail || "Erro ao verificar 2FA." };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(() => {
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
        navigate("/login");
    }, [navigate]);

    const register = useCallback(async (userData) => {
        setLoading(true);
        try {
            await AuthService.register(userData);
            navigate("/login");
            return {};
        } catch (err) {
            return {
                error: err?.response?.data?.error || "Erro ao registrar."
            };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        verify2FA,
        setUser,
        setIsAuthenticated
    }), [user, isAuthenticated, loading, login, logout, register, verify2FA]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
