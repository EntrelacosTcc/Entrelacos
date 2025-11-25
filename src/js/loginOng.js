// loginOng.js (ATUALIZADO - Verificação no MySQL antes do login)
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

  // 🔹 NOVA FUNÇÃO: Verificar se ONG existe no MySQL pelo email
  async function checkOngExistsInDatabase(email) {
    try {
      console.log('🔍 Verificando se ONG existe no banco de dados...');
      const response = await fetch(`http://localhost:3002/api/ong/check-email?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resposta da verificação:', result);
        return result.exists;
      } else {
        console.error('❌ Erro ao verificar ONG no banco');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na verificação da ONG:', error);
      return false;
    }
  }

  // 🔹 MODIFICADA: Buscar perfil da ONG (apenas se existir no MySQL)
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
        throw new Error('ONG não cadastrada no sistema');
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil da ONG:', error);
      throw error;
    }
  }

  // 🔹 REMOVIDA: Função registerOngInBackend - Não vamos mais criar automaticamente

  // Função para salvar perfil da ONG
  function saveOngProfile(profile) {
    localStorage.setItem('ongProfile', JSON.stringify(profile));
    console.log('💾 Perfil da ONG salvo no localStorage:', profile);
  }

  // 🔹 MODIFICADA: Função principal de login com verificação
  async function handleLogin(user, token) {
    try {
      console.log('🔄 Iniciando processo de login...');

      // 🔹 VERIFICAÇÃO CRÍTICA: Buscar perfil da ONG no MySQL
      const profile = await fetchOngProfile(token);
      
      if (!profile) {
        throw new Error('ONG não encontrada no sistema. Faça o cadastro primeiro.');
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
      console.log('🚀 Redirecionando para perfilong.html...');
      
      window.location.href = "../perfil-users/perfilong.html";

    } catch (error) {
      console.error('❌ Erro no processo de login:', error);
      
      // 🔹 LOGOUT NO FIREBASE se a ONG não existe no MySQL
      try {
        await auth.signOut();
        console.log('🚪 Usuário desconectado do Firebase (ONG não existe no MySQL)');
      } catch (signOutError) {
        console.error('Erro ao fazer logout:', signOutError);
      }
      
      alert('❌ ' + error.message);
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
        
        // 🔹 VERIFICAÇÃO PRÉVIA: Checar se ONG existe no MySQL antes do Firebase
        const ongExists = await checkOngExistsInDatabase(email);
        if (!ongExists) {
          throw new Error('ONG não cadastrada. Faça o cadastro primeiro.');
        }

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
        
        // 🔹 VERIFICAÇÃO PRÉVIA para Google também
        const ongExists = await checkOngExistsInDatabase(user.email);
        if (!ongExists) {
          throw new Error('ONG não cadastrada. Faça o cadastro primeiro.');
        }
        
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
        // 🔹 VERIFICAÇÃO: Só permitir redefinição se ONG existir
        const ongExists = await checkOngExistsInDatabase(email);
        if (!ongExists) {
          throw new Error('ONG não cadastrada. Faça o cadastro primeiro.');
        }

        await sendPasswordResetEmail(auth, email);
        alert("✅ E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.");
      } catch (error) {
        console.error("❌ Erro ao enviar e-mail de redefinição:", error);
        alert("❌ " + error.message);
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
      if (error.message.includes('ONG não cadastrada')) {
        alert(error.message);
      } else {
        alert(`❌ Erro ao fazer login: ${error.message}`);
      }
  }
}