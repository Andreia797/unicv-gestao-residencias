import React from 'react';
import { Link } from 'react-router-dom';
import unicvResidenciaBackground from '../assets/unicv-residencia.jpg';

function NotFound() {
  return (
    <div
      className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${unicvResidenciaBackground})` }}
    >
      <div className="absolute inset-0 bg-white opacity-60"></div>
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl z-10">
        <div className="text-center">
          <h1 className="text-8xl font-extrabold text-red-600 mb-6">404</h1>
          <p className="text-2xl text-gray-700 mb-8">Página não encontrada.</p>
          <Link
            to="/"
            className="bg-primary hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out" // Cor do botão alterada para vermelho
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;