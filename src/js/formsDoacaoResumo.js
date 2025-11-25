// Pega pedido atual
const pedidoAtual = JSON.parse(localStorage.getItem('pedidoAtual')) || { formData: {}, itens: [] };
const formData = pedidoAtual.formData;
const itens = pedidoAtual.itens;

// Preenche resumo
document.getElementById('resumoTitulo').textContent = formData.tituloPedido || '-';
document.getElementById('resumoDescricao').textContent = formData.descricaoPedido || '-';
document.getElementById('resumoPrazo').textContent = formData.prazoPedido || '-';
document.getElementById('resumoResponsavel').textContent = formData.responsavelPedido || '-';

const resumoDiv = document.getElementById('resumoItens');

function renderizarResumo() {
  resumoDiv.innerHTML = '';

  if (itens.length === 0) {
    resumoDiv.innerHTML = '<p>Nenhum item foi adicionado.</p>';
    return;
  }

  itens.forEach(item => {
    const box = document.createElement('div');
    box.className = 'item-box';
    box.innerHTML = `
      <div class="decorationItem"></div>
      <section class="itemDetails">
        <div class="itemHeader">
          <p><strong>${item.nome}</strong></p>
        </div>
        <div class="qntTipo-container">
          <p>Quantidade: ${item.quantidade}</p>
          <p>Tipo: ${item.tipo}</p>
        </div>
      </section>
    `;
    resumoDiv.appendChild(box);
  });
}

renderizarResumo();

// Botões de voltar e concluir
document.getElementById('voltar').addEventListener('click', () => {
  localStorage.removeItem('pedidoAtual'); // limpa temporário ao voltar
  window.location.href = '../pages-html/formulario-doacao.html';
});

document.getElementById('concluir').addEventListener('click', () => {
  localStorage.removeItem('pedidoAtual'); // limpa temporário ao concluir
  window.location.href = '../perfil-users/perfilong.html';
});