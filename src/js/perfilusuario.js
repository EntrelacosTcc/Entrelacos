// src/js/perfilusuario.js
import { auth } from "../js/firebase.js"; // ajusta o caminho se necessário

const $ = (s) => document.querySelector(s);
const $all = (s) => Array.from(document.querySelectorAll(s));

let _perfilImgBase64 = null;

// Espera autenticação e carrega perfil
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    await loadProfileFromBackend();
  });
  attachUiHandlers();
});

/* =========================
   Fetch / Update helpers
   ========================= */
async function fetchUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const token = await user.getIdToken();
    const res = await fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('fetchUserProfile', e);
    return null;
  }
}

async function updateUserProfile(profileData) {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const token = await user.getIdToken();
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:'unknown'}));
      console.error('updateUserProfile failed', err);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('updateUserProfile', e);
    return null;
  }
}

async function checkEmailExists(email) {
  if (!email) return false;
  try {
    const res = await fetch(`/api/usuario/check-email?email=${encodeURIComponent(email)}`);
    if (!res.ok) return true; // se erro, assume ocupado para prevenir overwrite 
    const j = await res.json();
    return !!j.exists;
  } catch (e) {
    console.error('checkEmailExists', e);
    return true;
  }
}

/* =========================
   Load profile into UI
   ========================= */
async function loadProfileFromBackend() {
  const profile = await fetchUserProfile();
  if (!profile) return;

  $('#email').value = profile.email || '';
  $('#telefone').value = profile.telefone || '';
  $('#dataNascimento').value = profile.data_nascimento ? profile.data_nascimento.split('T')[0] : '';
  $('#cpf').value = profile.cpf || '';
  $('#nome').value = profile.nome || '';
  $('#descricao').value = profile.descricao || '';

  if (profile.foto) {
    const imgUser = $('.img-user');
    imgUser.style.backgroundImage = `url(${profile.foto})`;
    imgUser.style.backgroundSize = 'cover';
    imgUser.style.backgroundPosition = 'center';
    _perfilImgBase64 = profile.foto;
  }

  $('#name').textContent = profile.nome || 'Usuário';

  // preencher causas
  if (profile.tags) {
    const tags = profile.tags.split(',').map(t => t.trim()).filter(Boolean);
    const checkboxes = $all('.causas-checkboxes input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = tags.includes(cb.value));
    atualizarCausasUI();
  }
}

/* =========================
   UI handlers
   ========================= */
function attachUiHandlers() {
  // lateral nav
  const menuItems = $all('.menu-navegacao li');
  const conteudos = $all('.conteudo-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      conteudos.forEach(c => c.classList.remove('active'));
      const target = item.dataset.target;
      document.getElementById(target)?.classList.add('active');
    });
  });

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

//   // Modal de Detalhes da Doação
// document.addEventListener('DOMContentLoaded', function() {
//     const modal = document.getElementById('modalDoacao');
//     const btnDetalhes = document.querySelector('.btn-detalhes');
//     const closeModal = document.querySelector('.close-modal');
//     const btnCancelarModal = document.querySelector('.btn-cancelar-modal');
//     const btnConfirmarModal = document.querySelector('.btn-confirmar-modal');

//     // Abrir modal
//     if (btnDetalhes) {
//         btnDetalhes.addEventListener('click', function() {
//             modal.style.display = 'block';
//             document.body.style.overflow = 'hidden'; // Previne scroll
//         });
//     }

//     // Fechar modal
//     function fecharModal() {
//         modal.style.display = 'none';
//         document.body.style.overflow = 'auto';
//     }

//     if (closeModal) {
//         closeModal.addEventListener('click', fecharModal);
//     }

//     // Fechar modal clicando fora
//     window.addEventListener('click', function(event) {
//         if (event.target === modal) {
//             fecharModal();
//         }
//     });


//     // Fechar modal com ESC
//     document.addEventListener('keydown', function(event) {
//         if (event.key === 'Escape' && modal.style.display === 'block') {
//             fecharModal();
//         }
//     });
// });

// // Abre opções

// function toggleBox(id) {
//   const box = document.getElementById(id);
//   const seta = box.previousElementSibling.querySelector('.seta');
//   box.classList.toggle('aberto');
//   seta.style.transform = box.classList.contains('aberto')
//     ? 'rotate(180deg)'
//     : 'rotate(0deg)';
// }

// // Redefinir Senha

// // Modal Redefinir Senha - VERSÃO CORRIGIDA
// document.addEventListener('DOMContentLoaded', function() {
//     // Verificar se o modal existe
//     const modalSenha = document.getElementById('modalSenha');
//     if (!modalSenha) {
//         console.error('Modal de senha não encontrado!');
//         return;
//     }

//     // Procurar o botão em TODO o documento
//     const btnRedefinirSenha = document.querySelector('.btn-redefinir-senha');
    
//     console.log('Botão encontrado:', btnRedefinirSenha);
//     console.log('Modal encontrado:', modalSenha);

//     // Função para abrir modal
//     function abrirModalSenha() {
//         console.log('Abrindo modal...');
//         modalSenha.style.display = 'block';
//         document.body.style.overflow = 'hidden';
        
//         // Limpar formulário ao abrir
//         const form = document.getElementById('formRedefinirSenha');
//         if (form) {
//             form.reset();
//             limparErros();
//         }
//     }
    
//     // Função para fechar modal
//     function fecharModalSenha() {
//         modalSenha.style.display = 'none';
//         document.body.style.overflow = 'auto';
//     }
    
//     // Abrir modal quando clicar no botão "Redefinir Senha"
//     if (btnRedefinirSenha) {
//         btnRedefinirSenha.addEventListener('click', function(e) {
//             e.preventDefault();
//             abrirModalSenha();
//         });
//     } else {
//         console.error('Botão redefinir senha não encontrado!');
//     }
    
//     // Fechar modal - procurar elementos DENTRO do modal
//     const closeModal = modalSenha.querySelector('.close-modal');
//     const btnCancelar = modalSenha.querySelector('.btn-cancelar');
    
//     if (closeModal) {
//         closeModal.addEventListener('click', fecharModalSenha);
//     }
    
//     if (btnCancelar) {
//         btnCancelar.addEventListener('click', fecharModalSenha);
//     }
    
//     // Fechar modal clicando fora
//     window.addEventListener('click', function(event) {
//         if (event.target === modalSenha) {
//             fecharModalSenha();
//         }
//     });
    
//     // Fechar modal com ESC
//     document.addEventListener('keydown', function(event) {
//         if (event.key === 'Escape' && modalSenha.style.display === 'block') {
//             fecharModalSenha();
//         }
//     });
    
//     // Validação do formulário
//     function limparErros() {
//         const errors = document.querySelectorAll('.error');
//         errors.forEach(error => {
//             error.style.display = 'none';
//         });
        
//         const inputs = document.querySelectorAll('.input-group');
//         inputs.forEach(input => {
//             input.classList.remove('error', 'success');
//         });
//     }
    
//     function mostrarErro(campo, mensagem) {
//         const inputGroup = campo.closest('.input-group');
//         let errorElement = inputGroup.querySelector('.error');
        
//         if (!errorElement) {
//             errorElement = document.createElement('div');
//             errorElement.className = 'error';
//             inputGroup.appendChild(errorElement);
//         }
        
//         errorElement.textContent = mensagem;
//         errorElement.style.display = 'block';
//         inputGroup.classList.add('error');
//         inputGroup.classList.remove('success');
//     }
    
//     function mostrarSucesso(campo) {
//         const inputGroup = campo.closest('.input-group');
//         inputGroup.classList.remove('error');
//         inputGroup.classList.add('success');
        
//         const errorElement = inputGroup.querySelector('.error');
//         if (errorElement) {
//             errorElement.style.display = 'none';
//         }
//     }
    
//     // Validação em tempo real - só adicionar eventos se os campos existirem
//     const senhaAtual = document.getElementById('senhaAtual');
//     const novaSenha = document.getElementById('novaSenha');
//     const confirmarSenha = document.getElementById('confirmarSenha');
    
//     if (senhaAtual) {
//         senhaAtual.addEventListener('blur', function() {
//             if (this.value.length < 6) {
//                 mostrarErro(this, 'A senha deve ter pelo menos 6 caracteres');
//             } else {
//                 mostrarSucesso(this);
//             }
//         });
//     }
    
//     if (novaSenha) {
//         novaSenha.addEventListener('blur', function() {
//             if (this.value.length < 6) {
//                 mostrarErro(this, 'A nova senha deve ter pelo menos 6 caracteres');
//             } else {
//                 mostrarSucesso(this);
//             }
//         });
//     }
    
//     if (confirmarSenha) {
//         confirmarSenha.addEventListener('blur', function() {
//             const novaSenhaValue = novaSenha ? novaSenha.value : '';
//             if (this.value !== novaSenhaValue) {
//                 mostrarErro(this, 'As senhas não coincidem');
//             } else {
//                 mostrarSucesso(this);
//             }
//         });
//     }
    
//     // Envio do formulário
//     const formRedefinirSenha = document.getElementById('formRedefinirSenha');
//     if (formRedefinirSenha) {
//         formRedefinirSenha.addEventListener('submit', function(e) {
//             e.preventDefault();
            
//             let valido = true;
            
//             // Validar senha atual
//             if (senhaAtual && senhaAtual.value.length < 6) {
//                 mostrarErro(senhaAtual, 'A senha atual é obrigatória');
//                 valido = false;
//             }
            
//             // Validar nova senha
//             if (novaSenha && novaSenha.value.length < 6) {
//                 mostrarErro(novaSenha, 'A nova senha deve ter pelo menos 6 caracteres');
//                 valido = false;
//             }
            
//             // Validar confirmação
//             if (confirmarSenha && novaSenha && confirmarSenha.value !== novaSenha.value) {
//                 mostrarErro(confirmarSenha, 'As senhas não coincidem');
//                 valido = false;
//             }
            
//             if (valido) {
//                 // Simular envio para o servidor
//                 const btnSubmit = this.querySelector('.btn-confirmar');
//                 const textoOriginal = btnSubmit.innerHTML;
                
//                 btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redefinindo...';
//                 btnSubmit.disabled = true;
                
//                 // Simular requisição AJAX
//                 setTimeout(() => {
//                     btnSubmit.innerHTML = textoOriginal;
//                     btnSubmit.disabled = false;
                    
//                     alert('Senha redefinida com sucesso!');
//                     fecharModalSenha();
                    
//                     console.log('Senha redefinida:', {
//                         senhaAtual: senhaAtual ? senhaAtual.value : '',
//                         novaSenha: novaSenha ? novaSenha.value : ''
//                     });
                    
//                 }, 1500);
//             }
//         });
//     }
// });


  // causas
  const checkboxes = $all(".causas-checkboxes input[type='checkbox']");
  checkboxes.forEach(cb => cb.addEventListener('change', () => {
    const selecionadas = checkboxes.filter(c => c.checked);
    if (selecionadas.length > 3) {
      cb.checked = false;
      alert('Você pode selecionar no máximo 3 causas.');
      return;
    }
    atualizarCausasUI();
  }));

  // salvar perfil
  $('#btnSalvar')?.addEventListener('click', async (e) => {
    e.preventDefault();

    const emailValue = $('#email').value.trim();
    // Se email mudou, checar disponibilidade
    const profileRemote = await fetchUserProfile();
    const currentEmail = profileRemote?.email || '';
    if (emailValue && emailValue !== currentEmail) {
      const exists = await checkEmailExists(emailValue);
      if (exists) {
        alert('Esse email já está em uso. Escolha outro.');
        return;
      }
    }

    const tags = $all('.causas-checkboxes input[type="checkbox"]:checked').map(cb => cb.value).join(',');
    const foto = _perfilImgBase64 ?? null;

    const payload = {
      nome: $('#nome').value || '',
      telefone: $('#telefone').value || '',
      cpf: $('#cpf').value || '',
      descricao: $('#descricao').value || '',
      data_nascimento: $('#dataNascimento').value || '',
      tags,
      foto,
      email: $('#email').value.trim() || undefined // opcional
    };

    const updated = await updateUserProfile(payload);
    if (updated) {
      alert('Informações salvas com sucesso!');
      // atualizar navbar: guardar profile mínimo em localStorage e chamar função do main.js
      const perfilParaNavbar = {
        nome: updated.nome || payload.nome,
        email: updated.email || payload.email || '',
        foto: updated.foto || foto || '/src/assets/img/default-avatar.png'
      };
      try {
        localStorage.setItem('userProfile', JSON.stringify(perfilParaNavbar));
        // função global no main.js: updateNavbarWithUser
        if (typeof updateNavbarWithUser === 'function') updateNavbarWithUser(perfilParaNavbar);
      } catch (e) { console.warn('Erro ao atualizar navbar localStorage', e); }
    } else {
      alert('Erro ao salvar informações.');
    }
  });

  // imagem
  const imgUser = $('.img-user');
  const inputImagem = $('#inputImagem');
  const btnAlterarImagem = $('#btnAlterarImagem');

  imgUser?.addEventListener('click', () => inputImagem?.click());
  btnAlterarImagem?.addEventListener('click', () => inputImagem?.click());

  inputImagem?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // opcional: limitar tamanho (ex.: 6MB)
    const maxMB = 6;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`A imagem é muito grande. Tamanho máximo: ${maxMB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      _perfilImgBase64 = ev.target.result;
      imgUser.style.backgroundImage = `url(${_perfilImgBase64})`;
      imgUser.style.backgroundSize = 'cover';
      imgUser.style.backgroundPosition = 'center';
      // atualizar navbar imediatamente (visual)
      const stored = JSON.parse(localStorage.getItem('userProfile') || '{}');
      stored.foto = _perfilImgBase64;
      localStorage.setItem('userProfile', JSON.stringify(stored));
      if (typeof updateNavbarWithUser === 'function') updateNavbarWithUser(stored);
    };
    reader.readAsDataURL(file);
  });

  // ViaCEP: busca e preenche endereço
  const inputCep = $('#cep');
  inputCep?.addEventListener('blur', () => {
    const cep = inputCep.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(r => r.json())
      .then(data => {
        if (data.erro) return alert('CEP não encontrado!');
        $('#rua').value = data.logradouro || '';
        $('#bairro').value = data.bairro || '';
        $('#cidade').value = data.localidade || '';
        $('#estado').value = data.uf || '';
      })
      .catch(() => alert('Erro ao buscar o CEP'));
  });

  // salvar endereço (mantive seu comportamento local — se quiser backend me avisa)
  $('#formEndereco')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Endereço salvo localmente (implemente rota backend se quiser persistir).');
  });
}

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

/* =========================
   Auxiliares
   ========================= */
function atualizarCausasUI() {
  const checkboxes = $all(".causas-checkboxes input[type='checkbox']");
  const selecionadas = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
  const perfilCausas = $('#perfilCausas');
  if (!perfilCausas) return;
  perfilCausas.innerHTML = '';
  selecionadas.forEach(causa => {
    const d = document.createElement('div');
    d.className = 'causa-tag';
    d.textContent = causa;
    perfilCausas.appendChild(d);
  });
}