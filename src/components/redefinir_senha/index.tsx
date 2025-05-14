//src/components/redefinir_senha/index.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './input.css';

function RedefinirSenha() {
  const [email, setEmail] = useState('');
  const [metodo, setMetodo] = useState('');
  const [codigoGerado, setCodigoGerado] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [valido, setValido] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

    const gerarCodigo = async () => {
        setMensagem('');

        if (!email) {
            setMensagem('Digite seu e-mail');
            return;
        }

        if (!metodo) {
            setMensagem('Selecione e-mail ou telefone');
            return;
        }

        try {
            // Verifica se o e-mail existe
            await axios.get(`http://localhost:3001/api/auth/usuario-existe`, {
            params: { email },
            });

            // Se chegou aqui, o e-mail existe
            const aleatorio = Math.floor(1000 + Math.random() * 9000).toString();
            setCodigoGerado(aleatorio);
            setMensagem('Este código é uma simulação. Copie e valide abaixo.');
        } catch (err: any) {
            const msg = err.response?.data?.erro || 'Erro ao verificar e-mail';
            setMensagem(msg);
        }
    };

  const validarCodigo = () => {
    if (codigoDigitado === codigoGerado) {
      setValido(true);
      setMensagem('');
    } else {
      setMensagem('Código inválido');
    }
  };

    const salvarSenha = async () => {
        if (novaSenha.length < 6) {
            setMensagem('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setMensagem('As senhas não coincidem.');
            return;
        }

        try {
            await axios.put('http://localhost:3001/api/auth/redefinir-senha', {
            email,
            novaSenha
            });

            setMensagem('Senha redefinida com sucesso!');
            alert('Senha redefinida com sucesso!');
        } catch (err: any) {
            const mensagem = err.response?.data?.erro || 'Erro ao redefinir a senha.';
            console.error(mensagem);
            setMensagem(mensagem);
        }
    };



  return (
    <div className="login-container">
        <form className="login-box" onSubmit={(e) => e.preventDefault()}>
        <h2 className="login-title">Redefinir Senha</h2>

        {/* Exibir apenas enquanto o código ainda não for validado */}
        {!valido && (
            <>
            <input
                type="email"
                placeholder="Seu e-mail cadastrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {/* Radio buttons*/}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <label>
                <input
                    type="radio"
                    name="metodo"
                    value="email"
                    checked={metodo === 'email'}
                    onChange={() => setMetodo('email')}
                />
                E-mail
                </label>
                <label>
                <input
                    type="radio"
                    name="metodo"
                    value="telefone"
                    checked={metodo === 'telefone'}
                    onChange={() => setMetodo('telefone')}
                />
                Telefone
                </label>
            </div>

            <button type="button" onClick={gerarCodigo}>
                Gerar código
            </button>

            {/* Exibe código e aviso */}
            {codigoGerado && (
                <>
                <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'gray' }}>
                    Código gerado (simulação): <strong>{codigoGerado}</strong>
                </p>
                <p style={{ fontSize: '0.8rem', color: '#555', textAlign: 'center' }}>
                    Este código é exibido apenas como simulação.
                </p>

                <input
                    type="text"
                    maxLength={4}
                    value={codigoDigitado}
                    onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        setCodigoDigitado(e.target.value);
                    }
                    }}
                    placeholder="Digite os 4 dígitos"
                />
                <button type="button" onClick={validarCodigo}>
                    Validar
                </button>
                </>
            )}
            </>
        )}

        {/* Campos de nova senha, visíveis somente após validação */}
        {valido && (
            <>
            <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <button type="button" onClick={salvarSenha}>
                Salvar senha
            </button>
            </>
        )}

        {mensagem && (
            <p
                style={{
                textAlign: 'center',
                color: mensagem.includes('sucesso') ? 'green' : 'red',
                }}
            >
                {mensagem}
            </p>
        )}

        </form>
    </div>
    );
}

export default RedefinirSenha;
