// public/js/produtos.js

// Carregar produtos via API
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        const produtos = await response.json();
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        
        // Exibir mensagem de erro para o usuário
        const container = document.getElementById('lista-produtos');
        container.innerHTML = `
            <div class="error-message">
                <p>Erro ao carregar produtos. Por favor, recarregue a página.</p>
            </div>
        `;
    }
}

const pool = require('../db');

class Produto {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM produtos');
      return rows;
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      throw err;
    }
  }
}

module.exports = Produto;

function exibirProdutos(produtos) {
    const container = document.getElementById('lista-produtos');
    
    // Limpar container antes de adicionar novos produtos
    container.innerHTML = '';
    
    if (produtos.length === 0) {
        container.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
        return;
    }
    
    produtos.forEach(produto => {
        const card = criarCardProduto(produto);
        container.appendChild(card);
    });
}

function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'card-produto';
    
    // CORREÇÃO: Garantir que o preço seja tratado como número
    const preco = typeof produto.preco === 'number' 
        ? produto.preco 
        : parseFloat(produto.preco) || 0;
    
    
    // CORREÇÃO: Truncar descrição se for muito longa
    const descricao = produto.descricao 
        ? (produto.descricao.length > 100 
            ? produto.descricao.substring(0, 100) + '...' 
            : produto.descricao)
        : 'Sem descrição';
    
    card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome || 'Produto sem nome'}</h3>
        <p class="categoria">${produto.categoria || 'Sem categoria'}</p>
        <p class="preco">R$ ${preco.toFixed(2)}</p>
        <p class="descricao-curta">${descricao}</p>
        <a href="/produto/${produto.id_produto}" class="btn-ver-mais">Ver Detalhes</a>
    `;
    
    return card;
}

// Iniciar quando a página carregar
if (document.getElementById('lista-produtos')) {
    document.addEventListener('DOMContentLoaded', carregarProdutos);
}