const db = require('../config/database');

class PerfilOngModel {

  // busca por id da ong
  static async findByOngId(ongId) {
    const [rows] = await db.execute(
      `SELECT * FROM perfil_ong WHERE id_ong = ?`,
      [ongId]
    );
    return rows[0] || null;
  }

  // cria um perfil COMPLETO (compatível com seu controller)
static async create(data) {

  const id_ong = Number(data.id_ong); // 🔥 força número SEMPRE
  const resumo = data.resumo || null;
  const classificacao = data.classificacao || null;
  const endereco = data.endereco || null;

  let causas_atuacao = null;

  if (Array.isArray(data.causas_atuacao)) {
    causas_atuacao = JSON.stringify(data.causas_atuacao);
  } else if (typeof data.causas_atuacao === "string") {
    causas_atuacao = data.causas_atuacao;
  }
  const [result] = await db.execute(
    `INSERT INTO perfil_ong 
      (id_ong, resumo, causas_atuacao, classificacao, endereco)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id_ong,
      resumo,
      causas_atuacao,
      classificacao,
      endereco
    ]
  );


    return result.insertId;
  }

  // update completo
  static async update({ id_ong, resumo, causas_atuacao, classificacao, endereco }) {
    await db.execute(
      `UPDATE perfil_ong 
       SET resumo = ?, 
           causas_atuacao = ?, 
           classificacao = ?, 
           endereco = ?
       WHERE id_ong = ?`,
      [
        resumo || null,
        causas_atuacao ? JSON.stringify(causas_atuacao) : null,
        classificacao || null,
        endereco || null,
        id_ong
      ]
    );
  }

  // perfil completo utilizado no updateProfile
  static async getCompleteProfile(firebaseUid) {
    try {
      const [rows] = await db.execute(
        `SELECT o.*, p.resumo, p.causas_atuacao, p.classificacao AS p_classificacao, p.endereco AS p_endereco
         FROM ong o
         LEFT JOIN perfil_ong p ON p.id_ong = o.id_ong
         WHERE o.firebase_uid = ?`,
        [firebaseUid]
      );

      const row = rows[0];
      if (!row) return null;

      let causas_atuacao = [];
      if (row.causas_atuacao) {
        try { causas_atuacao = JSON.parse(row.causas_atuacao); } catch {}
      }

      return {
        id_ong: row.id_ong,
        firebase_uid: row.firebase_uid,
        email: row.email,
        nome_ong: row.nome_ong,
        perfil_oficial: row.perfil_oficial,
        classificacao: row.classificacao || row.p_classificacao,
        descricao: row.resumo || row.descricao,
        endereco: row.endereco || row.p_endereco,
        causa: row.causa,
        estado: row.estado,
        telefone: row.telefone,
        website: row.website,
        facebook: row.facebook,
        instagram: row.instagram,
        causas_atuacao
      };
    } catch (err) {
      console.error('Erro ao buscar perfil completo:', err);
      throw err;
    }
  }

  // contatos
  static async updateContactInfo(ongId, contactData) {
    const { telefone, email, website, facebook, instagram } = contactData;
    
    await db.execute(
      `UPDATE ong SET telefone = ?, website = ?, facebook = ?, instagram = ? WHERE id_ong = ?`,
      [telefone, website, facebook, instagram, ongId]
    );

    if (email) {
      await db.execute(
        `UPDATE ong SET email = ? WHERE id_ong = ?`,
        [email, ongId]
      );
    }
  }

  static async getContactInfo(ongId) {
    const [rows] = await db.execute(
      `SELECT telefone, email, website, facebook, instagram FROM ong WHERE id_ong = ?`,
      [ongId]
    );
    return rows[0] || null;
  }
}

module.exports = PerfilOngModel;
