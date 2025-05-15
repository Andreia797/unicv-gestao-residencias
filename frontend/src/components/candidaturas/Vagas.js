import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Typography, List, ListItem, ListItemText, CircularProgress
} from '@mui/material';

const Vagas = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  axios.get('/api/candidaturas/vagas/')
    .then(response => {
      setVagas(response.data);
      setLoading(false);
    });
}, []);

  if (loading) return <CircularProgress />;

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Vagas Disponíveis
      </Typography>
      <List>
        {vagas.map((vaga) => (
          <ListItem key={vaga.id} divider>
            <ListItemText
              primary={vaga.Nome}
              secondary={`Localização: ${vaga.Localizacao} | Capacidade: ${vaga.Capacidade}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Vagas;