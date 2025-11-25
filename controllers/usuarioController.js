const db = require('../config/database');
const UserModel = require('../models/usuarioModel');
const admin = require('firebase-admin');

class UsuarioController {

  // ==========================================
  // GET /api/usuario/check-email?email=...
  // ==========================================
  static async checkEmail(req, res) {
    try {
      const email = (req.query.email || '').trim();
      if (!email) {
        return res.status(400).json({ error: 'Email requerido' });
      }

      const [rows] = await db.execute(
        'SELECT id_usuario FROM usuario WHERE email = ?',
        [email]
      );

      return res.json({ exists: rows.length > 0 });

    } catch (err) {
      console.error('checkEmail error', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // ==========================================
  // POST /api/usuario
  // Body: { uid, email, nome }
  // ==========================================
  static async registerUser(req, res) {
    try {
      const { uid, email, nome } = req.body;

      if (!uid || !email || !nome) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      // Verificar duplicidade de e-mail
      const [exists] = await db.execute(
        'SELECT id_usuario FROM usuario WHERE email = ?',
        [email]
      );

      if (exists.length > 0) {
        return res.status(409).json({ error: 'E-mail já cadastrado' });
      }

      // Inserir novo usuário
      const sql = `
        INSERT INTO usuario (firebase_uid, nome, email)
        VALUES (?, ?, ?)
      `;

      const [result] = await db.execute(sql, [uid, nome, email]);

      return res.json({
        message: "Usuário registrado com sucesso",
        user: {
          id_usuario: result.insertId,
          nome,
          email,
          firebase_uid: uid
        }
      });

    } catch (err) {
      console.error("registerUser error", err);
      return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  }

  // ==========================================
  // PUT /api/usuario/update-email
  // Header: Authorization: Bearer <token>
  // Body: { email }
  // ==========================================
  static async updateEmail(req, res) {
    try {
      const firebaseUid = req.userId; // vem do middleware auth
      const novoEmail = (req.body.email || '').trim();

      if (!novoEmail) {
        return res.status(400).json({ error: 'Email requerido' });
      }

      // verificar se já existe para outro usuário
      const [rows] = await db.execute(
        'SELECT id_usuario FROM usuario WHERE email = ? AND firebase_uid != ?',
        [novoEmail, firebaseUid]
      );

      if (rows.length > 0) {
        return res.status(409).json({ error: 'Email já em uso' });
      }

      // obter usuário
      const user = await UserModel.findByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // atualizar no Firebase Admin
      await admin.auth().updateUser(firebaseUid, { email: novoEmail });

      // atualizar no MySQL
      await db.execute(
        'UPDATE usuario SET email = ? WHERE id_usuario = ?',
        [novoEmail, user.id_usuario]
      );

      const [updated] = await db.execute(
        'SELECT id_usuario, email, nome FROM usuario WHERE id_usuario = ?',
        [user.id_usuario]
      );

      return res.json({
        message: 'Email atualizado',
        user: updated[0]
      });

    } catch (err) {
      console.error('updateEmail error', err);
      return res.status(500).json({ error: 'Erro ao atualizar email' });
    }
  }
}

module.exports = UsuarioController;
