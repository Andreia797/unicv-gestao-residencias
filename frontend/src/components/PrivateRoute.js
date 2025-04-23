import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = () => {
    const isAuthenticated = AuthService.getToken(); 

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;