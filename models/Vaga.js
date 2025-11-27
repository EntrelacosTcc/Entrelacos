const db = require('../config/database');

class Vaga {

    // Criar vaga
    static async criar(data) {

        // Buscar contato real da ONG
        const [ongRows] = await db.query(
            "SELECT email, telefone FROM ong WHERE id_ong = ?",
            [data.id_ong]
        );

        if (!ongRows || ongRows.length === 0) {
            throw new Error("ONG não encontrada para o id_ong enviado.");
        }

        const ong = ongRows[0];

        // SQL completamente alinhado com 16 colunas e 16 valores
        const sql = `
            INSERT INTO vaga (
                titulo, visao_geral, sobre_a_vaga, status,
                data_criacao, imagem_url, formato_trabalho,
                tarefas_voluntario, requisitos, classificacao_etaria,
                horas, contato_email, contato_telefone, endereco, data_escolhida,
                id_usuario, id_ong
            ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            data.titulo,                // 1
            data.visao_geral,           // 2
            data.sobre_a_vaga,          // 3
            data.status,                // 4
            data.imagem_url,            // 5
            data.formato_trabalho,      // 6
            data.tarefas_voluntario,    // 7
            data.requisitos,            // 8
            data.classificacao_etaria,  // 9
            data.horas,                 // 10
            ong.email,                  // 11
            ong.telefone,               // 12
            data.endereco,              // 13
            data.data_escolhida,        // 14
            data.id_usuario,            // 15
            data.id_ong                 // 16
        ];

        try {
            const [result] = await db.query(sql, valores);
            return result;
        } catch (err) {
            console.error("ERRO AO CRIAR VAGA:", err);
            throw err;
        }
    }

    // Listar vagas de uma ONG
    static async listarPorOng(id_ong) {
        try {
            const sql = `
                SELECT 
                    id_vaga,
                    titulo,
                    visao_geral,
                    imagem_url,
                    id_ong
                FROM vaga
                WHERE id_ong = ?
            `;

            const [rows] = await db.query(sql, [id_ong]);
            return rows;

        } catch (err) {
            console.error("ERRO AO LISTAR VAGAS DA ONG:", err);
            throw err;
        }
    }

    // Buscar vaga por ID
    static async buscarPorId(id) {
        try {
            const sql = `
                SELECT 
                    vaga.*, 
                    ong.nome_ong AS nome_ong,
                    ong.email AS ong_email,
                    ong.telefone AS ong_telefone
                FROM vaga
                JOIN ong ON vaga.id_ong = ong.id_ong
                WHERE vaga.id_vaga = ?
            `;

            const [rows] = await db.query(sql, [id]);
            return rows[0];

        } catch (err) {
            console.error("ERRO AO BUSCAR VAGA POR ID:", err);
            throw err;
        }
    }

    // Listar todas as vagas
    static async listarTodas() {
        try {
            const sql = `
                SELECT 
                    vaga.*, 
                    ong.nome_ong AS nome_ong,
                    ong.email AS ong_email,
                    ong.telefone AS ong_telefone
                FROM vaga
                JOIN ong ON vaga.id_ong = ong.id_ong
            `;

            const [rows] = await db.query(sql);
            return rows;

        } catch (err) {
            console.error("ERRO AO LISTAR VAGAS:", err);
            throw err;
        }
    }
}

module.exports = Vaga;
