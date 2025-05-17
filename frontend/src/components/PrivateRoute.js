import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext'; // Importe o contexto diretamente

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext); // Use useContext para acessar o valor do contexto
    const location = useLocation();

    if (loading) {
        return null;
    }

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default PrivateRoute;