document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // Imagem do perfil
  // ===============================
  const imgUser = document.querySelector('.img-user');
  const inputImagem = document.getElementById('inputImagem');
  const btnAlterarImagem = document.getElementById('btnAlterarImagem');
  let imgBase64 = null;

  const atualizarImagem = (src) => {
    imgBase64 = src;
    imgUser.style.backgroundImage = `url(${imgBase64})`;
    imgUser.style.backgroundSize = 'cover';
    imgUser.style.backgroundPosition = 'center';
  };

  imgUser?.addEventListener('click', () => inputImagem.click());
  btnAlterarImagem?.addEventListener('click', () => inputImagem.click());

  inputImagem?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => atualizarImagem(event.target.result);
    reader.readAsDataURL(file);
  });

  // ===============================
  // Menu lateral
  // ===============================
  const menuItems = document.querySelectorAll('.menu-navegacao li');
  const conteudos = document.querySelectorAll('.conteudo-item');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const target = item.dataset.target;
      conteudos.forEach(c => c.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');
    });
  });

  // ===============================
  // Causas principais
  // ===============================
  const checkboxes = document.querySelectorAll(".causas-checkboxes input[type='checkbox']");
  const perfilCausas = document.getElementById("perfilCausas");
  const maxCausas = 3;

  const atualizarCausas = () => {
    const selecionadas = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    perfilCausas.innerHTML = '';
    selecionadas.forEach(causa => {
      const tag = document.createElement('div');
      tag.classList.add('causa-tag');
      tag.textContent = causa;
      perfilCausas.appendChild(tag);
    });
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const selecionadas = Array.from(checkboxes).filter(cb => cb.checked);
      if (selecionadas.length > maxCausas) {
        cb.checked = false;
        alert(`Você pode selecionar no máximo ${maxCausas} causas.`);
        return;
      }
      atualizarCausas();
    });
  });

  // ===============================
  // Salvar e carregar dados do usuário
  // ===============================
  const btnSalvar = document.getElementById('btnSalvar');
  btnSalvar?.addEventListener('click', () => {
    const dadosUsuario = {
      email: document.getElementById('email')?.value || '',
      telefone: document.getElementById('telefone')?.value || '',
      nascimento: document.getElementById('dataNascimento')?.value || '',
      cpf: document.getElementById('cpf')?.value || '',
      nome: document.getElementById('nome')?.value || '',
      sobrenome: document.getElementById('sobrenome')?.value || '',
      descricao: document.getElementById('descricao')?.value || '',
      causas: Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value),
      imagem: imgBase64
    };
    localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
    alert('Informações salvas com sucesso!');
  });

  const dadosSalvos = JSON.parse(localStorage.getItem('dadosUsuario'));
  if (dadosSalvos) {
    document.getElementById('email').value = dadosSalvos.email || '';
    document.getElementById('telefone').value = dadosSalvos.telefone || '';
    document.getElementById('dataNascimento').value = dadosSalvos.nascimento || '';
    document.getElementById('cpf').value = dadosSalvos.cpf || '';
    document.getElementById('nome').value = dadosSalvos.nome || '';
    document.getElementById('sobrenome').value = dadosSalvos.sobrenome || '';
    document.getElementById('descricao').value = dadosSalvos.descricao || '';

    if (dadosSalvos.causas) {
      checkboxes.forEach(cb => cb.checked = dadosSalvos.causas.includes(cb.value));
      atualizarCausas();
    }

    if (dadosSalvos.imagem) {
      atualizarImagem(dadosSalvos.imagem);
    }
  }

  // ===============================
  // Endereço
  // ===============================
  const formEndereco = document.getElementById('formEndereco');
  const inputCep = document.getElementById('cep');
  const inputRua = document.getElementById('rua');
  const inputNumero = document.getElementById('numero');
  const inputComplemento = document.getElementById('complemento');
  const inputBairro = document.getElementById('bairro');
  const inputCidade = document.getElementById('cidade');
  const inputEstado = document.getElementById('estado');
  const inputPonto = document.getElementById('ponto');

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
        } else alert('CEP não encontrado!');
      })
      .catch(() => alert('Erro ao buscar o CEP'));
  });

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
    alert('Endereço salvo com sucesso!');
  });

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

  // ===============================
  // Abas Vagas / Doações
  // ===============================
  const vagas = document.getElementById('aba-vagas');
  const doacoes = document.getElementById('aba-doacoes');

  vagas?.addEventListener('click', () => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
    document.querySelectorAll('.conteudo-abas').forEach(c => c.classList.remove('ativa'));
    vagas.classList.add('ativa');
    document.getElementById('conteudo-vagas').classList.add('ativa');
  });

  doacoes?.addEventListener('click', () => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
    document.querySelectorAll('.conteudo-abas').forEach(c => c.classList.remove('ativa'));
    doacoes.classList.add('ativa');
    document.getElementById('conteudo-doacoes').classList.add('ativa');
  });

});

// Modal de Detalhes da Doação
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalDoacao');
    const btnDetalhes = document.querySelector('.btn-detalhes');
    const closeModal = document.querySelector('.close-modal');
    const btnCancelarModal = document.querySelector('.btn-cancelar-modal');
    const btnConfirmarModal = document.querySelector('.btn-confirmar-modal');

    // Abrir modal
    if (btnDetalhes) {
        btnDetalhes.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Previne scroll
        });
    }

    // Fechar modal
    function fecharModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeModal) {
        closeModal.addEventListener('click', fecharModal);
    }

    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            fecharModal();
        }
    });


    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            fecharModal();
        }
    });
});

// Abre opções

function toggleBox(id) {
  const box = document.getElementById(id);
  const seta = box.previousElementSibling.querySelector('.seta');
  box.classList.toggle('aberto');
  seta.style.transform = box.classList.contains('aberto')
    ? 'rotate(180deg)'
    : 'rotate(0deg)';
}

// Redefinir Senha

// Modal Redefinir Senha - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o modal existe
    const modalSenha = document.getElementById('modalSenha');
    if (!modalSenha) {
        console.error('Modal de senha não encontrado!');
        return;
    }

    // Procurar o botão em TODO o documento
    const btnRedefinirSenha = document.querySelector('.btn-redefinir-senha');
    
    console.log('Botão encontrado:', btnRedefinirSenha);
    console.log('Modal encontrado:', modalSenha);

    // Função para abrir modal
    function abrirModalSenha() {
        console.log('Abrindo modal...');
        modalSenha.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Limpar formulário ao abrir
        const form = document.getElementById('formRedefinirSenha');
        if (form) {
            form.reset();
            limparErros();
        }
    }
    
    // Função para fechar modal
    function fecharModalSenha() {
        modalSenha.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Abrir modal quando clicar no botão "Redefinir Senha"
    if (btnRedefinirSenha) {
        btnRedefinirSenha.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModalSenha();
        });
    } else {
        console.error('Botão redefinir senha não encontrado!');
    }
    
    // Fechar modal - procurar elementos DENTRO do modal
    const closeModal = modalSenha.querySelector('.close-modal');
    const btnCancelar = modalSenha.querySelector('.btn-cancelar');
    
    if (closeModal) {
        closeModal.addEventListener('click', fecharModalSenha);
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharModalSenha);
    }
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === modalSenha) {
            fecharModalSenha();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalSenha.style.display === 'block') {
            fecharModalSenha();
        }
    });
    
    // Validação do formulário
    function limparErros() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => {
            error.style.display = 'none';
        });
        
        const inputs = document.querySelectorAll('.input-group');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
    }
    
    function mostrarErro(campo, mensagem) {
        const inputGroup = campo.closest('.input-group');
        let errorElement = inputGroup.querySelector('.error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error';
            inputGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = mensagem;
        errorElement.style.display = 'block';
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
    }
    
    function mostrarSucesso(campo) {
        const inputGroup = campo.closest('.input-group');
        inputGroup.classList.remove('error');
        inputGroup.classList.add('success');
        
        const errorElement = inputGroup.querySelector('.error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // Validação em tempo real - só adicionar eventos se os campos existirem
    const senhaAtual = document.getElementById('senhaAtual');
    const novaSenha = document.getElementById('novaSenha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    
    if (senhaAtual) {
        senhaAtual.addEventListener('blur', function() {
            if (this.value.length < 6) {
                mostrarErro(this, 'A senha deve ter pelo menos 6 caracteres');
            } else {
                mostrarSucesso(this);
            }
        });
    }
    
    if (novaSenha) {
        novaSenha.addEventListener('blur', function() {
            if (this.value.length < 6) {
                mostrarErro(this, 'A nova senha deve ter pelo menos 6 caracteres');
            } else {
                mostrarSucesso(this);
            }
        });
    }
    
    if (confirmarSenha) {
        confirmarSenha.addEventListener('blur', function() {
            const novaSenhaValue = novaSenha ? novaSenha.value : '';
            if (this.value !== novaSenhaValue) {
                mostrarErro(this, 'As senhas não coincidem');
            } else {
                mostrarSucesso(this);
            }
        });
    }
    
    // Envio do formulário
    const formRedefinirSenha = document.getElementById('formRedefinirSenha');
    if (formRedefinirSenha) {
        formRedefinirSenha.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let valido = true;
            
            // Validar senha atual
            if (senhaAtual && senhaAtual.value.length < 6) {
                mostrarErro(senhaAtual, 'A senha atual é obrigatória');
                valido = false;
            }
            
            // Validar nova senha
            if (novaSenha && novaSenha.value.length < 6) {
                mostrarErro(novaSenha, 'A nova senha deve ter pelo menos 6 caracteres');
                valido = false;
            }
            
            // Validar confirmação
            if (confirmarSenha && novaSenha && confirmarSenha.value !== novaSenha.value) {
                mostrarErro(confirmarSenha, 'As senhas não coincidem');
                valido = false;
            }
            
            if (valido) {
                // Simular envio para o servidor
                const btnSubmit = this.querySelector('.btn-confirmar');
                const textoOriginal = btnSubmit.innerHTML;
                
                btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redefinindo...';
                btnSubmit.disabled = true;
                
                // Simular requisição AJAX
                setTimeout(() => {
                    btnSubmit.innerHTML = textoOriginal;
                    btnSubmit.disabled = false;
                    
                    alert('Senha redefinida com sucesso!');
                    fecharModalSenha();
                    
                    console.log('Senha redefinida:', {
                        senhaAtual: senhaAtual ? senhaAtual.value : '',
                        novaSenha: novaSenha ? novaSenha.value : ''
                    });
                    
                }, 1500);
            }
        });
    }
});

// Voltar para Index após logout

// Logout - Para o item Sair (li)
document.addEventListener('DOMContentLoaded', function() {
    const itemSair = document.querySelector('li[data-target="sair"]');
    
    if (itemSair) {
        itemSair.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirmar se o usuário realmente quer sair
            if (confirm('Tem certeza que deseja sair da sua conta?')) {
                // Limpar dados de sessão/localStorage se necessário
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('dadosUsuario');
                sessionStorage.clear();
                
                // Redirecionar para a página index
                window.location.href = '../../index.html';
            }
        });
    }
});