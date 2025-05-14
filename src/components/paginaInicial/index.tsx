//src/components/paginaInicial/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  nome?: string;
  papel?: number;
}

function PaginaInicial() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let primeiroNome = '';
  let nomePerfil = '';

  if (token) {
    try {
      const decoded: TokenPayload = jwtDecode(token);

      if (decoded.nome) {
        primeiroNome = decoded.nome.split(' ')[0];
      }

      if (decoded.papel === 1) {
        nomePerfil = 'Administrador';
      } else if (decoded.papel === 2) {
        nomePerfil = 'Visualizador';
      }
    } catch (err) {
      console.error('Token inválido:', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="pagina-container">
      <div className="pagina-box">
        <h1>Sistema de Autenticação</h1>
        
        {token ? (
          <>
            {primeiroNome && <p className="bem-vindo">Bem-vindo, {primeiroNome}!</p>}
            {nomePerfil && <p>Perfil: {nomePerfil}</p>}
          </>
        ) : (
          <>
            <p>Acesse sua conta ou cadastre-se</p>
            <div className="pagina-botoes">
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/cadastro')}>Cadastro</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaginaInicial;
