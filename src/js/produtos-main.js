// --------------------------
// Função para carregar Home
// --------------------------
function carregarHome() {
    console.log("Página inicial carregada");
}

// -------------------------------------------------------
// Função principal para carregar produto pela URL
// -------------------------------------------------------
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
        console.log("Produto recebido:", produto);

        const precisaTamanho = produto.precisa_tamanho && produto.tamanhos_disponiveis;

        // --------------------------------
        // Montando o HTML do produto
        // --------------------------------
        document.getElementById('produto-container').innerHTML = `
            <section class="produto-container">
                <div class="produto-lateral">
                    <div class="img-lateral">
                        <img src="${produto.imagem_lateral}" alt="${produto.nome_produto}" id="small-img">
                    </div>
                </div>

                <div class="produto-principal">
                    <img src="${produto.imagem}" alt="${produto.nome_produto}" id="MainImg">
                </div>

                <div class="produto-info">
                    <h1>${produto.nome_produto}</h1>
                    <h3>R$ ${Number(produto.preco).toFixed(2)}</h3>

                    ${precisaTamanho ? gerarSeletorTamanhos(produto) : ""}

                    <button class="btn-comprar">Comprar</button>
                </div>
            </section>
        `;

        document.title = `${produto.nome_produto} - Minha Loja`;

        // --------------------------------
        // Descrição
        // --------------------------------
        preencherDescricaoProduto(produto);

        // --------------------------------
        // Troca de imagem ao clicar
        // --------------------------------
        const mainImg = document.getElementById("MainImg");
        const smallImg = document.getElementById("small-img");

        smallImg.addEventListener("click", () => {
            let trocarImagem = mainImg.src;
            mainImg.src = smallImg.src;
            smallImg.src = trocarImagem;
        });

        // --------------------------------
        // Adicionar ao carrinho
        // --------------------------------
        const btnComprar = document.querySelector(".btn-comprar");
        btnComprar.addEventListener("click", () => adicionarAoCarrinho(produto));

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

// -----------------------------------------------------------
// Função para transformar o campo de tamanhos em array
// -----------------------------------------------------------
function processarTamanhos(tamanhosData) {
    if (!tamanhosData) return [];
    if (Array.isArray(tamanhosData)) return tamanhosData;

    if (typeof tamanhosData === "string") {
        try {
            const parsed = JSON.parse(tamanhosData);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            return tamanhosData.split(",").map(t => t.trim());
        }
    }
    return [];
}

// -----------------------------------------------------
// Geração do seletor de tamanhos
// -----------------------------------------------------
function gerarSeletorTamanhos(produto) {
    const tamanhos = processarTamanhos(produto.tamanhos_disponiveis);
    if (tamanhos.length === 0) return `<p>Nenhum tamanho disponível</p>`;

    let html = `
        <h3>Tamanhos:</h3>
        <div class="opcoes-tamanhos">
    `;

    tamanhos.forEach((tamanho, i) => {
        html += `
            <input type="radio" 
                   id="tamanho${tamanho}" 
                   name="tamanho" 
                   value="${tamanho}" 
                   ${i === 0 ? "checked" : ""}>
            <label for="tamanho${tamanho}">${tamanho}</label>
        `;
    });

    html += `
        </div>
        <p class="erro-tamanho" id="erro-tamanho" style="display:none;color:red;margin-top:5px;">
            Selecione um tamanho
        </p>
    `;
    return html;
}

// -----------------------------------------------------
// Preencher descrição
// -----------------------------------------------------
function preencherDescricaoProduto(produto) {
    if (produto.descricao) {
        document.getElementById("descricao-conteudo").innerHTML = `
            <p>${produto.descricao.replace(/\n/g, "</p><p>")}</p>
            <br>
            <p>${produto.caracteristicas.replace(/\n/g, "</p><p>")}</p>
        `;
    }
    if (!produto.precisa_tamanho) {
        const medidas = document.querySelector("[data-target='medidas']");
        if (medidas) medidas.style.display = "none";
    }
}

// ---------------------------------------------------------
// ADICIONAR AO CARRINHO (UID ÚNICO)
// ---------------------------------------------------------
function adicionarAoCarrinho(produto) {
    let tamanhoSelecionado = null;

    if (produto.precisa_tamanho) {
        const seletor = document.querySelector("input[name='tamanho']:checked");
        if (!seletor) {
            document.getElementById("erro-tamanho").style.display = "block";
            return;
        }
        tamanhoSelecionado = seletor.value;
    }

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    //  UID único: garante que cada item sem tamanho seja separado
    const uid = produto.precisa_tamanho
        ? `${produto.id}-${tamanhoSelecionado}`
        : `${produto.id}-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    carrinho.push({
        uid,
        id: produto.id,
        nome: produto.nome_produto,
        preco: Number(produto.preco),
        quantidade: 1,
        imagem: produto.imagem,
        caracteristicas: {
            tamanho: tamanhoSelecionado || null
        }
    });

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
 mostrarPopup(produto.nome_produto);

}

// -----------------------------------------------------
// Detectar página atual e carregar conteúdo
// -----------------------------------------------------
function carregarPagina() {
    const path = window.location.pathname;

    if (path === "/") {
        carregarHome();
    } else if (path.startsWith("/produto/")) {
        const productId = path.split("/produto/")[1];
        carregarProduto(productId);
    }
}

// -----------------------------------------------------
// Inicializando se estivermos em página de produto
// -----------------------------------------------------
if (window.location.pathname.startsWith("/produto/")) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            window.addEventListener("popstate", carregarPagina);
            carregarPagina();
        });
    } else {
        window.addEventListener("popstate", carregarPagina);
        carregarPagina();
    }
}

// popoup de sucesso ao adicionar ao carrinho

function mostrarPopup(nomeProduto) {
    const popup = document.getElementById('popup-sucesso');
    popup.textContent = `"${nomeProduto}" adicionado ao carrinho! ✅`;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 5000);
}

