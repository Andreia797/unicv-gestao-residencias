import React from 'react';

const PedidoItem = ({ pedido, onAprovar, onRejeitar }) => {
  const handleAprovar = () => {
    onAprovar(pedido.id);
  };

  const handleRejeitar = () => {
    onRejeitar(pedido.id);
  };

  return (
    <div className="pedido-item">
      <p>Nome: {pedido.nome_estudante}</p>
      <p>Curso: {pedido.curso}</p>
      <p>Data do Pedido: {new Date(pedido.data_pedido).toLocaleDateString()}</p>
      <p>Status: {pedido.status}</p>
      {pedido.status === 'pendente' && (
        <div className="acoes">
          <button onClick={handleAprovar} className="aprovar-btn">Aprovar</button>
          <button onClick={handleRejeitar} className="rejeitar-btn">Rejeitar</button>
        </div>
      )}
    </div>
  );
};

export default PedidoItem;