// main.js - Código completo e corrigido

// Função para carregar a página inicial (se necessário)
function carregarHome() {
    // Esta função deve ser implementada se você estiver usando
    // uma abordagem de Single Page Application (SPA)
    // Se não estiver usando SPA, pode ser removida
    console.log("Página inicial carregada");
}

// Carregar detalhes do produto
async function carregarProduto(id_produto) {
    try {
        console.log("Carregando produto ID:", id_produto);
        
        const response = await fetch(`/api/produtos/${id_produto}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Produto não encontrado');
            } else {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
        }
        
        const produto = await response.json();
        console.log("Dados do produto recebidos:", produto);

        // Verificar se o produto precisa de seleção de tamanho
    const precisaTamanho = produto.precisa_tamanho && produto.tamanhos_disponiveis;
        
        // Preencher o template com os dados do produto
        document.getElementById('produto-container').innerHTML = `


              <section class="produto-container">

    <div class="produto-lateral">
      <div class="img-lateral">
        <img src="${produto.imagem_lateral}" alt="Camiseta Feminina - Verso">
      </div>
    </div>

    <div class="produto-principal">
      <img src="${produto.imagem}" alt="produto.nome">
    </div>

    <div class="produto-info">
      <h1>${produto.nome_produto}</h1>
      <h3>R$ ${Number(produto.preco).toFixed(2)}</h3>


      <h3 class="inline-p">Cor:</h3>
      <h3 class="inline-p cor-detail">Branca</h3>
      <div class="opcoes-cores">
        <input type="radio" name="cor" value="branca" class="cores" checked>
      </div>

      ${precisaTamanho ? gerarSeletorTamanhos(produto) : ''}
      <br>

      <button class="btn-comprar">Comprar</button>

    </div>
  </section>
        `;
        
        document.title = `${produto.nome_produto} - Minha Loja`;


    // Preencher descrição do produto
    preencherDescricaoProduto(produto);

// Função para processar os tamanhos
function processarTamanhos(tamanhosData) {
    if (!tamanhosData) return [];
    
    // Array
    if (Array.isArray(tamanhosData)) {
        return tamanhosData;
    }
    
    // Se é string JSON, tenta parsear
    if (typeof tamanhosData === 'string') {
        try {
            // Tenta parsear como JSON primeiro
            const parsed = JSON.parse(tamanhosData);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // Se falhar no parse JSON, trata como string separada por vírgulas
            console.log('Tentando converter string separada por vírgulas:', tamanhosData);
            return tamanhosData.split(',').map(t => t.trim());
        }
    }
    
    // Formato não reconhecido, retorna array vazio
    console.error('Formato de tamanhos não reconhecido:', tamanhosData);
    return [];
}

// Gerar seletor de tamanhos
function gerarSeletorTamanhos(produto) {
    try {
        const tamanhos = processarTamanhos(produto.tamanhos_disponiveis);
        console.log('Tamanhos processados:', tamanhos);
        
        if (tamanhos.length === 0) {
            return '<p>Nenhum tamanho disponível</p>';
        }
        
        let html = `
            <h3>Tamanhos:</h3>
            <div class="opcoes-tamanhos">
        `;
        
        tamanhos.forEach((tamanho, index) => {
            html += `
                <input type="radio" id="tamanho${tamanho}" name="tamanho" 
                       value="${tamanho}" class="tamanhos" ${index === 0 ? 'checked' : ''}>
                <label for="tamanho${tamanho}">${tamanho}</label>
            `;
        });
        
        html += `
            </div>
            <p class="erro-tamanho" id="erro-tamanho" style="display: none; color: red; margin-top: 5px;">
                Selecione um tamanho
            </p>
            <br>
        `;
        
        return html;
    } catch (error) {
        console.error('Erro ao gerar seletor de tamanhos:', error);
        return '<p>Erro ao carregar tamanhos disponíveis</p>';
    }
}
        
    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        document.getElementById('produto-container').innerHTML = `
            <div class="error">
                <h2>Produto não encontrado</h2>
                <p>O produto solicitado não existe.</p>
                <a href="/">Voltar para a home</a>
            </div>
        `;
    }
}

// Preencher descrição do produto
function preencherDescricaoProduto(produto) {
    if (produto.descricao) {
        document.getElementById('descricao-conteudo').innerHTML = 
            `<p>${produto.descricao.replace(/\n/g, '</p><p>')}</p>`;
    }
    
    // Esconder seção de medidas se não for roupa
    if (!produto.precisa_tamanho) {
        document.querySelector('[data-target="medidas"]').style.display = 'none';
    }
}



// Carregar página com base na URL
function carregarPagina() {
    const path = window.location.pathname;
    console.log("Carregando página:", path);
    
    if (path === '/') {
        carregarHome();
    } else if (path.startsWith('/produto/')) {
        const productId = path.split('/produto/')[1];
        if (productId && !isNaN(productId)) {
            carregarProduto(productId);
        } else {
            document.getElementById('produto-container').innerHTML = `
                <div class="error">
                    <h2>ID de produto inválido</h2>
                    <p>O ID do produto na URL é inválido.</p>
                    <a href="/">Voltar para a home</a>
                </div>
            `;
        }
    }
}

// Inicializar apenas se estivermos na página de produto
if (window.location.pathname.startsWith('/produto/')) {
    // Esperar o DOM estar totalmente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM carregado, inicializando...");
            window.addEventListener('popstate', carregarPagina);
            carregarPagina();
        });
    } else {
        console.log("DOM já carregado, inicializando...");
        window.addEventListener('popstate', carregarPagina);
        carregarPagina();
    }
}