// loginOng.js
import { auth } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configurar provedor Google
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const googleBtn = document.getElementById("btnGoogle");
  const esqueceuSenha = document.querySelector('a[href="#"]');

  // Função para buscar perfil da ONG
  async function fetchOngProfile(token) {
    try {
      console.log('🔍 Buscando perfil da ONG no backend...');
      const response = await fetch('http://localhost:3002/api/ong/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Perfil da ONG encontrado:', profile);
        return profile;
      } else if (response.status === 404) {
        console.log('❌ ONG não encontrada no backend');
        return null;
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil da ONG:', error);
      return null;
    }
  }

  // loginOng.js - função registerOngInBackend
// No loginOng.js - função registerOngInBackend
async function registerOngInBackend(uid, email, nome) {
  try {
    console.log('📝 Registrando ONG no backend...');
    const response = await fetch('http://localhost:3002/api/ong/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: uid,
        email: email,
        nome_ong: nome,
        // ✅ ADICIONAR ESTADO PADRÃO para o registro automático
        estado: 'SP', // ou outro estado padrão
        // outros campos serão preenchidos posteriormente
        perfil_oficial: null,
        classificacao: null,
        nome_responsavel: null,
        cargo_responsavel: null,
        cnpj: null,
        descricao: null,
        endereco: null,
        causa: null
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ ONG registrada no backend:', result);
      return result;
    } else {
      throw new Error(result.error || 'Erro ao registrar ONG no backend');
    }
  } catch (error) {
    console.error('❌ Erro no registro backend:', error);
    throw error;
  }
}

  // Função para salvar perfil da ONG
  function saveOngProfile(profile) {
    localStorage.setItem('ongProfile', JSON.stringify(profile));
    console.log('💾 Perfil da ONG salvo no localStorage:', profile);
  }

  // Função principal de login
  async function handleLogin(user, token) {
    try {
      console.log('🔄 Iniciando processo de login...');

      // Verificar se a ONG já está registrada no backend
      let profile = await fetchOngProfile(token);
      
      if (!profile) {
        console.log('🆕 ONG não encontrada no backend, registrando...');
        const nome = user.displayName || user.email.split('@')[0] || 'Nova ONG';
        const registerResult = await registerOngInBackend(user.uid, user.email, nome);
        
        // Buscar perfil após registro
        profile = await fetchOngProfile(token);
        
        if (!profile) {
          throw new Error('Não foi possível obter o perfil após o registro');
        }
      }

      // Salvar dados da ONG
      saveOngProfile(profile);
      
      // Atualizar navbar (se estiver disponível)
      if (typeof updateNavbarWithOng === 'function') {
        console.log('🔧 Atualizando navbar...');
        updateNavbarWithOng(profile);
      } else {
        console.log('ℹ️ Função updateNavbarWithOng não disponível');
      }
      
      // Redirecionar
      const ongName = profile.nome_ong || user.displayName || "ONG";
      alert(`✅ Bem-vindo(a), ${ongName}!`);
      console.log('🚀 Redirecionando para perfil-ong.html...');
      
      // Forçar redirecionamento
      window.location.href = "../perfil-users/perfilong.html";

    } catch (error) {
      console.error('❌ Erro no processo de login:', error);
      alert('❌ Erro durante o login: ' + error.message);
    }
  }

  // === LOGIN COM E-MAIL E SENHA ===
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("email")?.value.trim();
      const senha = document.getElementById("senha")?.value;

      if (!email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      try {
        console.log('🔐 Tentando login com:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        const token = await user.getIdToken();
        
        console.log('✅ Login Firebase OK, UID:', user.uid);
        console.log('🔑 Token obtido:', token.substring(0, 20) + '...');
        
        await handleLogin(user, token);

      } catch (error) {
        console.error("❌ Erro completo no login:", error);
        handleAuthError(error);
      }
    });
  }

  // === LOGIN COM GOOGLE ===
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        console.log('🔐 Iniciando login Google...');
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        
        console.log('✅ Login Google OK, UID:', user.uid);
        console.log('🔑 Token obtido:', token.substring(0, 20) + '...');
        
        await handleLogin(user, token);

      } catch (error) {
        console.error("❌ Erro completo no login Google:", error);
        handleAuthError(error);
      }
    });
  }

  // === ESQUECI SENHA ===
  if (esqueceuSenha) {
    esqueceuSenha.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email")?.value.trim();
      
      if (!email) {
        alert("Digite seu e-mail para redefinir a senha.");
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        alert("✅ E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.");
      } catch (error) {
        console.error("❌ Erro ao enviar e-mail de redefinição:", error);
        alert("❌ Erro ao enviar e-mail de redefinição. Verifique o e-mail digitado.");
      }
    });
  }
});

// Função para tratar erros de autenticação
function handleAuthError(error) {
  console.error("❌ Código do erro:", error.code);
  console.error("❌ Mensagem do erro:", error.message);

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      alert("❌ E-mail ou senha incorretos. Verifique suas credenciais.");
      break;
    case "auth/invalid-email":
      alert("❌ O e-mail digitado não é válido.");
      break;
    case "auth/user-not-found":
      alert("❌ ONG não encontrada. Faça o cadastro primeiro.");
      break;
    case "auth/too-many-requests":
      alert("❌ Muitas tentativas de login. Tente novamente mais tarde.");
      break;
    case "auth/network-request-failed":
      alert("❌ Erro de conexão. Verifique sua internet.");
      break;
    case "auth/popup-closed-by-user":
      alert("❌ Login cancelado. Tente novamente.");
      break;
    default:
      alert(`❌ Erro ao fazer login: ${error.message}`);
  }
}

// Função para verificar se o usuário já está logado ao carregar a página
export async function checkOngAuth() {
  try {
    const user = auth.currentUser;
    if (user) {
      console.log('🔍 Usuário já autenticado:', user.uid);
      const token = await user.getIdToken();
      await handleLogin(user, token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return false;
  }
}