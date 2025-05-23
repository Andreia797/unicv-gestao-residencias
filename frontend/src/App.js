import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import FormularioCandidatura from './forms/FormularioCandidatura';
import MinhaCandidatura from './components/candidaturas/MinhaCandidatura';
import AdicionarNovoQuarto from './components/quartos/AdicionarNovoQuarto';
import EditarQuarto from './components/quartos/EditarQuarto';
import AvaliarCandidaturas from './components/candidaturas/AvaliarCandidaturas';
import CandidaturaDetalhes from './components/candidaturas/CandidaturaDetalhes';
import AdminCandidaturas from './components/candidaturas/AdminCandidaturas';
import PerfilResidente from './components/residente/PerfilResidente';
import FormularioResidente from './forms/FormularioResidente';
import EdificioDetalhes from './components/edificios/EdificioDetalhes';
import FormularioEdificio from './forms/FormularioEdificio';
import QuartoDetalhes from './components/quartos/QuartoDetalhes';
import FormularioQuarto from './forms/FormularioQuarto';
import CamaDetalhes from './components/camas/CamaDetalhes';
import FormularioCama from './forms/FormularioCama';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDetails from './components/users/UserDetails';
import UserEdit from './components/users/UserEdit';
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import GerirUtilizadores from './components/users/GerirUtilizadores';
import GerirCamas from './components/camas/GerirCamas';
import GerirResidentes from './components/residente/GerirResidentes';
import GerirQuartos from './components/quartos/GerirQuartos';
import GerirEdificios from './components/edificios/GerirEdificios';
import Inicio from './components/candidaturas/Início';
import PrivateRoute from './components/PrivateRoute';
import GerirCandidaturas from './components/candidaturas/GerirCandidaturas';
import TwoFactorVerification from './pages/TwoFactorVerification';
import Vagas from './components/candidaturas/Vagas';
import GerirVagas from './components/candidaturas/GerirVagas';

function App() {
    return (
        <Routes> {/* Use Routes aqui, sem BrowserRouter */}
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/2fa-verification" element={<TwoFactorVerification />} />
            <Route path="*" element={<NotFound />} />

            {/* Rotas Protegidas */}
            <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} /> {/* Dashboard como página inicial protegida */}
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Rotas de Candidaturas */}
                    <Route path="minhacandidatura" element={<MinhaCandidatura />} />
                    <Route path="admin/candidaturas/avaliar" element={<AvaliarCandidaturas />} />
                    <Route path="admin/candidaturas" element={<AdminCandidaturas />} />
                     <Route path="gerirvagas" element={<GerirVagas />} />
                    <Route path="admin/candidaturas/gerir" element={<GerirCandidaturas />} />
                    <Route path="candidaturas/:id" element={<CandidaturaDetalhes />} />
                    <Route path="/candidaturas/nova" element={<FormularioCandidatura />} />
                    <Route path="/vagas" element={<Vagas />} />
                    <Route path="inicio" element={<Inicio />} />
                    <Route path="/editarquarto/:id" element={<EditarQuarto />} />
                    <Route path="/adicionarquarto" element={<AdicionarNovoQuarto />} />

                    {/* Rotas de Residentes */}
                    <Route path="residentes/:id" element={<PerfilResidente />} />
                    <Route path="residentes/editar/:id" element={<FormularioResidente />} />
                    <Route path="residentes/criar" element={<FormularioResidente />} />
                    <Route path="gerirresidentes" element={<GerirResidentes />} />

                    {/* Rotas de Edifícios */}
                    <Route path="edificios/:id" element={<EdificioDetalhes />} />
                    <Route path="edificios/editar/:id" element={<FormularioEdificio />} />
                    <Route path="edificios/criar" element={<FormularioEdificio />} />
                    <Route path="geriredificios" element={<GerirEdificios />} />

                    {/* Rotas de Quartos */}
                    <Route path="quartos/:id" element={<QuartoDetalhes />} />
                    <Route path="quartos/editar/:id" element={<FormularioQuarto />} />
                    <Route path="quartos/criar" element={<FormularioQuarto />} />
                    <Route path="gerirquartos" element={<GerirQuartos />} />

                    {/* Rotas de Camas */}
                    <Route path="camas/:id" element={<CamaDetalhes />} />
                    <Route path="camas/editar/:id" element={<FormularioCama />} />
                    <Route path="camas/criar" element={<FormularioCama />} />
                    <Route path="gerircamas" element={<GerirCamas />} />

                    {/* Rotas de Utilizadores */}
                    <Route path="users/:id" element={<UserDetails />} />
                    <Route path="users/edit/:id" element={<UserEdit />} />
                    <Route path="users/criar" element={<UserEdit />} />
                    <Route path="gerirutilizadores" element={<GerirUtilizadores />} />

                    {/* Rotas de Relatórios */}
                    <Route path="reports" element={<Reports />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;