const Vaga = require('../models/Vaga');

module.exports = {
    
    async criar(req, res) {
        try {
            const vaga = await Vaga.criar(req.body);
            return res.status(201).json({ message: "Vaga criada com sucesso!", vaga });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar vaga", details: error });
        }
    },

    async listar(req, res) {
    try {
        const vagas = await Vaga.listarTodas();
        res.json(vagas);
    } catch (err) { 
        console.log("ERRO AO LISTAR VAGAS:", err);
        res.status(500).json({ error: err });
    }
},


    async buscar(req, res) {
        try {
            const vaga = await Vaga.buscarPorId(req.params.id);

            if (!vaga) {
                return res.status(404).json({ error: "Vaga não encontrada" });
            }

            return res.json(vaga);

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar vaga" });
        }
    }
};
