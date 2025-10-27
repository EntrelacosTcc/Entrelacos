// Definição de Imagem - perfil usuário
const imgUser = document.querySelector('.img-user');
const inputImagem = document.getElementById('inputImagem');
const btnAlterarImagem = document.getElementById('btnAlterarImagem');
let imgBase64 = null; // armazena a imagem em base64

// Clicar no círculo ou no botão abre o seletor
imgUser.addEventListener('click', () => inputImagem.click());
btnAlterarImagem.addEventListener('click', () => inputImagem.click());

// Ao selecionar imagem, aplica no círculo e salva base64
inputImagem.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        imgBase64 = e.target.result;
        imgUser.style.backgroundImage = `url(${imgBase64})`;
        imgUser.style.backgroundSize = 'cover';
        imgUser.style.backgroundPosition = 'center';
    }
    reader.readAsDataURL(file);
});

// Menu de navegação lateral - destacar item ativo
const menuItems = document.querySelectorAll('.menu-navegacao li');
const conteudos = document.querySelectorAll('.conteudo-item');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const target = item.dataset.target;
    conteudos.forEach(c => c.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Causas Principais
const checkboxes = document.querySelectorAll(".causas-checkboxes input[type='checkbox']");
const perfilCausas = document.getElementById("perfilCausas");
const maxCausas = 3;

checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const selecionadas = Array.from(checkboxes)
                              .filter(cb => cb.checked)
                              .map(cb => cb.value);
    
    // Bloqueia se ultrapassar 3 e alerta
    if (selecionadas.length > maxCausas) {
      checkbox.checked = false;
      alert(`Você pode selecionar no máximo ${maxCausas} causas.`);
      return;
    }

    // Atualiza as tags verdes
    perfilCausas.innerHTML = "";
    selecionadas.forEach(causa => {
      const tag = document.createElement("div");
      tag.classList.add("causa-tag");
      tag.textContent = causa;
      perfilCausas.appendChild(tag);
    });
  });
});

// Infos Perfil + Descrição + Causas + Imagem
const btnSalvar = document.getElementById('btnSalvar');

btnSalvar.addEventListener('click', () => {
  const dadosUsuario = {
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    nascimento: document.getElementById('dataNascimento').value,
    cpf: document.getElementById('cpf').value,
    nome: document.getElementById('nome').value,
    sobrenome: document.getElementById('sobrenome').value,
    descricao: document.getElementById('descricao').value,
    causas: Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value),
    imagem: imgBase64 // adiciona a imagem
  };

  localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
  alert('Informações salvas com sucesso!');
});

// Ao carregar a página, preenche campos, checkboxes, tags e imagem
window.addEventListener('load', () => {
  const dadosSalvos = JSON.parse(localStorage.getItem('dadosUsuario'));
  if(dadosSalvos){
    document.getElementById('email').value = dadosSalvos.email || '';
    document.getElementById('telefone').value = dadosSalvos.telefone || '';
    document.getElementById('dataNascimento').value = dadosSalvos.nascimento || '';
    document.getElementById('cpf').value = dadosSalvos.cpf || '';
    document.getElementById('nome').value = dadosSalvos.nome || '';
    document.getElementById('sobrenome').value = dadosSalvos.sobrenome || '';
    document.getElementById('descricao').value = dadosSalvos.descricao || '';

    // Atualiza checkboxes e tags verdes
    if(dadosSalvos.causas && dadosSalvos.causas.length > 0){
      checkboxes.forEach(cb => {
        cb.checked = dadosSalvos.causas.includes(cb.value);
      });
      perfilCausas.innerHTML = '';
      dadosSalvos.causas.forEach(causa => {
        const tag = document.createElement("div");
        tag.classList.add("causa-tag");
        tag.textContent = causa;
        perfilCausas.appendChild(tag);
      });
    }

    // Atualiza a imagem de perfil
    if(dadosSalvos.imagem){
      imgBase64 = dadosSalvos.imagem;
      imgUser.style.backgroundImage = `url(${imgBase64})`;
      imgUser.style.backgroundSize = 'cover';
      imgUser.style.backgroundPosition = 'center';
    }
  }
});

// Script para salvar o Endereço

// Formulário
const formEndereco = document.getElementById('formEndereco');

// Inputs
const inputCep = document.getElementById('cep');
const inputRua = document.getElementById('rua');
const inputNumero = document.getElementById('numero');
const inputComplemento = document.getElementById('complemento');
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');
const inputPonto = document.getElementById('ponto');

// Função autocomplete via ViaCEP
inputCep.addEventListener('blur', () => {
  const cep = inputCep.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert('CEP não encontrado!');
        return;
      }
      inputRua.value = data.logradouro || '';
      inputBairro.value = data.bairro || '';
      inputCidade.value = data.localidade || '';
      inputEstado.value = data.uf || '';
    })
    .catch(err => {
      console.error('Erro ao buscar CEP:', err);
      alert('Não foi possível buscar o endereço. Tente novamente.');
    });
});

// Salvar endereço
formEndereco.addEventListener('submit', (e) => {
  e.preventDefault();

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!inputCep.value || !inputRua.value || !inputNumero.value || !inputBairro.value || !inputCidade.value || !inputEstado.value) {
    alert('Por favor, preencha todos os campos obrigatórios.');
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

  // Salva no localStorage
  localStorage.setItem('enderecoUsuario', JSON.stringify(enderecoUsuario));
  alert('Endereço salvo com sucesso!');
});

// Carregar dados salvos
window.addEventListener('load', () => {
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
});


