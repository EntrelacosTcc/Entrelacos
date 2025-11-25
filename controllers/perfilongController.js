// controllers/perfilongController.js
const OngModel = require('../models/ongModel');
const PerfilOngModel = require('../models/perfilongModel');
const db = require('../config/database');
const admin = require('firebase-admin');

class PerfilOngController {

  // ----------------------------- GET PROFILE -----------------------------
  static async getProfile(req, res) {
    try {
      const firebaseUid = req.userId; // Usando req.userId do middleware auth

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
      const firebaseUid = req.userId; // Usando req.userId do middleware auth

      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });

      const {
        nome_ong,
        resumo,
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

        await admin.auth().updateUser(firebaseUid, { email: novoEmail });

        await db.execute(
          'UPDATE ong SET email = ? WHERE id_ong = ?',
          [novoEmail, ong.id_ong]
        );
      }

      // ----------------------- UPDATE TABELA ONG -----------------------
      await OngModel.update(ong.id_ong, {
        nome_ong: nome_ong ?? null,
        descricao: descricao ?? null,
        endereco: endereco ?? null,
        classificacao: classificacao ?? null,
        nome_responsavel: nome_responsavel ?? null,
        cargo_responsavel: cargo_responsavel ?? null,
        cnpj: cnpj ?? null,
        causa: causa ?? null,
        estado: estado ?? null
      });

      // ----------------------- UPDATE OU CREATE PERFIL -----------------------
      const existing = await PerfilOngModel.findByOngId(ong.id_ong);

      if (existing) {
        await PerfilOngModel.update(ong.id_ong, {
          resumo,
          causas_atuacao,
          classificacao,
          endereco
        });
      } else {
        await PerfilOngModel.create({
          id_ong: ong.id_ong,
          resumo,
          causas_atuacao,
          classificacao,
          endereco
        });
      }

      // ----------------------- UPDATE CONTATO -----------------------
      if (telefone || email || website || facebook || instagram) {
        await PerfilOngModel.updateContactInfo(ong.id_ong, {
          telefone: telefone || null,
          email: email || null,
          website: website || null,
          facebook: facebook || null,
          instagram: instagram || null
        });
      }

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
      const firebaseUid = req.userId; // Usando req.userId do middleware auth

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
      const firebaseUid = req.userId; // Usando req.userId do middleware auth

      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });

      const { telefone, email, website, facebook, instagram } = req.body;

      await PerfilOngModel.updateContactInfo(ong.id_ong, {
        telefone: telefone || null,
        email: email || null,
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