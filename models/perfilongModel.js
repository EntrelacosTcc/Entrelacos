// models/perfilongModel.js
const db = require('../config/database');

class PerfilOngModel {
  static async findByOngId(ongId) {
    const [rows] = await db.execute(
      `SELECT * FROM perfil_ong WHERE id_ong = ?`,
      [ongId]
    );
    return rows[0] || null;
  }

  static async create(profileData) {
    const { id_ong, resumo, causas_atuacao, classificacao, endereco } = profileData;
    
    try {
      // Primeiro, verificar se a tabela tem as colunas que tentamos usar
      const [result] = await db.execute(
        `INSERT INTO perfil_ong (id_ong, resumo, causas_atuacao, classificacao, endereco)
         VALUES (?, ?, ?, ?, ?)`,
        [id_ong, resumo ?? null, causas_atuacao ?? null, classificacao ?? null, endereco ?? null]
      );
      return result.insertId;
    } catch (error) {
      // Se der erro, tentar inserir apenas com id_ong (estrutura mínima)
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('⚠️ Estrutura da tabela perfil_ong diferente do esperado. Usando estrutura mínima...');
        const [result] = await db.execute(
          `INSERT INTO perfil_ong (id_ong) VALUES (?)`,
          [id_ong]
        );
        return result.insertId;
      }
      throw error;
    }
  }

  static async update(ongId, profileData) {
    const resumo = profileData.resumo ?? null;
    const causas_atuacao = profileData.causas_atuacao ?? null;
    const classificacao = profileData.classificacao ?? null;
    const endereco = profileData.endereco ?? null;
    
    try {
      await db.execute(
        `UPDATE perfil_ong
         SET resumo = ?, causas_atuacao = ?, classificacao = ?, endereco = ?
         WHERE id_ong = ?`,
        [resumo, causas_atuacao, classificacao, endereco, ongId]
      );
    } catch (error) {
      console.log('⚠️ Erro ao atualizar perfil_ong (estrutura pode ser diferente):', error.message);
      // Ignorar erro se a estrutura for diferente
    }
  }

  static async getCompleteProfile(firebaseUid) {
    try {
      const [rows] = await db.execute(
        `SELECT o.*, p.resumo, p.causas_atuacao, p.classificacao as perfil_classificacao, p.endereco as perfil_endereco
         FROM ong o
         LEFT JOIN perfil_ong p ON p.id_ong = o.id_ong
         WHERE o.firebase_uid = ?`,
        [firebaseUid]
      );
      
      const row = rows[0];
      if (!row) return null;

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
        created_at: row.created_at,
        // Campos da tabela perfil_ong (se existirem)
        resumo: row.resumo,
        causas_atuacao: row.causas_atuacao,
        perfil_classificacao: row.perfil_classificacao,
        perfil_endereco: row.perfil_endereco
      };
    } catch (error) {
      // Se o JOIN falhar, retornar apenas dados da tabela ong
      console.log('⚠️ Erro no JOIN com perfil_ong, retornando apenas dados da ONG:', error.message);
      
      const [rows] = await db.execute(
        `SELECT * FROM ong WHERE firebase_uid = ?`,
        [firebaseUid]
      );
      
      const row = rows[0];
      if (!row) return null;

      return {
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
        created_at: row.created_at
      };
    }
  }

  static async updateContactInfo(ongId, contactData) {
    const { telefone, email, website, facebook, instagram } = contactData;
    
    try {
      // Verificar se já existe registro de contato para esta ONG
      const [existing] = await db.execute(
        `SELECT id_ong FROM contato WHERE id_ong = ?`,
        [ongId]
      );

      if (existing.length > 0) {
        // Atualizar
        await db.execute(
          `UPDATE contato SET telefone = ?, email = ?, website = ?, facebook = ?, instagram = ?
           WHERE id_ong = ?`,
          [telefone, email, website, facebook, instagram, ongId]
        );
      } else {
        // Inserir novo
        await db.execute(
          `INSERT INTO contato (telefone, email, website, facebook, instagram, id_ong)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [telefone, email, website, facebook, instagram, ongId]
        );
      }
    } catch (error) {
      console.log('⚠️ Erro ao atualizar contatos (tabela pode não existir):', error.message);
    }
  }

  static async getContactInfo(ongId) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM contato WHERE id_ong = ?`,
        [ongId]
      );
      return rows[0] || null;
    } catch (error) {
      console.log('⚠️ Erro ao buscar contatos (tabela pode não existir):', error.message);
      return null;
    }
  }
}

module.exports = PerfilOngModel;