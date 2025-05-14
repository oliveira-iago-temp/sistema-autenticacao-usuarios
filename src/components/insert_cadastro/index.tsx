//src/components/insert_cadastro/index.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './input.css';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmar, setSenhaConfirmar] = useState('');
  const [perfil, setPerfil] = useState(''); // ← NOVO
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== senhaConfirmar) {
      setErro('As senhas não coincidem');
      return;
    }

    const telefoneValido = /^\d{2}\d{5}\d{4}$/.test(telefone);
    if (!telefoneValido) {
      setErro('Telefone inválido. Use o formato (xx) xxxxx-xxxx');
      return;
    }

    if (!perfil) {
      setErro('Selecione um perfil');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/cadastro', {
        nome,
        email,
        telefone,
        senha,
        senhaConfirmar,
        id_papel: perfil
      });

      // localStorage.setItem('token', res.data.token);
      setSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const mensagem = err.response?.data?.erro || 'Erro ao logar';
      setErro(mensagem);
      alert(mensagem);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleCadastro}>
        <h2 className="login-title">Cadastro</h2>

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p style={{ color: 'green', textAlign: 'center' }}>{sucesso}</p>}

        {/* CAMPO DE PERFIL */}
        <select
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
          required
        >
          <option value="">Selecione o perfil</option>
          <option value="1">Administrador</option>
          <option value="2">Visualizador</option>
        </select>

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
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Telefone (xx) xxxxx-xxxx"
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
