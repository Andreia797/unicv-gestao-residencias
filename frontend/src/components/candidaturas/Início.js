import React, { useContext } from 'react';
import { Paper, Typography } from '@mui/material';
import  {AuthContext, AuthProvider } from '../AuthContext';
const Inicio = () => {
    const { user } = useContext(AuthContext); // Acesse as informações do usuário logado

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h4" gutterBottom>
                Bem-vindo ao Portal de Candidaturas
            </Typography>
            {user ? (
                <Typography variant="body1">
                    Olá, {user.username}! Aqui você pode visualizar vagas disponíveis, submeter sua candidatura e acompanhar o estado da sua candidatura.
                </Typography>
            ) : (
                <Typography variant="body1">
                    Aqui você pode visualizar vagas disponíveis e, se já tiver uma conta, submeter sua candidatura e acompanhar o estado da candidatura após o login.
                </Typography>
            )}
        </Paper>
    );
};

export default Inicio;