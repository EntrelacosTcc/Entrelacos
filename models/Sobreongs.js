const db = require('../config/database');

class Sobreongs {
  // CREATE - Criar novo contato
  static create(novoContato, callback) {
    const { nome, email, telefone, assunto, mensagem, origem } = novoContato;
    const query = 'INSERT INTO faleconosco (nome, email, telefone, assunto, mensagem, origem) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [nome, email, telefone, assunto, mensagem, origem], (err, results) => {
      if (err) return callback(err);
      callback(null, results.insertId);
    });
  }

    static getAll(callback) {
    const query = 'SELECT * FROM faleconosco ORDER BY data_envio DESC';
    db.query(query, callback);
  }
}

module.exports = Sobreongs;