import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';

const RequireAuth = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const isAuthenticated = !!user?.username;
    const hasRequiredRole = allowedRoles?.length > 0 ? user?.groups?.some(group => allowedRoles.includes(group)) : true;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasRequiredRole) {
        return (
            <Alert severity="warning">
                Você não tem permissão para acessar esta página.
            </Alert>
        );
        // Ou, se preferir redirecionar para uma página de "sem permissão":
        // return <Navigate to="/sem-permissao" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;