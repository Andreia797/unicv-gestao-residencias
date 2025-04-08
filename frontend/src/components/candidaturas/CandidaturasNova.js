import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import FormularioCandidatura from '../../forms/FormularioCandidatura';

function CandidaturasNova() {
  return (
    <div className="p-4">
      <Card className="shadow-md rounded-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Nova Candidatura
          </Typography>
          <FormularioCandidatura />
        </CardContent>
      </Card>
    </div>
  );
}

export default CandidaturasNova;