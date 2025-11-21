const db = require('../config/database');
const UserModel = require('../models/usuarioModel');
const admin = require('firebase-admin');

class UsuarioController {
  // GET /api/usuario/check-email?email=...
  static async checkEmail(req, res) {
    try {
      const email = (req.query.email || '').trim();
      if (!email) return res.status(400).json({ error: 'Email requerido' });

      const [rows] = await db.execute('SELECT id_usuario FROM usuario WHERE email = ?', [email]);
      return res.json({ exists: rows.length > 0 });
    } catch (err) {
      console.error('checkEmail error', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // PUT /api/usuario/update-email  (autenticado)
  // Body: { email: 'novo@exemplo.com' }
  static async updateEmail(req, res) {
    try {
      const firebaseUid = req.userId;
      const novoEmail = (req.body.email || '').trim();
      if (!novoEmail) return res.status(400).json({ error: 'Email requerido' });

      // verifica duplicado
      const [rows] = await db.execute('SELECT id_usuario FROM usuario WHERE email = ? AND firebase_uid != ?', [novoEmail, firebaseUid]);
      if (rows.length > 0) return res.status(409).json({ error: 'Email já em uso' });

      // encontra usuário
      const user = await UserModel.findByFirebaseUid(firebaseUid);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      // atualiza no Firebase (admin SDK)
      await admin.auth().updateUser(firebaseUid, { email: novoEmail });

      // atualiza no MySQL
      await db.execute('UPDATE usuario SET email = ? WHERE id_usuario = ?', [novoEmail, user.id_usuario]);

      // opcional: retornar perfil atualizado
      const [updated] = await db.execute('SELECT id_usuario, email, nome FROM usuario WHERE id_usuario = ?', [user.id_usuario]);
      return res.json({ message: 'Email atualizado', user: updated[0] });
    } catch (err) {
      console.error('updateEmail error', err);
      return res.status(500).json({ error: 'Erro ao atualizar email' });
    }
  }
}

module.exports = UsuarioController;
