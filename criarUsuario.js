// criarUsuario.js
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

// Conexão com o banco de dados
const db = new sqlite3.Database('./database.db');

// Dados do novo usuário
const nome = 'Usuario Master'
const email = 'teste@email.com';
const senha = '123456';

// Gerar o hash da senha e inserir no banco
bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }

  db.run(
    'INSERT INTO usuario (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, hash],
    (err) => {
      if (err) {
        console.error('Erro ao inserir usuário:', err.message);
      } else {
        console.log('Usuário criado com sucesso!');
      }
      db.close();
    }
  );
});
