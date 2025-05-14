// src/router/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginaInicial from '../components/paginaInicial/index.tsx';
import Login from '../components/insert_login/index.tsx';
import Cadastro from '../components/insert_cadastro/index.tsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  );
};

export default AppRoutes;
