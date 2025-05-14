import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

function RotaPrivada({ children }: Props) {
  const token = localStorage.getItem('token');

  // Se não tiver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Senão, permite acesso
  return children;
}

export default RotaPrivada;
