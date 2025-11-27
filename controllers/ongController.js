// controllers/ongController.js
const db = require('../config/database');
const OngModel = require('../models/ongModel');
const PerfilOngModel = require('../models/perfilongModel');
const admin = require('firebase-admin');

class OngController {
  // GET /api/ong/check-email?email=...
  static async checkEmail(req, res) {
    try {
      const email = (req.query.email || '').trim();
      if (!email) return res.status(400).json({ error: 'Email requerido' });

      const exists = await OngModel.checkEmailExists(email);
      return res.json({ exists });
    } catch (err) {
      console.error('checkEmail error', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // POST /api/ong/register
  static async registerOng(req, res) {
    try {
      console.log("📥 Dados recebidos para registro da ONG:", req.body);

      // ✅ CORREÇÃO: Aceitar tanto 'uid' quanto 'firebase_uid'
      const uid = req.body.uid || req.body.firebase_uid;
      
      const { 
        email, 
        nome_ong, 
        estado,
        // Campos opcionais da tabela ONG
        perfil_oficial,
        classificacao,
        nome_responsavel,
        cargo_responsavel,
        cnpj,
        descricao,
        endereco,
        causa,
        // Campos de contato
        telefone,
        website,
        facebook,
        instagram
      } = req.body;

      // 🔹 VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS (com uid corrigido)
      const camposObrigatorios = ['email', 'nome_ong'];
      const camposFaltantes = camposObrigatorios.filter(campo => {
        const value = req.body[campo];
        return value === undefined || value === null || value === '';
      });

      // ✅ Validar uid separadamente
      if (!uid) {
        camposFaltantes.push('uid');
      }

      if (camposFaltantes.length > 0) {
        console.log("❌ Campos obrigatórios faltando:", camposFaltantes);
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes.',
          missingFields: camposFaltantes 
        });
      }

      // Verificar se email já existe
      if (await OngModel.checkEmailExists(email)) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      // Verificar se ONG já existe pelo Firebase UID
      const existingOng = await OngModel.findByFirebaseUid(uid);
      if (existingOng) {
        return res.status(409).json({ error: 'ONG já registrada' });
      }

      // 🔹 CRIAR ONG NA TABELA PRINCIPAL
      console.log("💾 Criando ONG na tabela principal...");
      const ongId = await OngModel.create({
        firebase_uid: uid, // ✅ Usando o uid corrigido
        email: email,
        nome_ong: nome_ong,
        estado: estado || null, // ✅ Permitir estado null
        // Campos opcionais
        perfil_oficial: perfil_oficial || null,
        classificacao: classificacao || null,
        nome_responsavel: nome_responsavel || null,
        cargo_responsavel: cargo_responsavel || null,
        cnpj: cnpj || null,
        descricao: descricao || null,
        endereco: endereco || null,
        causa: causa || null,
        // Campos de contato
        telefone: telefone || null,
        website: website || null,
        facebook: facebook || null,
        instagram: instagram || null
      });

      console.log("✅ ONG criada com ID:", ongId);

      // 🔹 CRIAR PERFIL DA ONG (se necessário e se tiver dados)
      try {
        // Só criar perfil se tiver dados específicos para o perfil
        const temDadosPerfil = descricao || classificacao || endereco || causa;
        if (temDadosPerfil) {
          await PerfilOngModel.create({
            id_ong: ongId,
            resumo: descricao || null,
            causas_atuacao: causa || null,
            classificacao: classificacao || null,
            endereco: endereco || null
          });
          console.log("✅ Perfil da ONG criado");
        } else {
          console.log("ℹ️  Nenhum dado específico para perfil, criando apenas registro básico");
          // Criar registro básico no perfil_ong apenas com id_ong
          await PerfilOngModel.create({
            id_ong: ongId,
            resumo: null,
            causas_atuacao: null,
            classificacao: null,
            endereco: null
          });
        }
      } catch (profileError) {
        console.log("⚠️ Erro ao criar perfil da ONG:", profileError.message);
        // Não falhar o registro principal por causa do perfil
      }

      return res.status(201).json({ 
        message: 'ONG registrada com sucesso', 
        ongId: ongId,
        id_ong: ongId
      });

    } catch (err) {
      console.error('❌ Erro no registro da ONG:', err);
      return res.status(500).json({ error: 'Erro interno no servidor: ' + err.message });
    }
  }

  // PUT /api/ong/update-email (autenticado)
  static async updateEmail(req, res) {
    try {
      const firebaseUid = req.userId;
      const novoEmail = (req.body.email || '').trim();
      if (!novoEmail) return res.status(400).json({ error: 'Email requerido' });

      // encontra ONG
      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });

      // verifica duplicado
      if (await OngModel.checkEmailExists(novoEmail, ong.id_ong)) {
        return res.status(409).json({ error: 'Email já em uso' });
      }

      // atualiza no Firebase (admin SDK)
      await admin.auth().updateUser(firebaseUid, { email: novoEmail });

      // atualiza no MySQL
      await db.execute('UPDATE ong SET email = ? WHERE id_ong = ?', [novoEmail, ong.id_ong]);

      const [updated] = await db.execute('SELECT id_ong, email, nome_ong FROM ong WHERE id_ong = ?', [ong.id_ong]);
      return res.json({ message: 'Email atualizado', ong: updated[0] });
    } catch (err) {
      console.error('updateEmail error', err);
      return res.status(500).json({ error: 'Erro ao atualizar email' });
    }
  }

  // GET /api/ong/profile (autenticado)
  static async getOngProfile(req, res) {
  try {
    const firebaseUid = req.userId;

    const ong = await OngModel.findByFirebaseUid(firebaseUid);
    if (!ong) 
      return res.status(404).json({ error: "ONG não encontrada" });

    return res.json(ong);

  } catch (err) {
    console.error("getOngProfile error", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}


  // GET /api/ong/:id (público - para visualização de perfil público)
  static async getOngPublicProfile(req, res) {
    try {
      const ongId = req.params.id;
      const ong = await OngModel.findById(ongId);
      
      if (!ong) {
        return res.status(404).json({ error: 'ONG não encontrada' });
      }

      // Retornar apenas informações públicas
      const publicProfile = {
        id_ong: ong.id_ong,
        nome_ong: ong.nome_ong,
        classificacao: ong.classificacao,
        descricao: ong.descricao,
        causa: ong.causa,
        estado: ong.estado,
        website: ong.website,
        facebook: ong.facebook,
        instagram: ong.instagram
      };

      return res.json(publicProfile);
    } catch (err) {
      console.error('getOngPublicProfile error', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // PUT /api/ong/profile (autenticado - atualizar perfil completo)
  static async updateProfile(req, res) {
    try {
      const firebaseUid = req.userId;
      const ong = await OngModel.findByFirebaseUid(firebaseUid);
      
      if (!ong) {
        return res.status(404).json({ error: 'ONG não encontrada' });
      }

      const {
        nome_ong,
        classificacao,
        descricao,
        endereco,
        causa,
        nome_responsavel,
        cargo_responsavel,
        cnpj,
        telefone,
        website,
        facebook,
        instagram
      } = req.body;

      // Atualizar tabela ONG
      await OngModel.update(ong.id_ong, {
        nome_ong: nome_ong || null,
        classificacao: classificacao || null,
        descricao: descricao || null,
        endereco: endereco || null,
        causa: causa || null,
        nome_responsavel: nome_responsavel || null,
        cargo_responsavel: cargo_responsavel || null,
        cnpj: cnpj || null,
        telefone: telefone || null,
        website: website || null,
        facebook: facebook || null,
        instagram: instagram || null
      });

      // Buscar perfil atualizado
      const updatedProfile = await PerfilOngModel.getCompleteProfile(firebaseUid);

      return res.json({
        message: 'Perfil atualizado com sucesso',
        profile: updatedProfile
      });

    } catch (err) {
      console.error('updateProfile error', err);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  
}

module.exports = OngController;