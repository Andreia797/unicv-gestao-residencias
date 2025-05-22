// frontend/src/components/Vagas.js
import React, { useEffect, useState, useContext } from "react";
import AuthService from "../../services/AuthService";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { AuthContext } from "../AuthContext";

const Vagas = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);

  const [pagina, setPagina] = useState(1); // Começa na página 1
  const resultadosPorPagina = 8; // Definição fixa de 9 vagas por página

  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AuthService.authenticatedRequest(
          "get",
          "candidaturas",
          "vagas/"
        );
        setVagas(response.data);
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
        setError("Erro ao carregar as vagas disponíveis.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchVagas();
    }
  }, [authToken]);

  const handleChangePage = (event, novaPagina) => {
    setPagina(novaPagina);
  };

  const totalPaginas = Math.ceil(vagas.length / resultadosPorPagina);

  const vagasPaginadas = React.useMemo(() => {
    const inicio = (pagina - 1) * resultadosPorPagina;
    const fim = inicio + resultadosPorPagina;
    return vagas.slice(inicio, fim);
  }, [vagas, pagina]);

  if (loading) {
    return <CircularProgress sx={{ mt: 2 }} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Vagas Disponíveis
      </Typography>
      <List>
        {vagas.length === 0 && (
          <Typography variant="body1" color="textSecondary">
            Não há vagas disponíveis no momento.
          </Typography>
        )}
        {vagasPaginadas.map((vaga) => (
          <ListItem key={vaga.id} divider>
            <ListItemText
              primary={`Quarto: ${vaga.numero}`}
              secondary={`Edifício: ${
                vaga.edificio_detalhes?.nome || "N/A"
              } - ${vaga.edificio_detalhes?.endereco || "N/A"} | Capacidade: ${
                vaga.capacidade || "N/A"
              }`}
            />
          </ListItem>
        ))}
      </List>
      {vagas.length > 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Total de Vagas: {vagas.length}
        </Typography>
      )}
      {vagas.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 flex justify-end items-center">
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={handleChangePage}
            color="primary"
            size="large"
          />
        </div>
      )}
    </Paper>
  );
};

export default Vagas;
