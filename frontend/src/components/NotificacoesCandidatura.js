import React, { useEffect } from 'react';
import { Alert } from '@mui/material';

function NotificacoesCandidatura({ mensagem, tipo, limparMensagem }) {
    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                limparMensagem();
            }, 5000); // 5 segundos
            return () => clearTimeout(timer);
        }
    }, [mensagem, limparMensagem]);

    if (!mensagem) return null;

    return (
        <Alert severity={tipo} onClose={limparMensagem} className="mb-4">
            {mensagem}
        </Alert>
    );
}

export default NotificacoesCandidatura;