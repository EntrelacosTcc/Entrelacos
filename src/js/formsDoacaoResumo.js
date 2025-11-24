    const formData = JSON.parse(localStorage.getItem('formDoacao')) || {};

    document.getElementById('resumoTitulo').textContent = formData.tituloPedido || '-';
    document.getElementById('resumoDescricao').textContent = formData.descricaoPedido || '-';
    document.getElementById('resumoPrazo').textContent = formData.prazoPedido || '-';
    document.getElementById('resumoResponsavel').textContent = formData.responsavelPedido || '-';

    const resumoDiv = document.getElementById('resumoItens');
    const itens = JSON.parse(localStorage.getItem('itensDoacao')) || [];

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

    document.getElementById('voltar').addEventListener('click', () => {
      window.location.href = '../pages-html/formulario-doacao.html';
    });

    document.getElementById('concluir').addEventListener('click', () => {
      window.location.href = '../perfil-users/perfilong.html'
    });