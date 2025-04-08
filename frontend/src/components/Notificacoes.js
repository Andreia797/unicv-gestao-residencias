import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

function Notificacoes({ mensagem, tipo, limparMensagem }) {
  const [aberto, setAberto] = useState(!!mensagem);

  useEffect(() => {
    setAberto(!!mensagem);
  }, [mensagem]);

  const fechar = () => {
    setAberto(false);
    if (limparMensagem) {
      limparMensagem();
    }
  };

  return (
    <Snackbar open={aberto} autoHideDuration={6000} onClose={fechar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={fechar} severity={tipo} sx={{ width: '100%' }}>
        {mensagem}
      </Alert>
    </Snackbar>
  );
}

export default Notificacoes;