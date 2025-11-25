const OngModel = require('../models/ongModel');
const PerfilOngModel = require('../models/perfilongModel');
const db = require('../config/database');
const admin = require('firebase-admin');

class PerfilOngController {

  // ----------------------------- GET PROFILE -----------------------------
  static async getProfile(req, res) {
    try {
      const firebaseUid = req.userId;

      const profile = await PerfilOngModel.getCompleteProfile(firebaseUid);
      if (!profile) return res.status(404).json({ error: 'ONG não encontrada' });

      return res.json(profile);

    } catch (err) {
      console.error('Erro ao buscar perfil da ONG:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // ----------------------------- UPDATE PROFILE -----------------------------
  static async updateProfile(req, res) {
    try {
      const firebaseUid = req.userId;

      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });

      const {
        nome_ong,
        causas_atuacao,
        classificacao,
        endereco,
        email,
        telefone,
        website,
        facebook,
        instagram,
        descricao,
        nome_responsavel,
        cargo_responsavel,
        cnpj,
        causa,
        estado
      } = req.body || {};

      // ----------------------- UPDATE EMAIL -----------------------
      const novoEmail = email ? email.trim() : null;

      if (novoEmail && novoEmail !== ong.email) {
        const [rows] = await db.execute(
          'SELECT id_ong FROM ong WHERE email = ? AND id_ong != ?',
          [novoEmail, ong.id_ong]
        );

        if (rows.length > 0) {
          return res.status(409).json({ error: 'Email já em uso' });
        }

        // Atualizar no Firebase Auth
        await admin.auth().updateUser(firebaseUid, { email: novoEmail });

        // Atualizar no banco de dados
        await db.execute(
          'UPDATE ong SET email = ? WHERE id_ong = ?',
          [novoEmail, ong.id_ong]
        );
      }

      // ----------------------- UPDATE TABELA ONG -----------------------
      // Preparar dados para atualização na tabela ong
      const updateOngData = {
        nome_ong: nome_ong ?? ong.nome_ong,
        descricao: descricao ?? ong.descricao,
        endereco: endereco ?? ong.endereco,
        classificacao: classificacao ?? ong.classificacao,
        nome_responsavel: nome_responsavel ?? ong.nome_responsavel,
        cargo_responsavel: cargo_responsavel ?? ong.cargo_responsavel,
        cnpj: cnpj ?? ong.cnpj,
        causa: causa ?? ong.causa,
        estado: estado ?? ong.estado,
        telefone: telefone ?? ong.telefone,
        website: website ?? ong.website,
        facebook: facebook ?? ong.facebook,
        instagram: instagram ?? ong.instagram
      };

      // Remover campos undefined
      Object.keys(updateOngData).forEach(key => {
        if (updateOngData[key] === undefined) {
          delete updateOngData[key];
        }
      });

      await OngModel.update(ong.id_ong, updateOngData);

      // ----------------------- UPDATE PERFIL_ONG (CAUSAS) -----------------------
      const existingPerfil = await PerfilOngModel.findByOngId(ong.id_ong);

      if (existingPerfil) {
        // Atualizar causas
        await PerfilOngModel.update(ong.id_ong, causas_atuacao);
      } else {
        // Criar perfil_ong se não existir
        await PerfilOngModel.create(ong.id_ong, causas_atuacao);
      }

      // Buscar perfil atualizado
      const updated = await PerfilOngModel.getCompleteProfile(firebaseUid);
      return res.json(updated);

    } catch (err) {
      console.error('Erro ao atualizar perfil da ONG:', err);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  // ----------------------------- GET CONTACT INFO -----------------------------
  static async getContactInfo(req, res) {
    try {
      const firebaseUid = req.userId;

      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });

      const contactInfo = await PerfilOngModel.getContactInfo(ong.id_ong);
      return res.json(contactInfo || {});

    } catch (err) {
      console.error('Erro ao buscar informações de contato:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // ----------------------------- UPDATE CONTACT INFO -----------------------------
  static async updateContactInfo(req, res) {
    try {
      const firebaseUid = req.userId;

      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });

      const { telefone, email, website, facebook, instagram } = req.body;

      // Atualizar email se fornecido e diferente
      if (email && email !== ong.email) {
        // Verificar se email já está em uso
        const [rows] = await db.execute(
          'SELECT id_ong FROM ong WHERE email = ? AND id_ong != ?',
          [email, ong.id_ong]
        );

        if (rows.length > 0) {
          return res.status(409).json({ error: 'Email já em uso' });
        }

        // Atualizar no Firebase Auth
        await admin.auth().updateUser(firebaseUid, { email });

        // Atualizar no banco
        await db.execute(
          'UPDATE ong SET email = ? WHERE id_ong = ?',
          [email, ong.id_ong]
        );
      }

      // Atualizar outros contatos
      await PerfilOngModel.updateContactInfo(ong.id_ong, {
        telefone: telefone || null,
        website: website || null,
        facebook: facebook || null,
        instagram: instagram || null
      });

      return res.json({ message: 'Informações de contato atualizadas com sucesso' });

    } catch (err) {
      console.error('Erro ao atualizar informações de contato:', err);
      return res.status(500).json({ error: 'Erro ao atualizar contato' });
    }
  }
}

module.exports = PerfilOngController;