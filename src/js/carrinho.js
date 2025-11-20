let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

/* -------------------------------------
   CARROSSEL (caso exista)
------------------------------------- */
const contentSlide = document.getElementById('content-slide');

function direcao(lado, valor) {
  if (lado === 1) {
    contentSlide.scrollBy({ left: -valor, behavior: 'smooth' });
  } else {
    contentSlide.scrollBy({ left: valor, behavior: 'smooth' });
  }
}

/* -------------------------------------
   RENDERIZAR CARRINHO
------------------------------------- */
function renderizarCarrinho() {
  const tbody = document.querySelector('.carrinho-tabela tbody');
  tbody.innerHTML = '';

  if (!carrinho || carrinho.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:50px; font-size:18px; color:#555;">
          Nenhum produto adicionado ainda
        </td>
      </tr>
    `;
    atualizarResumo(0);
    return;
  }

  let subtotal = 0;

  carrinho.forEach(item => {
    const totalItem = item.preco * item.quantidade;
    subtotal += totalItem;

    const tamanho = item.caracteristicas?.tamanho || null;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="produto-item">
          <div class="produto-img">
            <img src="${item.imagem}" alt="${item.nome}" />
          </div>
          <div class="produto-info">
            <h2>${item.nome}</h2>
            ${tamanho ? `<p>Tamanho: ${tamanho}</p>` : ""}
          </div>
        </div>
      </td>

      <td>
        ${tamanho ? `<span class="caracteristicas">Tamanho: ${tamanho}</span>` : ""}
      </td>

      <td>
        <div class="quantidade-box">
          <button onclick="alterarQuantidade('${item.uid}', -1)">-</button>
          <span>${item.quantidade}</span>
          <button onclick="alterarQuantidade('${item.uid}', 1)">+</button>
        </div>
      </td>

      <td>
        <strong class="preco">R$ ${totalItem.toFixed(2)}</strong>
      </td>
    `;

    tbody.appendChild(tr);
  });

  atualizarResumo(subtotal);
}

/* -------------------------------------
   ATUALIZAR RESUMO
------------------------------------- */
function atualizarResumo(valorSubtotal) {
  const subtotalEl = document.querySelector('.linha-total span:nth-child(2)');
  const totalEl = document.querySelector('.linha-total.totalzao strong');

  if (subtotalEl) subtotalEl.textContent = `R$ ${valorSubtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `R$ ${valorSubtotal.toFixed(2)}`;
}

/* -------------------------------------
   ALTERAR QUANTIDADE
------------------------------------- */
function alterarQuantidade(uid, operacao) {
  const index = carrinho.findIndex(item => item.uid === uid);
  if (index === -1) return;

  const item = carrinho[index];

  if (operacao === -1) {
    if (item.quantidade === 1) {
      const confirmar = confirm(`Deseja remover "${item.nome}" do seu carrinho?`);
      if (confirmar) {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        return;
      } else {
        return;
      }
    }
    item.quantidade--;
  } else if (operacao === 1) {
    item.quantidade++;
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  renderizarCarrinho();
}

/* -------------------------------------
   INICIAR
------------------------------------- */
renderizarCarrinho();
