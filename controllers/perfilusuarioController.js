// controllers/perfilusuarioController.js
const UserModel = require('../models/usuarioModel');
const ProfileModel = require('../models/perfilusuarioModel');
const db = require('../config/database');
const admin = require('firebase-admin');

class ProfileController {

  // ----------------------------- GET PROFILE -----------------------------
  static async getProfile(req, res) {
    try {
      const firebaseUid = req.userId;

      const profile = await ProfileModel.getCompleteProfile(firebaseUid);
      if (!profile) return res.status(404).json({ error: 'Usuário não encontrado' });

      return res.json(profile);

    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // ----------------------------- UPDATE PROFILE -----------------------------
  static async updateProfile(req, res) {
    try {
      const firebaseUid = req.userId;

      const user = await UserModel.findByFirebaseUid(firebaseUid);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const {
        nome,
        telefone,
        cpf,
        tags,
        descricao,
        foto,
        data_nascimento,
        email
      } = req.body || {};

      // ----------------------- UPDATE EMAIL -----------------------
      const novoEmail = email ? email.trim() : null;

      if (novoEmail && novoEmail !== user.email) {
        const [rows] = await db.execute(
          'SELECT id_usuario FROM usuario WHERE email = ? AND id_usuario != ?',
          [novoEmail, user.id_usuario]
        );

        if (rows.length > 0) {
          return res.status(409).json({ error: 'Email já em uso' });
        }

        await admin.auth().updateUser(firebaseUid, { email: novoEmail });

        await db.execute(
          'UPDATE usuario SET email = ? WHERE id_usuario = ?',
          [novoEmail, user.id_usuario]
        );
      }

      // normalização da data
      const dataNascimentoNormalized =
        data_nascimento && data_nascimento.trim() !== '' ? data_nascimento : null;

      // ----------------------- UPDATE TABELA USUARIO -----------------------
      await UserModel.update(user.id_usuario, {
        nome: nome ?? null,
        data_nascimento: dataNascimentoNormalized
      });

      // ----------------------- UPDATE OU CREATE PERFIL -----------------------
      const existing = await ProfileModel.findByUserId(user.id_usuario);

      if (existing) {
        await ProfileModel.update(user.id_usuario, {
          nome: nome ?? null,
          telefone,
          cpf,
          tags,
          descricao,
          foto
        });
      } else {
        await ProfileModel.create({
          id_usuario: user.id_usuario,
          nome: nome ?? null,
          telefone,
          cpf,
          tags,
          descricao,
          foto
        });
      }

      const updated = await ProfileModel.getCompleteProfile(firebaseUid);
      return res.json(updated);

    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  // ----------------------------- UPDATE FOTO -----------------------------
  static async updatePhoto(req, res) {
    try {
      const firebaseUid = req.userId;

      const user = await UserModel.findByFirebaseUid(firebaseUid);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const { foto } = req.body;
      if (!foto) return res.status(400).json({ error: 'Nenhuma foto enviada' });

      const existing = await ProfileModel.findByUserId(user.id_usuario);

      if (existing) {
        await ProfileModel.update(user.id_usuario, { foto });
      } else {
        await ProfileModel.create({
          id_usuario: user.id_usuario,
          nome: user.nome,
          foto
        });
      }

      return res.json({ message: 'Foto atualizada' });

    } catch (err) {
      console.error('Erro ao atualizar foto:', err);
      return res.status(500).json({ error: 'Erro ao atualizar foto' });
    }
  }
}

module.exports = ProfileController;
