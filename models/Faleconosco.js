const db = require('../config/database');

class Faleconosco {
  // CREATE - Criar novo contato
  static create(novoContato, callback) {
    const { nome, email, telefone, assunto, mensagem } = novoContato;
    const query = 'INSERT INTO faleconosco (nome, email, telefone, assunto, mensagem) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [nome, email, telefone, assunto, mensagem], (err, results) => {
      if (err) return callback(err);
      callback(null, results.insertId);
    });
  }
}

module.exports = Faleconosco;