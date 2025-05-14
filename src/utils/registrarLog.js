//src/utils/registrarLog.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

function registrarLog(id_usuario, acao, detalhes, ip_origem = '127.0.0.1') {
  const data_hora = new Date().toISOString();

  db.run(`
    INSERT INTO log_acesso (id_usuario, data_hora, acao, detalhes, ip_origem)
    VALUES (?, ?, ?, ?, ?)
  `, [id_usuario, data_hora, acao, detalhes, ip_origem], (err) => {
    if (err) {
      console.error('Erro ao registrar log:', err.message);
    }
  });
}

module.exports = registrarLog;
