import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GerirCamas from '../components/camas/GerirCamas';
import CamaDetalhes from '../components/camas/CamaDetalhes';
import FormularioCama from '../components/FormularioCama';

function CamasRoutes() {
    return (
        <Routes>
            <Route path="/" element={<GerirCamas />} />
            <Route path="criar" element={<FormularioCama />} />
            <Route path="editar/:id" element={<FormularioCama />} />
            <Route path=":id" element={<CamaDetalhes />} />
        </Routes>
    );
}

export default CamasRoutes;
