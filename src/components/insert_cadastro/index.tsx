import React, { useState } from 'react';
import axios from 'axios';
import './input.css';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmar, setSenhaConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Validação básica no frontend
    if (senha !== senhaConfirmar) {
      setErro('As senhas não coincidem');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/cadastro', {
        nome,
        email,
        senha,
        senhaConfirmar
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Salva o token no localStorage (login automático após cadastro)
      localStorage.setItem('token', res.data.token);

      setSucesso('Cadastro realizado com sucesso! Você será redirecionado...');
      setTimeout(() => {
        navigate('/'); // Redireciona para a página inicial após 2 segundos
      }, 2000);
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleCadastro}>
        <h2 className="login-title">Cadastro de Usuário</h2>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          required
        />

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
          minLength={6}
        />

        <input
          type="password"
          value={senhaConfirmar}
          onChange={(e) => setSenhaConfirmar(e.target.value)}
          placeholder="Confirmar a senha"
          required
          minLength={6}
        />

        <button type="submit">Cadastrar</button>

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p style={{ color: 'green', textAlign: 'center' }}>{sucesso}</p>}

        <div className="login-links">
          <Link to="/login">Já tem uma conta? Faça login</Link>
        </div>
      </form>
    </div>
  );
}

export default Cadastro;