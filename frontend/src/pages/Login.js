import React, { useState, useContext, useEffect } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import unicvLogo from "../assets/unicv-logo.png";
import unicvResidenciaBackground from "../assets/unicv-residencia.jpg";
import {
    UserIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../components/AuthContext"; // Importa o contexto

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setUser, user } = useContext(AuthContext); // Pega função para setar usuário globalmente e o estado do usuário

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await AuthService.login({ email, password });

            if (data?.requires_2fa && data?.access_token) {
                localStorage.setItem("tempAccessToken", data.access_token);
                localStorage.setItem("pre_2fa_email", email);
                navigate("/2fa-verification");
            } else if (data?.access_token && data?.user) {
                // Armazena token e usuário (com grupos)
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user); // Atualiza contexto global
                // O redirecionamento agora será feito no useEffect após a atualização do contexto
            } else if (data?.error) {
                setError(`Falha no login: ${data.error}`);
            } else {
                setError("Erro inesperado durante o login.");
            }
        } catch (err) {
            const detail =
                err?.response?.data?.detail ||
                err?.response?.data?.error ||
                "Erro ao fazer login.";
            setError(detail);
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect para redirecionar após a atualização do estado do usuário
    useEffect(() => {
        if (user) {
            if (user?.groups?.includes('estudante')) {
                navigate('/inicio');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, navigate]);

    return (
        <div
            className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${unicvResidenciaBackground})` }}
        >
            <div className="absolute inset-0 bg-white opacity-60" />
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg z-10">
                <div className="flex flex-col items-center mb-8">
                    <img src={unicvLogo} alt="UniCV Logo" className="h-16 mb-6" />
                    <h2 className="text-3xl font-semibold text-center mb-2">
                        Plataforma de Gestão das Residências
                    </h2>
                    <h2 className="text-2xl font-semibold text-center text-primary mt-3">
                        Login
                    </h2>
                </div>

                {error && (
                    <div className="text-lg text-red-500 mb-6 text-center">{error}</div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="shadow appearance-none border rounded-md w-full py-3 pl-12 pr-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                        />
                    </div>

                    <div className="mb-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="shadow appearance-none border rounded-md w-full py-3 pl-12 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-6 w-6 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md w-full text-lg ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "A fazer login..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;