import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
    useRef
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(AuthService.getToken());
    const navigate = useNavigate();
    const location = useLocation();
    const isRedirecting = useRef(false);
    const hasCheckedAuth = useRef(false);
    const [initialRedirectDone, setInitialRedirectDone] = useState(false); // Novo estado

    const checkAuth = useCallback(() => {
        const token = AuthService.getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsAuthenticated(true);
            } catch (error) {
                AuthService.logout();
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
        hasCheckedAuth.current = true;
    }, []);

    useEffect(() => {
        checkAuth();
    }, [authToken, checkAuth]);

    useEffect(() => {
        if (user && hasCheckedAuth.current && !initialRedirectDone) {
            console.log("AuthProvider - User Groups:", user?.groups);
            const isEstudante = user?.groups?.includes('estudante');
            const redirectPath = isEstudante ? '/inicio' : '/dashboard';
            if (location.pathname !== redirectPath && !isRedirecting.current) {
                isRedirecting.current = true;
                navigate(redirectPath, { replace: true });
                setTimeout(() => {
                    isRedirecting.current = false;
                    setInitialRedirectDone(true); // Marcar como feito após o redirecionamento inicial
                }, 100);
            } else {
                setInitialRedirectDone(true); // Marcar como feito se já estiver no path correto
            }
        } else if (!user && hasCheckedAuth.current && location.pathname !== '/login' && location.pathname !== '/2fa-verification') {
            navigate('/login', { replace: true });
        }
    }, [user, navigate, location.pathname, initialRedirectDone]); // 'initialRedirectDone' como dependência

    const login = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const response = await AuthService.login(credentials);
            if (response.access_token && response.user) {
                AuthService.setToken(response.access_token);
                setAuthToken(response.access_token);
                setUser(response.user);
                setIsAuthenticated(true);
                setInitialRedirectDone(false); // Resetar para permitir o redirecionamento inicial após um novo login
                return {};
            }
            if (response.requires_2fa && response.access_token) {
                localStorage.setItem("tempAccessToken", response.access_token);
                localStorage.setItem("pre_2fa_email", credentials.email);
                navigate("/2fa-verification");
                return { requires2fa: true };
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
            if (response.access) {
                AuthService.setToken(response.access);
                setAuthToken(response.access);
                try {
                    const decoded = jwtDecode(response.access);
                    setUser(decoded);
                    setIsAuthenticated(true);
                    setInitialRedirectDone(false); // Resetar para permitir o redirecionamento inicial após a verificação 2FA
                    return {};
                } catch (decodeError) {
                    console.error("Erro ao decodificar o token após 2FA:", decodeError);
                    return { error: "Erro ao processar o token após 2FA." };
                }
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
        setInitialRedirectDone(false); // Resetar ao fazer logout
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