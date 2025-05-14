import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
}

interface TokenPayload {
  id: number;
  nome: string;
  papel: number;
}

function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState('');
  const [papel, setPapel] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setPapel(decoded.papel);

        if (decoded.papel === 1) {
          carregarUsuarios();
        }
      } catch (err) {
        console.error('Token inválido:', err);
      }
    }
  }, [token]);

  const carregarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/usuarios');
      setUsuarios(res.data);
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao buscar usuários');
    }
  };

  const excluirUsuario = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((u) => u.id_usuario !== id));
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao excluir usuário');
    }
  };

  const editarUsuario = async (usuario: Usuario) => {
    const novoNome = prompt('Novo nome:', usuario.nome);
    const novoEmail = prompt('Novo e-mail:', usuario.email);
    const novoTelefone = prompt('Novo telefone:', usuario.telefone);
    const novoPerfil = prompt('Novo perfil (1 = Admin, 2 = Visualizador):', usuario.perfil === 'Administrador' ? '1' : '2');

    if (!novoNome || !novoEmail || !novoTelefone || !novoPerfil) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/usuarios/${usuario.id_usuario}`, {
        nome: novoNome,
        email: novoEmail,
        telefone: novoTelefone,
        id_papel: Number(novoPerfil)
      });

      carregarUsuarios(); // atualiza lista
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao editar usuário');
    }
  };


  if (papel !== 1) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Gestão de Usuários</h2>
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Apenas administradores podem visualizar esta página.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestão de Usuários</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={th}>Nome</th>
            <th style={th}>E-mail</th>
            <th style={th}>Telefone</th>
            <th style={th}>Perfil</th>
            <th style={th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td style={td}>{usuario.nome}</td>
              <td style={td}>{usuario.email}</td>
              <td style={td}>{usuario.telefone}</td>
              <td style={td}>{usuario.perfil}</td>
              <td style={td}>
                <button onClick={() => editarUsuario(usuario)} style={btnEditar}>
                  Editar
                </button>
                
                <button onClick={() => excluirUsuario(usuario.id_usuario)} style={btnExcluir}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  border: '1px solid #ccc',
  padding: '8px',
  background: '#f5f5f5',
};

const td = {
  border: '1px solid #ccc',
  padding: '8px',
};

const btnEditar = {
  marginRight: '8px',
  padding: '4px 8px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const btnExcluir = {
  padding: '4px 8px',
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default GestaoUsuarios;
