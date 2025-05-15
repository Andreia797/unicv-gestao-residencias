import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Typography, List, ListItem, ListItemText, Alert
} from '@mui/material';

const MinhaCandidatura = () => {
  const [candidatura, setCandidatura] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    axios.get('/api/candidaturas/minha/')
      .then(res => setCandidatura(res.data))
      .catch(() => setErro(true));
  }, []);

  if (erro) {
    return <Alert severity="info" sx={{ mt: 2 }}>Nenhuma candidatura encontrada.</Alert>;
  }

  if (!candidatura) return null;

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Minha Candidatura
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Residência" secondary={candidatura.residencia?.Nome} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Status" secondary={candidatura.status} />
        </ListItem>
        {['CNIouPassaporteEntregue', 'DeclaracaoMatriculaEntregue', 'DeclaracaoRendimentoEntregue',
          'DeclaracaoSubsistenciaEntregue', 'DeclaracaoResidenciaEntregue'
        ].map(field => (
          <ListItem key={field}>
            <ListItemText primary={field.replace(/([A-Z])/g, ' $1')} secondary={candidatura[field] ? 'Sim' : 'Não'} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MinhaCandidatura;