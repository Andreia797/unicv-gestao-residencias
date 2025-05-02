import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CandidaturasLista from './components/candidaturas/CandidaturasLista';
import Layout from './components/Layout';
import FormularioCandidatura from './forms/FormularioCandidatura';
import CandidaturaDetalhes from './components/candidaturas/CandidaturaDetalhes';
import AdminCandidaturas from './components/candidaturas/AdminCandidaturas';
import ResidentesLista from './components/residente/ResidentesLista';
import PerfilResidente from './components/residente/PerfilResidente';
import FormularioResidente from './forms/FormularioResidente';
import EdificiosLista from './components/edificios/EdificiosLista';
import EdificioDetalhes from './components/edificios/EdificioDetalhes';
import FormularioEdificio from './forms/FormularioEdificio';
import QuartosLista from './components/quartos/QuartosLista';
import QuartoDetalhes from './components/quartos/QuartoDetalhes';
import FormularioQuarto from './forms/FormularioQuarto';
import CamasLista from './components/camas/CamasLista';
import CamaDetalhes from './components/camas/CamaDetalhes';
import FormularioCama from './forms/FormularioCama';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './components/users/UserList';
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
import PrivateRoute from './components/PrivateRoute';
import GerirCandidaturas from './components/candidaturas/GerirCandidaturas';
import TwoFactorVerification from './pages/TwoFactorVerification';


function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/2fa-verification" element={<TwoFactorVerification />} />
                <Route path="/candidaturas/nova" element={<FormularioCandidatura />} />
                <Route path="*" element={<NotFound />} />

                {/* Rotas Protegidas */}
                <Route path="/" element={<PrivateRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Rotas de Candidaturas */}
                        <Route path="candidaturas" element={<CandidaturasLista />} />
                        <Route path="candidaturas/:id" element={<CandidaturaDetalhes />} />
                        <Route path="admin/candidaturas" element={<AdminCandidaturas />} />
                        <Route path="gerircandidaturas" element={<GerirCandidaturas />} />

                        {/* Rotas de Residentes */}
                        <Route path="residentes" element={<ResidentesLista />} />
                        <Route path="residentes/:id" element={<PerfilResidente />} />
                        <Route path="residentes/editar/:id" element={<FormularioResidente />} />
                        <Route path="residentes/criar" element={<FormularioResidente />} /> 
                        <Route path="gerirresidentes" element={<GerirResidentes />} />

                        {/* Rotas de Edifícios */}
                        <Route path="edificios" element={<EdificiosLista />} />
                        <Route path="edificios/:id" element={<EdificioDetalhes />} />
                        <Route path="edificios/editar/:id" element={<FormularioEdificio />} />
                        <Route path="edificios/criar" element={<FormularioEdificio />} /> 
                        <Route path="geriredificios" element={<GerirEdificios />} />

                        {/* Rotas de Quartos */}
                        <Route path="quartos" element={<QuartosLista />} />
                        <Route path="quartos/:id" element={<QuartoDetalhes />} />
                        <Route path="quartos/editar/:id" element={<FormularioQuarto />} />
                        <Route path="quartos/criar" element={<FormularioQuarto />} /> 
                        <Route path="gerirquartos" element={<GerirQuartos />} />

                        {/* Rotas de Camas */}
                        <Route path="camas" element={<CamasLista />} />
                        <Route path="camas/:id" element={<CamaDetalhes />} />
                        <Route path="camas/editar/:id" element={<FormularioCama />} />
                        <Route path="camas/criar" element={<FormularioCama />} /> 
                        <Route path="gerircamas" element={<GerirCamas />} />
                        

                        {/* Rotas de Utilizadores */}
                        <Route path="users" element={<UserList />} />
                        <Route path="users/:id" element={<UserDetails />} />
                        <Route path="users/edit/:id" element={<UserEdit />} />
                        <Route path="gerirutilizadores" element={<GerirUtilizadores />} />

                        {/* Rotas de Relatórios */}
                        <Route path="reports" element={<Reports />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;