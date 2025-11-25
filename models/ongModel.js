// models/ongModel.js
const db = require('../config/database');

class OngModel {
  static async findByFirebaseUid(firebaseUid) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM ong WHERE firebase_uid = ?',
        [firebaseUid]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar ONG por Firebase UID:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM ong WHERE id_ong = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar ONG por ID:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM ong WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar ONG por email:', error);
      throw error;
    }
  }

// models/ongModel.js - Método checkEmailExists
static async checkEmailExists(email, excludeOngId = null) {
  try {
    let query = 'SELECT id_ong FROM ong WHERE email = ?';
    const params = [email];
    
    if (excludeOngId) {
      query += ' AND id_ong != ?';
      params.push(excludeOngId);
    }
    
    const [rows] = await db.execute(query, params);
    return rows.length > 0;
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    throw error;
  }
}

  static async create(ongData) {
    try {
      const { 
        firebase_uid, 
        email, 
        nome_ong, 
        estado,
        perfil_oficial,
        classificacao,
        nome_responsavel,
        cargo_responsavel,
        cnpj,
        descricao,
        endereco,
        causa,
        telefone,
        website,
        facebook,
        instagram
      } = ongData;
      
      const [result] = await db.execute(
        `INSERT INTO ong (
          firebase_uid, email, nome_ong, estado,
          perfil_oficial, classificacao, nome_responsavel, cargo_responsavel,
          cnpj, descricao, endereco, causa,
          telefone, website, facebook, instagram,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          firebase_uid, 
          email, 
          nome_ong, 
          estado,
          perfil_oficial || null,
          classificacao || null,
          nome_responsavel || null,
          cargo_responsavel || null,
          cnpj || null,
          descricao || null,
          endereco || null,
          causa || null,
          telefone || null,
          website || null,
          facebook || null,
          instagram || null
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar ONG:', error);
      throw error;
    }
  }

  static async update(id, ongData) {
    try {
      const {
        nome_ong,
        descricao,
        endereco,
        classificacao,
        nome_responsavel,
        cargo_responsavel,
        cnpj,
        causa,
        estado,
        telefone,
        website,
        facebook,
        instagram
      } = ongData;

      await db.execute(
        `UPDATE ong 
         SET nome_ong = ?, descricao = ?, endereco = ?, classificacao = ?,
             nome_responsavel = ?, cargo_responsavel = ?, cnpj = ?, causa = ?, estado = ?,
             telefone = ?, website = ?, facebook = ?, instagram = ?,
             updated_at = NOW()
         WHERE id_ong = ?`,
        [
          nome_ong || null,
          descricao || null,
          endereco || null,
          classificacao || null,
          nome_responsavel || null,
          cargo_responsavel || null,
          cnpj || null,
          causa || null,
          estado || null,
          telefone || null,
          website || null,
          facebook || null,
          instagram || null,
          id
        ]
      );
    } catch (error) {
      console.error('Erro ao atualizar ONG:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT id_ong, nome_ong, classificacao, descricao, causa, estado FROM ong WHERE ativo = 1 ORDER BY nome_ong'
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todas as ONGs:', error);
      throw error;
    }
  }

  static async findByFirebaseUid(firebaseUid) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM ong WHERE firebase_uid = ?',
        [firebaseUid]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar ONG por Firebase UID:', error);
      throw error;
    }
  }

  static async update(ongId, updateData) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      values.push(ongId);
      
      const [result] = await db.execute(
        `UPDATE ong SET ${fields.join(', ')} WHERE id_ong = ?`,
        values
      );
      
      return result;
    } catch (error) {
      console.error('Erro ao atualizar ONG:', error);
      throw error;
    }
  }
}

module.exports = OngModel;