// routes/perfilongRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const PerfilOngController = require('../controllers/perfilongController'); // ✅ Verifique este caminho

// Todas as rotas requerem autenticação
router.use(auth);

// Perfil da ONG
router.get('/', PerfilOngController.getProfile);
router.put('/', PerfilOngController.updateProfile);

// Contatos da ONG
router.get('/contact', PerfilOngController.getContactInfo);
router.put('/contact', PerfilOngController.updateContactInfo);

module.exports = router;