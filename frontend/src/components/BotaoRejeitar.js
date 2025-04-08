import React from 'react';

function BotaoRejeitar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
    >
      Rejeitar
    </button>
  );
}

export default BotaoRejeitar;