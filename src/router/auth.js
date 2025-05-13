// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./database.db');

// Rota de login
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
