const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

// rota pública para checar email (GET)
router.get('/check-email', UsuarioController.checkEmail);

// rotas protegidas (exemplo: atualizar email a partir do painel — usamos auth)
router.put('/update-email', auth, UsuarioController.updateEmail); // opcional

module.exports = router;
