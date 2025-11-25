// routes/ongRoutes.js
const express = require('express');
const router = express.Router();
const OngController = require('../controllers/ongController');
const auth = require('../middlewares/auth');

// Rotas públicas
router.get('/check-email', OngController.checkEmail);
router.post('/register', OngController.registerOng);

// Rotas protegidas
router.get('/profile', auth, OngController.getOngProfile);
router.put('/update-email', auth, OngController.updateEmail);

module.exports = router;