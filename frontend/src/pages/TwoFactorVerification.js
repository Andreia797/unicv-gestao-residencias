import React, { useState, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';
import unicvResidenciaBackground from '../assets/unicv-residencia.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function TwoFactorVerification() {
  const [otpToken, setOtpToken] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [isFetchingQR, setIsFetchingQR] = useState(true);
  const navigate = useNavigate();
  const { verify2FA } = useAuth();

  const generateQRCode = useCallback(async () => {
    const token = localStorage.getItem('tempAccessToken');
    if (!token) {
      setError('Token temporário não encontrado. Faça login novamente.');
      setIsFetchingQR(false);
      return;
    }

    try {
      const data = await AuthService.generate2FA(token);
      setQrCode(data.qr_code_base64);
    } catch (err) {
      console.error('Erro ao obter QR code:', err);
      setError('Erro ao obter QR code.');
    } finally {
      setIsFetchingQR(false);
    }
  }, []);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = localStorage.getItem('tempAccessToken');
    if (!token) {
      setError('Token temporário não encontrado. Faça login novamente.');
      setLoading(false);
      return;
    }

    try {
      const response = await verify2FA(otpToken, token);
      if (response?.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Erro na verificação 2FA:', err);
      setError(err?.response?.data?.error || 'Erro na verificação do 2FA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${unicvResidenciaBackground})` }}
    >
      <div className="absolute inset-0 bg-white opacity-60"></div>
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg z-10">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-semibold text-center mb-2">Verificação de 2FA</h2>
          <p className="text-center">
            Insira o código 2FA gerado no seu aplicativo de autenticação.
          </p>
        </div>

        {error && <div className="text-lg text-red-500 mb-6 text-center">{error}</div>}

        {isFetchingQR ? (
          <p className="text-center mb-6">Carregando QR Code...</p>
        ) : qrCode ? (
          <div className="flex justify-center mb-6">
            <img
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code 2FA"
              className="w-48 h-48"
            />
          </div>
        ) : (
          <p className="text-center mb-6">QR Code não disponível.</p>
        )}

        <form onSubmit={handle2FAVerification}>
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              type="text"
              placeholder="Código 2FA"
              required
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md w-full text-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verificando 2FA...' : 'Verificar Código 2FA'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TwoFactorVerification;
