// login.js
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

  // Função para buscar perfil do usuário
  async function fetchOngProfile(token) {
    try {
      const response = await fetch('http://localhost:3002/api/profileOng', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erro ao buscar perfil');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  // Função para registrar usuário no backend
  async function registerOngInBackend(uid, email, nome_ong) {
    try {
      const response = await fetch('http://localhost:3002/api/register-Ong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: uid,
          email: email,
          nome_ong: nome,

        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário no backend');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no registro backend:', error);
      throw error;
    }
  }

  // Função para salvar perfil do usuário
  function saveOngProfile(profile) {
    localStorage.setItem('ongProfile', JSON.stringify(profile));
    console.log('Perfil salvo no localStorage:', profile);
  }

  // Função principal de login
  async function handleLogin(ong, token) {
    try {
      // Verificar se o usuário já está registrado no backend
      let profile;
      try {
        profile = await fetchOngProfile(token);
        console.log('Perfil encontrado:', profile);
      } catch (error) {
        console.log('Usuário não encontrado no backend, registrando...');
        const nome = ong.displayName || ong.email.split('@')[0];
        await registerOngInBackend(ong.uid, ong.email, nome);
        
        // Buscar perfil após registro
        profile = await fetchOngProfile(token);
      }

      // Salvar dados do usuário
      saveOngProfile(profile);
      
      // Atualizar navbar (se estiver disponível)
      if (typeof updateNavbarWithOng === 'function') {
        updateNavbarWithOng(profile);
      }
      
      // Redirecionar
      alert(`Bem-vindo(a), ${ong.displayName || "Usuário"}!`);
      window.location.href = "../perfil-ongs/perfilusuario.html";

    } catch (error) {
      console.error('Erro no processo de login:', error);
      alert('Erro durante o login. Tente novamente.');
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
        console.log('Tentando login com:', email);
        const ongCredential = await signInWithEmailAndPassword(auth, email, senha);
        const ong = ongCredential.ong;
        const token = await ong.getIdToken();
        
        console.log('Login Firebase OK, UID:', ong.uid);
        await handleLogin(ong, token);

      } catch (error) {
        console.error("Erro completo no login:", error);
        handleAuthError(error);
      }
    });
  }

  // === LOGIN COM GOOGLE ===
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        console.log('Iniciando login Google...');
        const result = await signInWithPopup(auth, provider);
        const ong = result.ong;
        const token = await ong.getIdToken();
        
        console.log('Login Google OK, UID:', ong.uid);
        await handleLogin(ong, token);

      } catch (error) {
        console.error("Erro completo no login Google:", error);
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
        alert("E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.");
      } catch (error) {
        console.error("Erro ao enviar e-mail de redefinição:", error);
        alert("Erro ao enviar e-mail de redefinição. Verifique o e-mail digitado.");
      }
    });
  }
});

// Função para tratar erros de autenticação
function handleAuthError(error) {
  console.error("Código do erro:", error.code);
  console.error("Mensagem do erro:", error.message);

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      alert("E-mail ou senha incorretos. Verifique suas credenciais.");
      break;
    case "auth/invalid-email":
      alert("O e-mail digitado não é válido.");
      break;
    case "auth/ong-not-found":
      alert("Usuário não encontrado. Faça o cadastro primeiro.");
      break;
    case "auth/too-many-requests":
      alert("Muitas tentativas de login. Tente novamente mais tarde.");
      break;
    case "auth/network-request-failed":
      alert("Erro de conexão. Verifique sua internet.");
      break;
    case "auth/popup-closed-by-ong":
      alert("Login cancelado. Tente novamente.");
      break;
    default:
      alert(`Erro ao fazer login: ${error.message}`);
  }
}