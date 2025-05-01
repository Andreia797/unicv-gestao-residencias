import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import {
  Paper,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

function CamaDetalhes() {
  const { id } = useParams();
  const [cama, setCama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCama = async () => {
      setLoading(true);
      try {
        const response = await AuthService.authenticatedRequest(
          "get",
          "relatorios",
          `/camas/${id}/`
        );
        setCama(response.data);
      } catch (err) {
        console.error("Erro ao buscar cama:", err);
        setError("Erro ao carregar detalhes da cama.");
      } finally {
        setLoading(false);
      }
    };

    fetchCama();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!cama) {
    return <Alert severity="warning">Cama não encontrada.</Alert>;
  }

  return (
    <Paper className="p-6 mt-4 shadow-md rounded-lg">
      <Typography variant="h5" gutterBottom className="font-semibold text-xl">
        Detalhes da Cama
      </Typography>
      <List>
      <ListItem>
          <ListItemText primary="ID" secondary={cama.id} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Número de cama" secondary={cama.numero} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Nome do edifício"
            secondary={cama.quarto?.edificio?.nome || "N/A"}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Tipo de Quarto"
            secondary={cama.quarto?.tipo || "N/A"}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="ID do Quarto" secondary={cama.quarto?.id} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Estado" secondary={cama.status} />
        </ListItem>
      </List>
    <div className="mt-4 flex gap-2">
      <Button
        component={Link}
        to="/camas"
        variant="contained"
        color="primary"
        className="mt-4 mr-2"
      >
        Voltar
      </Button>
      <Button
        component={Link}
        to={`/camas/editar/${cama.id}`}
        variant="contained"
        color="secondary"
        className="mt-4"
      >
        Editar
      </Button>
    </div>
    </Paper>
  );
}

export default CamaDetalhes;
