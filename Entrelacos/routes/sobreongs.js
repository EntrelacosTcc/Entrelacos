const express = require('express');
const router = express.Router();
const sobreongsController = require('../controllers/sobreongsController');

// ⭐ ROTA PRINCIPAL - PARA O FORMULÁRIO FUNCIONAR
router.post('/', sobreongsController.createMensagem);

// ⭐ ROTA SIMPLES PARA TESTE
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Sobre Nos/ONGs está funcionando!',
    instruction: 'Envie uma requisição POST para /api/sobreongs com os dados do formulário'
  });
});

module.exports = router;