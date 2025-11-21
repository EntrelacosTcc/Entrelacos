// models/usuarioModel.js
const db = require('../config/database');

class UserModel {
  static async findByFirebaseUid(firebaseUid) {
    const [rows] = await db.execute(
      'SELECT * FROM usuario WHERE firebase_uid = ?',
      [firebaseUid]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM usuario WHERE id_usuario = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async create(userData) {
    const { firebase_uid, email, nome, data_nascimento } = userData;
    const [result] = await db.execute(
      'INSERT INTO usuario (firebase_uid, email, nome, data_nascimento) VALUES (?, ?, ?, ?)',
      [firebase_uid, email, nome || null, data_nascimento || null]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const nome = userData.nome ?? null;
    const data_nascimento = userData.data_nascimento ?? null;
    await db.execute(
      'UPDATE usuario SET nome = ?, data_nascimento = ? WHERE id_usuario = ?',
      [nome, data_nascimento, id]
    );
  }
}

module.exports = UserModel;
