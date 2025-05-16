import React, { useState } from "react";
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

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await AuthService.login({ email, password });

            if (data?.access_token) {
                AuthService.setToken(data.access_token); // Armazena token temporário

                // Armazena email e token temporário no localStorage para reutilizar na verificação 2FA
                localStorage.setItem("pre_2fa_email", email);
                navigate("/2fa-verification"); // Ir sempre para verificação 2FA
            } else {
                console.warn("Token NÃO retornado no login!");
                setError("Falha no login: token não recebido.");
            }
        } catch (err) {
            console.error("Erro no login:", err);
            const errorMessage =
                err?.response?.data?.detail ||
                err?.response?.data?.error ||
                "Erro ao fazer login.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${unicvResidenciaBackground})` }}
        >
            <div className="absolute inset-0 bg-white opacity-60"></div>
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
                {error && <div className="text-lg text-red-500 mb-6">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-3 pl-12 pr-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon
                                className="h-6 w-6 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-3 pl-12 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeSlashIcon
                                    className="h-6 w-6 text-gray-400"
                                    aria-hidden="true"
                                />
                            ) : (
                                <EyeIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                            )}
                        </div>
                    </div>
                    <button
                        className={`bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md w-full text-lg ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "A fazer login..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;