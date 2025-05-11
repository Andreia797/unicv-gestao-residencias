import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import unicvResidenciaBackground from '../assets/unicv-residencia.jpg';

function TwoFactorVerification() {
    const [otpToken, setOtpToken] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [isFetchingQR, setIsFetchingQR] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const waitForTokenAndGenerateQR = async () => {
            let accessToken = null;
            let attempts = 0;

            while (!accessToken && attempts < 10) {
                accessToken = AuthService.getToken();
              

                if (!accessToken) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }
            }

            if (!accessToken) {
                setError('Token de acesso não encontrado.');
                setIsFetchingQR(false);
                return;
            }

          

            try {
                const data = await AuthService.generate2FA();
                setQrCode(data.qr_code_base64);
            } catch (err) {
                console.error('Erro ao gerar QR code:', err);
                setError('Erro ao obter QR code.');
            } finally {
                setIsFetchingQR(false);
            }
        };

        waitForTokenAndGenerateQR();
    }, []);

    const handle2FAVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await AuthService.verify2FA({ otp_token: otpToken });
            navigate('/');
        } catch (err) {
            console.error('Erro na verificação 2FA:', err);
            setError(err.response?.data?.error || 'Erro na verificação do 2FA.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center relative"
             style={{ backgroundImage: `url(${unicvResidenciaBackground})` }}>
            <div className="absolute inset-0 bg-white opacity-60"></div>
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg z-10">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-3xl font-semibold text-center mb-2">Verificação de 2FA</h2>
                    <p className="text-center">Por favor, insira o código 2FA gerado no seu aplicativo de autenticação.</p>
                </div>

                {error && <div className="text-lg text-red-500 mb-6">{error}</div>}

                {isFetchingQR ? (
                    <p className="text-center mb-6">Carregando QR Code...</p>
                ) : qrCode ? (
                    <div className="flex justify-center mb-6">
                        <img src={`data:image/png;base64,${qrCode}`} alt="QR Code 2FA" className="w-48 h-48" />
                    </div>
                ) : null}

                <form onSubmit={handle2FAVerification}>
                    <div className="mb-6">
                        <input
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                            id="otpToken"
                            type="text"
                            placeholder="Código 2FA"
                            value={otpToken}
                            onChange={(e) => setOtpToken(e.target.value)}
                        />
                    </div>
                    <button
                        className={`bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md w-full text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Verificando 2FA...' : 'Verificar Código 2FA'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TwoFactorVerification;
