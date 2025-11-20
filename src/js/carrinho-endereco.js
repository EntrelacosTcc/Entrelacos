// ===============================
// Endereço e resumo do pedido
// ===============================

// Pegar os inputs do endereço
const formEndereco = document.getElementById('formEndereco');
const inputCep = document.getElementById('cep');
const inputRua = document.getElementById('rua');
const inputNumero = document.getElementById('numero');
const inputComplemento = document.getElementById('complemento');
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');
const inputPonto = document.getElementById('ponto');

// Preencher automaticamente pelo CEP
inputCep?.addEventListener('blur', () => {
  const cep = inputCep.value.replace(/\D/g, '');
  if (cep.length !== 8) return;
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (!data.erro) {
        inputRua.value = data.logradouro || '';
        inputBairro.value = data.bairro || '';
        inputCidade.value = data.localidade || '';
        inputEstado.value = data.uf || '';
      } else {
        alert('CEP não encontrado!');
      }
    })
    .catch(() => alert('Erro ao buscar o CEP'));
});

// Carregar endereço salvo, se existir
const enderecoSalvo = JSON.parse(localStorage.getItem('enderecoUsuario'));
if (enderecoSalvo) {
  inputCep.value = enderecoSalvo.cep || '';
  inputRua.value = enderecoSalvo.rua || '';
  inputNumero.value = enderecoSalvo.numero || '';
  inputComplemento.value = enderecoSalvo.complemento || '';
  inputBairro.value = enderecoSalvo.bairro || '';
  inputCidade.value = enderecoSalvo.cidade || '';
  inputEstado.value = enderecoSalvo.estado || '';
  inputPonto.value = enderecoSalvo.pontoReferencia || '';
}

// Pegar o carrinho do localStorage
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para atualizar o resumo do pedido
function atualizarResumoEndereco() {
  const subtotalEl = document.querySelector('.resumo-box .linha-total span:nth-child(2)');
  const totalEl = document.querySelector('.resumo-box .linha-total.totalzao strong');

  let subtotal = 0;
  carrinho.forEach(item => {
    subtotal += item.preco * item.quantidade;
  });

  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
}

// Atualiza o resumo ao carregar a página
atualizarResumoEndereco();

// -------------------------------------
// Salvar endereço
// -------------------------------------
formEndereco?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!inputCep.value || !inputRua.value || !inputNumero.value || !inputBairro.value || !inputCidade.value || !inputEstado.value) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const enderecoUsuario = {
    cep: inputCep.value,
    rua: inputRua.value,
    numero: inputNumero.value,
    complemento: inputComplemento.value,
    bairro: inputBairro.value,
    cidade: inputCidade.value,
    estado: inputEstado.value,
    pontoReferencia: inputPonto.value
  };

  localStorage.setItem('enderecoUsuario', JSON.stringify(enderecoUsuario));

  // Criar popup
  const popup = document.createElement('div');
  popup.textContent = 'Endereço salvo com sucesso!';
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.backgroundColor = '#3eb4ae';
  popup.style.color = '#fff';
  popup.style.padding = '15px 20px';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  popup.style.zIndex = 1000;
  document.body.appendChild(popup);

  // Remover popup e redirecionar
  setTimeout(() => {
    popup.remove();
    window.location.href = 'carrinho-escolha-frete.html';
  }, 2000); 

  formEndereco.reset();
});
