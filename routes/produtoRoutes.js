const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// GET - Todos os produtos
router.get('/', produtoController.getAll);

// GET - Produto por ID
router.get('/:id_produto', produtoController.getById);

// POST - Criar novo produto
router.post('/', produtoController.create);

// PUT - Atualizar produto
router.put('/:id_produto', produtoController.update);

// DELETE - Deletar produto
router.delete('/:id_produto', produtoController.delete);

module.exports = router;