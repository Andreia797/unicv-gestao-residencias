import React from 'react';
import { Paper, Typography } from '@mui/material';

const Inicio = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Portal de Candidaturas
      </Typography>
      <Typography variant="body1">
        Aqui você pode visualizar vagas disponíveis, submeter sua candidatura e acompanhar o estado da candidatura.
      </Typography>
    </Paper>
  );
};

export default Inicio;