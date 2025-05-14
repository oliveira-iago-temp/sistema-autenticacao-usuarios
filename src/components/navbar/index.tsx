//src/components/navbar/index.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/">Página Inicial</Link>

        {token ? (
          <>
            <Link to="/usuarios">Gestão de Usuários</Link>
            <Link to="/cadastro">Cadastrar Novo Usuário</Link>
            <Link to="/logs">Logs</Link>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/cadastro">Cadastro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
