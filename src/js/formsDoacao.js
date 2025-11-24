const btnAdicionar = document.getElementById('btnAdicionar');
const lista = document.getElementById('listaItens');
const btnResumo = document.getElementById('btnResumo');

// Itens da doação
let itens = JSON.parse(localStorage.getItem('itensDoacao')) || [];

// Dados do formulário principal
let formData = JSON.parse(localStorage.getItem('formDoacao')) || {};

// Renderiza os itens adicionados
function renderizarItens() {
  lista.innerHTML = '';
  itens.forEach((item, index) => {
    const box = document.createElement('div');
    box.className = 'item-box';
    box.innerHTML = `
      <div class="decorationItem"></div>
      <section class="itemDetails">
        <div class="itemHeader">
          <p><strong>${item.nome}</strong></p>
          <button class="btn-apagar" data-index="${index}">Cancelar</button>
        </div>
        <div class="qntTipo-container">
          <p>Quantidade: ${item.quantidade}</p>
          <p>Tipo: ${item.tipo}</p>
        </div>
      </section>
    `;
    lista.appendChild(box);
  });

  // Botões de apagar
  document.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      itens.splice(index, 1);
      localStorage.setItem('itensDoacao', JSON.stringify(itens));
      renderizarItens();
    });
  });
}

renderizarItens();

// Adicionar novo item
btnAdicionar.addEventListener('click', () => {
  const nome = document.getElementById('nomeItem').value;
  const quantidade = document.getElementById('quantidade').value;
  const tipo = document.getElementById('tipo').value;

  if (!nome || !quantidade) {
    alert('Preencha todos os campos do item antes de adicionar!');
    return;
  }

  itens.push({ nome, quantidade, tipo });
  localStorage.setItem('itensDoacao', JSON.stringify(itens));
  renderizarItens();

  // Limpa os inputs de adicionar item
  document.getElementById('nomeItem').value = '';
  document.getElementById('quantidade').value = '';
  document.getElementById('tipo').value = 'unidade(s)';
});

// Seleciona inputs do formulário principal
const inputsFormulario = document.querySelectorAll(
  '#tituloPedido, #descricaoPedido, #prazoPedido, #responsavelPedido'
);

// Salva dados do formulário principal automaticamente
inputsFormulario.forEach(input => {
  input.addEventListener('input', () => {
    formData[input.name || input.id] = input.value;
    localStorage.setItem('formDoacao', JSON.stringify(formData));
  });
});

// Limita input de data para hoje ou futuro
const inputData = document.getElementById('prazoPedido');
const hojeStr = new Date().toISOString().split('T')[0];
inputData.setAttribute('min', hojeStr);

// Botão de resumo
btnResumo.addEventListener('click', () => {

  // Verifica se inputs estão preenchidos
  for (let input of inputsFormulario) {
    if (!input.value) {
      alert('Por favor, preencha todos os campos antes de continuar.');
      input.focus();
      return;
    }
  }

  // Valida data
  const dataSelecionada = new Date(document.getElementById('prazoPedido').value);
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  dataSelecionada.setHours(0,0,0,0);

  if (dataSelecionada < hoje) {
    alert('A data do prazo deve ser hoje ou futura.');
    document.getElementById('prazoPedido').focus();
    return;
  }

  // Salva dados finais do formulário
  inputsFormulario.forEach(input => {
    formData[input.name || input.id] = input.value;
  });
  localStorage.setItem('formDoacao', JSON.stringify(formData));

  // 🔥 NOVO: salva este pedido dentro de "todosPedidos"
  let pedidos = JSON.parse(localStorage.getItem('todosPedidos')) || [];

  const novoPedido = {
    id: Date.now(), 
    nome: formData.tituloPedido,
    descricao: formData.descricaoPedido,
    prazo: formData.prazoPedido,
    responsavel: formData.responsavelPedido,
    itens: itens
  };

  
  pedidos.push(novoPedido);

  localStorage.setItem('todosPedidos', JSON.stringify(pedidos));

  // Vai para a página de resumo
  window.location.href = '../pages-html/formulario-doacaoResumo.html';
});

// Validação da quantidade
const inputQuantidade = document.getElementById('quantidade');
inputQuantidade.addEventListener('input', () => {
  if (inputQuantidade.value < 0) {
    inputQuantidade.value = '';
    alert('Digite apenas números positivos!');
  }
});
