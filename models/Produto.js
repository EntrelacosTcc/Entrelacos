const db = require('../config/database');

class Produto {
    static getAll(callback) {
        db.query('SELECT * FROM produto ORDER BY nome_produto', (error, results) => {
            if (error) return callback(error);
            
            // Converter campos JSON se necessário
            const produtos = results.map(produto => {
                if (produto.especificacoes && typeof produto.especificacoes === 'string') {
                    try {
                        produto.especificacoes = JSON.parse(produto.especificacoes);
                    } catch (e) {
                        console.error('Erro ao parsear especificacoes:', e);
                        produto.especificacoes = {};
                    }
                }
                return produto;
            });
            
            callback(null, produtos);
        });
    }
    
    static getById(id_produto, callback) {
        db.query('SELECT * FROM produto WHERE id_produto = ?', [id_produto], (error, results) => {
            if (error) return callback(error);
            
            if (results.length === 0) {
                return callback(null, null);
            }
            
            const produto = results[0];
            
            // Converter campos JSON se necessário
            if (produto.especificacoes && typeof produto.especificacoes === 'string') {
                try {
                    produto.especificacoes = JSON.parse(produto.especificacoes);
                } catch (e) {
                    console.error('Erro ao parsear especificacoes:', e);
                    produto.especificacoes = {};
                }
            }
            
            callback(null, produto);
        });
    }
    
    static create(novoProduto, callback) {
        // Converter especificações para JSON string se for objeto
        if (novoProduto.especificacoes && typeof novoProduto.especificacoes === 'object') {
            novoProduto.especificacoes = JSON.stringify(novoProduto.especificacoes);
        }
        
        db.query('INSERT INTO produto SET ?', novoProduto, callback);
    }
    
    static update(id_produto, produtoData, callback) {
        // Converter especificações para JSON string se for objeto
        if (produtoData.especificacoes && typeof produtoData.especificacoes === 'object') {
            produtoData.especificacoes = JSON.stringify(produtoData.especificacoes);
        }
        
        db.query('UPDATE produto SET ? WHERE id_produto = ?', [produtoData, id_produto], callback);
    }
    
    static delete(id_produto, callback) {
        db.query('DELETE FROM produto WHERE id_produto = ?', [id_produto], callback);
    }
}

module.exports = Produto;