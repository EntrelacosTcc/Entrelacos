// models/perfilusuarioModel.js
const db = require('../config/database');

class ProfileModel {
  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT * FROM perfil_usuario WHERE id_usuario = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  static async create(profileData) {
    const { id_usuario, nome, telefone, cpf, tags, descricao, foto } = profileData;
    const [result] = await db.execute(
      `INSERT INTO perfil_usuario (id_usuario, nome, telefone, cpf, tags, descricao, foto)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_usuario, nome ?? null, telefone ?? null, cpf ?? null, tags ?? null, descricao ?? null, foto ?? null]
    );
    return result.insertId;
  }

  static async update(userId, profileData) {
    const nome = profileData.nome ?? null;
    const telefone = profileData.telefone ?? null;
    const tags = profileData.tags ?? null;
    const descricao = profileData.descricao ?? null;
    const foto = profileData.foto ?? null;
    const cpf = profileData.cpf ?? null;
    await db.execute(
      `UPDATE perfil_usuario
       SET nome = ?, telefone = ?, tags = ?, descricao = ?, foto = ?, cpf = ?
       WHERE id_usuario = ?`,
      [nome, telefone, tags, descricao, foto, cpf, userId]
    );
  }

  static async getCompleteProfile(firebaseUid) {
    const [rows] = await db.execute(
      `SELECT u.id_usuario, u.firebase_uid, u.email, u.nome AS nome_usuario, u.data_nascimento, u.created_at,
              p.nome AS nome_perfil, p.telefone, p.cpf, p.tags, p.descricao, p.foto, p.horas_voluntariado, p.atuacoes, p.n_itens_doados
       FROM usuario u
       LEFT JOIN perfil_usuario p ON p.id_usuario = u.id_usuario
       WHERE u.firebase_uid = ?`,
      [firebaseUid]
    );
    const row = rows[0];
    if (!row) return null;

    // preferir nome do perfil se existir, senão nome do usuário
    return {
      id_usuario: row.id_usuario,
      firebase_uid: row.firebase_uid,
      email: row.email,
      nome: row.nome_perfil || row.nome_usuario || null,
      data_nascimento: row.data_nascimento,
      created_at: row.created_at,
      telefone: row.telefone,
      cpf: row.cpf,
      tags: row.tags,
      descricao: row.descricao,
      foto: row.foto,
      horas_voluntariado: row.horas_voluntariado,
      atuacoes: row.atuacoes,
      n_itens_doados: row.n_itens_doados
    };
  }
}

module.exports = ProfileModel;
