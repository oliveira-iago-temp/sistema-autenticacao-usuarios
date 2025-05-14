// src/router/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginaInicial from '../components/paginaInicial/index.tsx';
import Login from '../components/insert_login/index.tsx';
import Cadastro from '../components/insert_cadastro/index.tsx';
import GestaoUsuarios from '../components/gestao_usuarios/index.tsx';
import RotaPrivada from './RotaPrivada.tsx';
import RedefinirSenha from '../components/redefinir_senha/index.tsx';
import LogsAcesso from '../components/logs/index.tsx'; // importar


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/logs" element={<LogsAcesso />} />
      
      {/* Rotas protegidas */}
      <Route
        path="/usuarios"
        element={
          <RotaPrivada>
            <GestaoUsuarios />
          </RotaPrivada>
        }
      />
  </Routes>

  );
};

export default AppRoutes;
