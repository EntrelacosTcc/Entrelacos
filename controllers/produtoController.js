const Produto = require('../models/Produto');

const produtoController = {
    // GET - Todos os produtos
    getAll: (req, res) => {
        Produto.getAll((error, produtos) => {
            if (error) {
                console.error('Erro ao buscar produtos:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            res.json(produtos);
        });
    },

    // GET - Produto por ID
    getById: (req, res) => {
        const productId = req.params.id_produto;
        
        // Validar ID
        if (!productId || isNaN(productId)) {
            return res.status(400).json({ error: 'ID do produto inválido' });
        }
        
        Produto.getById(productId, (error, produto) => {
            if (error) {
                console.error('Erro ao buscar produto:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            res.json(produto);
        });
    },

    // POST - Criar novo produto
    create: (req, res) => {
        const { nome_produto, descricao, caracteristicas, preco, categoria, imagem, imagem_lateral, especificacoes } = req.body;
        
        // Validação básica
        if (!nome_produto || !preco) {
            return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
        }
        
        const novoProduto = {
            nome_produto,
            descricao,
            caracteristicas,
            preco,
            categoria,
            imagem,
            imagem_lateral,
            especificacoes
        };
        
        Produto.create(novoProduto, (error, results) => {
            if (error) {
                console.error('Erro ao criar produto:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            
            res.status(201).json({ 
                success: true, 
                message: 'Produto criado com sucesso',
                id_produto: results.insertId 
            });
        });
    },

    // PUT - Atualizar produto
    update: (req, res) => {
        const productId = req.params.id_produto;
        const produtoData = req.body;
        
        if (!productId || isNaN(productId)) {
            return res.status(400).json({ error: 'ID do produto inválido' });
        }
        
        Produto.update(productId, produtoData, (error, results) => {
            if (error) {
                console.error('Erro ao atualizar produto:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            res.json({ 
                success: true, 
                message: 'Produto atualizado com sucesso'
            });
        });
    },

    // DELETE - Deletar produto
    delete: (req, res) => {
        const productId = req.params.id_produto;
        
        if (!productId || isNaN(productId)) {
            return res.status(400).json({ error: 'ID do produto inválido' });
        }
        
        Produto.delete(productId, (error, results) => {
            if (error) {
                console.error('Erro ao deletar produto:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            res.json({ 
                success: true, 
                message: 'Produto deletado com sucesso'
            });
        });
    }
};

module.exports = produtoController;