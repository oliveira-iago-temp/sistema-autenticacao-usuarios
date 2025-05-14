// src/router/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const registrarLog = require('../utils/registrarLog');
const router = express.Router();
const db = new sqlite3.Database('./database.db');

// LISTAR LOGS DE ACESSO (somente admin)
router.get('/logs', (req, res) => {
  const query = `
    SELECT 
      l.id_log,
      l.data_hora,
      l.acao,
      l.detalhes,
      l.ip_origem,
      u.nome AS nome_usuario,
      u.email AS email_usuario
    FROM log_acesso l
    LEFT JOIN usuario u ON l.id_usuario = u.id_usuario
    ORDER BY l.data_hora DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar logs' });
    res.json(rows);
  });
});


// LOGIN
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    
    //Usuário nao existe
    if (!usuario) {
      registrarLog(null, 'login_falha', `Tentativa de login com e-mail inexistente: ${email}`);
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }


    bcrypt.compare(senha, usuario.senha_hash, (err, resultado) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar senha' });

      if (resultado) {
        
        const token = jwt.sign(
          {
            id: usuario.id,
            nome: usuario.nome,
            papel: Number(usuario.id_papel)
          },
          'segredo_simples'
        );
        registrarLog(usuario.id_usuario, 'login_sucesso', `Usuário ${usuario.email} logou com sucesso.`);
        return res.json({ token });
      } else {
        registrarLog(usuario.id_usuario, 'login_falha', 'Senha incorreta');
        return res.status(401).json({ erro: 'Senha incorreta' });
      }
    });
  });
});

// CADASTRO
router.post('/auth/cadastro', (req, res) => {
  const { nome, email, telefone, senha, senhaConfirmar, id_papel } = req.body;

  if (!nome || !email || !telefone || !senha || !senhaConfirmar || !id_papel) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  if (senha !== senhaConfirmar) {
    return res.status(400).json({ erro: 'As senhas não coincidem' });
  }

  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, usuarioExistente) => {
    if (err) return res.status(500).json({ erro: 'Erro ao verificar e-mail' });

    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está em uso' });
    }

    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return res.status(500).json({ erro: 'Erro ao gerar a senha' });

      db.run(
        'INSERT INTO usuario (nome, email, telefone, senha_hash, id_papel) VALUES (?, ?, ?, ?, ?)',
        [nome, email, telefone, hash, Number(id_papel)],
        function (err) {
          if (err) {
            console.error('Erro ao salvar usuário no banco:', err.message); // Mostra erro real
            return res.status(500).json({ erro: 'Erro ao salvar usuário no banco' });
          }


          const token = jwt.sign(
            {
              id: this.lastID,
              nome,
              papel: Number(id_papel)
            },
            'segredo_simples'
          );

          res.json({ token });
        }
      );
    });
  });
});

// LISTAR USUÁRIOS
router.get('/usuarios', (req, res) => {
  const query = `
    SELECT u.id_usuario, u.nome, u.email, u.telefone, p.nome_papel as perfil
    FROM usuario u
    JOIN papel p ON u.id_papel = p.id_papel
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    res.json(rows);
  });
});

// EXCLUIR USUÁRIO
router.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM usuario WHERE id_usuario = ?', [id], function (err) {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir usuário' });

    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário excluído com sucesso' });
  });
});

// EDITAR USUÁRIO
router.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, id_papel } = req.body;

  if (!nome || !email || !telefone || !id_papel) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  const query = `
    UPDATE usuario
    SET nome = ?, email = ?, telefone = ?, id_papel = ?
    WHERE id_usuario = ?
  `;

  db.run(query, [nome, email, telefone, id_papel, id], function (err) {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário' });

    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  });
});

// REDEFINIR SENHA (via e-mail)
router.put('/auth/redefinir-senha', (req, res) => {
  const { email, novaSenha } = req.body;

  console.log('Tentando redefinir senha para:', email);

  if (!email || !novaSenha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  bcrypt.hash(novaSenha, 10, (err, hash) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar nova senha' });

    db.run(
      'UPDATE usuario SET senha_hash = ? WHERE email = ?',
      [hash, email],
      function (err) {
        if (err) {
          console.error('Erro ao atualizar senha:', err.message);
          return res.status(500).json({ erro: 'Erro ao atualizar senha' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Senha redefinida com sucesso' });
      }
    );
  });
});

// VERIFICAR SE USUÁRIO EXISTE POR E-MAIL
router.get('/auth/usuario-existe', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ erro: 'Informe o e-mail' });
  }

  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });

    if (!usuario) {
      return res.status(404).json({ erro: 'E-mail não encontrado' });
    }

    res.json({ mensagem: 'Usuário encontrado' });
  });
});




module.exports = router;
