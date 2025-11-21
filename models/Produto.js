const db = require('../config/database');

class Produto {
    static async getAll(callback) {
        try {
            const [results] = await db.query('SELECT * FROM produto ORDER BY nome_produto');

            // Converter JSON se necessário
            const produtos = results.map(produto => {
                if (produto.especificacoes && typeof produto.especificacoes === 'string') {
                    try {
                        produto.especificacoes = JSON.parse(produto.especificacoes);
                    } catch (e) {
                        produto.especificacoes = {};
                    }
                }
                return produto;
            });

            callback(null, produtos);
        } catch (error) {
            callback(error);
        }
    }

    static async getById(id_produto, callback) {
        try {
            const [results] = await db.query('SELECT * FROM produto WHERE id_produto = ?', [id_produto]);

            if (results.length === 0) {
                return callback(null, null);
            }

            const produto = results[0];

            if (produto.especificacoes && typeof produto.especificacoes === 'string') {
                try {
                    produto.especificacoes = JSON.parse(produto.especificacoes);
                } catch (e) {
                    produto.especificacoes = {};
                }
            }

            callback(null, produto);
        } catch (error) {
            callback(error);
        }
    }

    static async create(novoProduto, callback) {
        try {
            if (novoProduto.especificacoes && typeof novoProduto.especificacoes === 'object') {
                novoProduto.especificacoes = JSON.stringify(novoProduto.especificacoes);
            }

            const [results] = await db.query('INSERT INTO produto SET ?', novoProduto);
            callback(null, results);
        } catch (error) {
            callback(error);
        }
    }

    static async update(id_produto, produtoData, callback) {
        try {
            if (produtoData.especificacoes && typeof produtoData.especificacoes === 'object') {
                produtoData.especificacoes = JSON.stringify(produtoData.especificacoes);
            }

            const [results] = await db.query(
                'UPDATE produto SET ? WHERE id_produto = ?',
                [produtoData, id_produto]
            );

            callback(null, results);
        } catch (error) {
            callback(error);
        }
    }

    static async delete(id_produto, callback) {
        try {
            const [results] = await db.query(
                'DELETE FROM produto WHERE id_produto = ?',
                [id_produto]
            );

            callback(null, results);
        } catch (error) {
            callback(error);
        }
    }
}

module.exports = Produto;
