const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController');

// Criar vaga
router.post('/vagas', vagaController.criar);

// Listar vagas
router.get('/vagas', vagaController.listar);

// Buscar vaga específica
router.get('/vagas/:id', vagaController.buscar);


// 📌 Rota: listar vagas por ONG
router.get("/ong/:id_ong", async (req, res) => {
    try {
        const vagas = await Vaga.listarPorOng(req.params.id_ong);
        res.json(vagas);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar vagas da ONG" });
    }
});

module.exports = router;
