// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Cria a tabela 'usuario' se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      telefone TEXT UNIQUE,
      senha_hash TEXT,
      id_papel INTEGER,
      FOREIGN KEY (id_papel) REFERENCES papel(id_papel)
    );
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela "usuario" pronta!');
    }
  });
});

// Cria a tabela 'log_acesso' se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS log_acesso (
      id_log INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER,
      data_hora TEXT,
      acao TEXT,
      detalhes TEXT,
      ip_origem TEXT,
      FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    );
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela log_acesso:', err.message);
    } else {
      console.log('Tabela "log_acesso" pronta!');
    }
  });
});


// Cria a tabela 'papel' se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS papel (
      id_papel INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_papel TEXT NOT NULL UNIQUE,
      descricao TEXT
    );
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela papel:', err.message);
      db.close(); // fecha o banco
      return;
    }

    console.log('Tabela "papel" pronta!');

    // Verifica se a tabela está vazia
    db.get(`SELECT COUNT(*) as count FROM papel`, (err, row) => {
      if (err) {
        console.error('Erro ao consultar tabela papel:', err.message);
        db.close(); // fecha o banco
        return;
      }

      if (row.count === 0) {
        db.run(`
          INSERT INTO papel (nome_papel, descricao) VALUES
          ('administrador', 'Acesso total ao sistema'),
          ('visualizador', 'Acesso somente leitura');
        `, (err) => {
          if (err) {
            console.error('Erro ao inserir dados na tabela papel:', err.message);
          } else {
            console.log('Dados padrão inseridos na tabela "papel"');
          }
          db.close(); // fecha o banco
        });
      } else {
        console.log('Tabela "papel" já contém dados. Nenhuma inserção realizada.');
        db.close(); // fecha o banco
      }
    });
  });
});