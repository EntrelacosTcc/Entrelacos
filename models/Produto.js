const pool = require('../config/database'); // já configurado com pool seguro

class Produto {
  static async getAll() {
    try {
      const [results] = await pool.query('SELECT * FROM produto ORDER BY nome_produto');
      
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

      return produtos;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async getById(id_produto) {
    try {
      const [results] = await pool.query('SELECT * FROM produto WHERE id_produto = ?', [id_produto]);
      if (results.length === 0) return null;

      const produto = results[0];
      if (produto.especificacoes && typeof produto.especificacoes === 'string') {
        try {
          produto.especificacoes = JSON.parse(produto.especificacoes);
        } catch (e) {
          console.error('Erro ao parsear especificacoes:', e);
          produto.especificacoes = {};
        }
      }
      return produto;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }

  static async create(novoProduto) {
    try {
      if (novoProduto.especificacoes && typeof novoProduto.especificacoes === 'object') {
        novoProduto.especificacoes = JSON.stringify(novoProduto.especificacoes);
      }
      const [result] = await pool.query('INSERT INTO produto SET ?', [novoProduto]);
      return result;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  static async update(id_produto, produtoData) {
    try {
      if (produtoData.especificacoes && typeof produtoData.especificacoes === 'object') {
        produtoData.especificacoes = JSON.stringify(produtoData.especificacoes);
      }
      const [result] = await pool.query('UPDATE produto SET ? WHERE id_produto = ?', [produtoData, id_produto]);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  static async delete(id_produto) {
    try {
      const [result] = await pool.query('DELETE FROM produto WHERE id_produto = ?', [id_produto]);
      return result;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
}

module.exports = Produto;