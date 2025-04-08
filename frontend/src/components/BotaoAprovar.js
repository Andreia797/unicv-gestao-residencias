import React from 'react';

function BotaoAprovar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
    >
      Aprovar
    </button>
  );
}

export default BotaoAprovar;