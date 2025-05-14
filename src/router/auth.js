// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./database.db');

// Rota de cadastro
router.post('/cadastro', (req, res) => {
  const { nome, email, senha, senhaConfirmar } = req.body;

  // Validações básicas
  if (!nome || !email || !senha || !senhaConfirmar) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  if (senha !== senhaConfirmar) {
    return res.status(400).json({ erro: 'As senhas não coincidem' });
  }

  // Verifica se o email já existe
  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (usuario) return res.status(400).json({ erro: 'Email já cadastrado' });

    // Criptografa a senha
    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return res.status(500).json({ erro: 'Erro ao criar usuário' });

      // Insere o novo usuário
      db.run(
        'INSERT INTO usuario (nome, email, senha_hash) VALUES (?, ?, ?)',
        [nome, email, hash],
        function(err) {
          if (err) return res.status(500).json({ erro: 'Erro ao criar usuário' });
          
          // Cria token JWT para login automático após cadastro
          const token = jwt.sign({ id: this.lastID }, 'segredo_simples');
          res.json({ token });
        }
      );
    });
  });
});

// Rota de login (mantida como está)
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado' });

    bcrypt.compare(senha, usuario.senha_hash, (err, resultado) => {
      if (resultado) {
        const token = jwt.sign({ id: usuario.id_usuario }, 'segredo_simples');
        res.json({ token });
      } else {
        res.status(401).json({ erro: 'Senha incorreta' });
      }
    });
  });
});

module.exports = router;