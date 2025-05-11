import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = () => {
  const token = AuthService.getToken();

  // Verifica se o token está presente e tem um formato válido (mínima proteção contra string vazia)
  const isAuthenticated = !!token && token !== 'undefined' && token !== '';

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
