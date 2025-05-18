import React from 'react';
import unicvLogo from '../assets/unicv-logo.png';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const goToDashboard = () => {
    navigate('/dashboard'); // Certifique-se de que '/dashboard' é o caminho correto para o seu dashboard
  };

  return (
    <header className="bg-blue-600 p-5 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={goToDashboard}
            className="flex items-center bg-transparent border-none p-0 cursor-pointer" 
          >
            <img src={unicvLogo} alt="UniCV Logo" className="h-10 mr-3" /> 
          </button>
          <h1 className="text-2xl font-semibold text-black">
            Plataforma de Gestão das Residências da Uni-CV
          </h1>
        </div>
        <div className="flex items-center">
          <button
            className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;