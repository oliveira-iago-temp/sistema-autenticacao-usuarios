//src/components/insert_login/index.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './input.css';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      const res = await axios.post('http://localhost:3001/api/login', { email, senha });

      // Salva o token no localStorage
      localStorage.setItem('token', res.data.token);

      setSucesso('Login realizado com sucesso!');
      setTimeout(() => {
        navigate('/');
      }, 1000); // redireciona após 1 segundo
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao logar');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2 className="login-title">Bem-vindo!</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />

        <button type="submit">Entrar</button>

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p style={{ color: 'green', textAlign: 'center' }}>{sucesso}</p>}

        {/* Links para criar conta e redefinir senha */}
        <div className="login-links">
          <Link to="/cadastro">Criar conta</Link>
          <Link to="/redefinir-senha">Esqueci minha senha</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
