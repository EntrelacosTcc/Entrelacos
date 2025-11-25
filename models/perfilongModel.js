const db = require('../config/database');

class PerfilOngModel {
  static async findByOngId(ongId) {
    const [rows] = await db.execute(
      `SELECT * FROM perfil_ong WHERE id_ong = ?`,
      [ongId]
    );
    return rows[0] || null;
  }

  static async create(ongId, causas_atuacao = null) {
    const [result] = await db.execute(
      `INSERT INTO perfil_ong (id_ong, causas_atuacao) VALUES (?, ?)`,
      [ongId, causas_atuacao ? JSON.stringify(causas_atuacao) : null]
    );
    return result.insertId;
  }

  static async update(ongId, causas_atuacao = null) {
    await db.execute(
      `UPDATE perfil_ong SET causas_atuacao = ? WHERE id_ong = ?`,
      [causas_atuacao ? JSON.stringify(causas_atuacao) : null, ongId]
    );
  }

  static async getCompleteProfile(firebaseUid) {
    try {
      // Buscar dados da ONG e as causas do perfil_ong
      const [rows] = await db.execute(
        `SELECT o.*, p.causas_atuacao 
         FROM ong o
         LEFT JOIN perfil_ong p ON p.id_ong = o.id_ong
         WHERE o.firebase_uid = ?`,
        [firebaseUid]
      );
      
      const row = rows[0];
      if (!row) return null;

      // Parse das causas_atuacao se existir
      let causas_atuacao = [];
      if (row.causas_atuacao) {
        try {
          causas_atuacao = JSON.parse(row.causas_atuacao);
        } catch (e) {
          console.error('Erro ao parsear causas_atuacao:', e);
        }
      }

      return {
        // Campos da tabela ong
        id_ong: row.id_ong,
        firebase_uid: row.firebase_uid,
        email: row.email,
        nome_ong: row.nome_ong,
        perfil_oficial: row.perfil_oficial,
        classificacao: row.classificacao,
        nome_responsavel: row.nome_responsavel,
        cargo_responsavel: row.cargo_responsavel,
        cnpj: row.cnpj,
        descricao: row.descricao,
        endereco: row.endereco,
        causa: row.causa,
        estado: row.estado,
        telefone: row.telefone,
        website: row.website,
        facebook: row.facebook,
        instagram: row.instagram,
        created_at: row.created_at,
        updated_at: row.updated_at,
        // Campos da tabela perfil_ong
        causas_atuacao: causas_atuacao
      };
    } catch (error) {
      console.error('Erro ao buscar perfil completo:', error);
      throw error;
    }
  }

  static async updateContactInfo(ongId, contactData) {
    // Esta função atualiza a tabela ong
    const { telefone, email, website, facebook, instagram } = contactData;
    
    await db.execute(
      `UPDATE ong SET telefone = ?, website = ?, facebook = ?, instagram = ? WHERE id_ong = ?`,
      [telefone, website, facebook, instagram, ongId]
    );

    // Se houver email, atualizamos também (mas cuidado, pois o email é usado para login)
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