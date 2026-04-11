import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, echalo al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, rinde los componentes hijos
  return children;
}

export default ProtectedRoute;
