import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Log {
  id_log: number;
  data_hora: string;
  acao: string;
  detalhes: string;
  ip_origem: string;
  nome_usuario: string;
  email_usuario: string;
}

interface TokenPayload {
  papel: number;
}

function LogsAcesso() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [erro, setErro] = useState('');
  const [papel, setPapel] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      setPapel(decoded.papel);

      if (decoded.papel === 1) {
        carregarLogs();
      }
    }
  }, [token]);

  const carregarLogs = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/logs');
      setLogs(res.data);
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao buscar logs');
    }
  };

  if (papel !== 1) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Logs de Acesso</h2>
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Apenas administradores podem visualizar esta página.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Logs de Acesso</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={th}>Data/Hora</th>
            <th style={th}>Usuário</th>
            <th style={th}>E-mail</th>
            <th style={th}>Ação</th>
            <th style={th}>Detalhes</th>
            <th style={th}>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id_log}>
              <td style={td}>{new Date(log.data_hora).toLocaleString()}</td>
              <td style={td}>{log.nome_usuario || 'Desconhecido'}</td>
              <td style={td}>{log.email_usuario || '—'}</td>
              <td style={td}>{log.acao}</td>
              <td style={td}>{log.detalhes}</td>
              <td style={td}>{log.ip_origem}</td>
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

export default LogsAcesso;
