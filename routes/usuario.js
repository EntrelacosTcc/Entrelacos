const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

// rota pública para checar email
router.get('/check-email', UsuarioController.checkEmail);

// rota pública para registrar usuário
router.post('/', UsuarioController.registerUser);

// rota protegida (ex.: atualizar email)
router.put('/update-email', auth, UsuarioController.updateEmail);

module.exports = router;
