const express = require('express');
const router = express.Router();
const PerfilOngController = require('../controllers/perfilongController');
const authMiddleware = require('../middlewares/auth'); // Usando seu middleware existente

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas do perfil da ONG - agora sem :firebase_uid pois vem do token
router.get('/profile', PerfilOngController.getProfile);
router.put('/profile', PerfilOngController.updateProfile);
router.get('/contact', PerfilOngController.getContactInfo);
router.put('/contact', PerfilOngController.updateContactInfo);

module.exports = router;