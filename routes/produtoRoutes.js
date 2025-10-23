const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const mysql = require('mysql2/promise');

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

const pool = mysql.createPool({
  host: process.env.DB_HOST, // precisa estar no Vercel
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produtos');
    res.json(rows);
  } catch (err) {
    console.error(err); // importante para ver no log do Vercel
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


module.exports = router;