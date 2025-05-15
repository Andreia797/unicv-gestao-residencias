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

function CandidaturaDetalhes() {
  const { id } = useParams();
  const [candidatura, setCandidatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString(); 
};

  useEffect(() => {
    const fetchCandidatura = async () => {
      setLoading(true);
      try {
        const response = await AuthService.authenticatedRequest(
          "get",
          "relatorios",
          `/candidaturas/${id}/`
        );
        setCandidatura(response.data);
      } catch (err) {
        console.error("Erro ao buscar candidatura:", err);
        setError("Erro ao carregar detalhes da candidatura.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatura();
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

  if (!candidatura) {
    return <Alert severity="warning">Candidatura não encontrada.</Alert>;
  }

  return (
    <Paper className="p-6 mt-4 shadow-md rounded-lg">
      <Typography variant="h5" gutterBottom className="font-semibold text-xl">
        Detalhes da Candidatura
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Nome do Estudante"
            secondary={candidatura.estudante?.Nome || "N/A"}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Nome da Residência"
            secondary={candidatura.residencia?.Nome || "N/A"}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Edifício da Residência"
            secondary={candidatura.residencia?.edificio || "N/A"}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Data de Submissão"
            secondary={formatarData(candidatura.DataSubmissao)}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Status" secondary={candidatura.status} />
        </ListItem>
        {candidatura.mensagem && (
          <ListItem>
            <ListItemText primary="Mensagem" secondary={candidatura.mensagem} />
          </ListItem>
        )}
      </List>
    <div className="mt-4 flex gap-2">
      <Button
        component={Link}
        to="/candidaturas"
        variant="contained"
        color="primary"
        className="mt-4 mr-2"
      >
        Voltar
      </Button>
      <Button
        component={Link}
        to={`/candidaturas/editar/${candidatura.id}`}
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

export default CandidaturaDetalhes;