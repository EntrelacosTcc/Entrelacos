const express = require('express');
const router = express.Router();
const faleconoscoController = require('../controllers/faleconoscoController');

// ⭐ ROTA PRINCIPAL - PARA O FORMULÁRIO FUNCIONAR
router.post('/', faleconoscoController.createMensagem);

// ⭐ ROTA SIMPLES PARA TESTE
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Fale Conosco está funcionando!',
    instruction: 'Envie uma requisição POST para /api/faleconosco com os dados do formulário'
  });
});

module.exports = router;