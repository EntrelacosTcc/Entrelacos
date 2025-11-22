
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

  async function fetchUserProfile(token) {
    try {
      const response = await fetch('http://localhost:3002/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Erro ao buscar perfil");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }
  }

  async function registerUserInBackend(uid, email, nome) {
    try {
      const response = await fetch('http://localhost:3002/api/register-user', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          email,
          nome,
          data_nascimento: null
        })
      });

      if (!response.ok) throw new Error("Erro ao registrar usuário");
      return await response.json();

    } catch (error) {
      console.error("Erro no registro backend:", error);
      throw error;
    }
  }

  function saveUserProfile(profile) {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    console.log("Perfil salvo:", profile);
  }

  async function handleLogin(user, token) {
    try {
      let profile = await fetchUserProfile(token);

      if (!profile) {
        const nome = user.displayName || user.email.split("@")[0];
        await registerUserInBackend(user.uid, user.email, nome);
        profile = await fetchUserProfile(token);
      }

      saveUserProfile(profile);

      alert(`Bem-vindo(a), ${user.displayName || "Usuário"}!`);
      window.location.href = "../perfil-users/perfilusuario.html";

    } catch (error) {
      console.error("Erro no processo de login:", error);
      alert("Erro durante o login. Tente novamente.");
    }
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      if (!email || !senha) return alert("Preencha todos os campos!");

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        const token = await user.getIdToken();
        await handleLogin(user, token);

      } catch (error) {
        console.error("Erro login:", error);
        handleAuthError(error);
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        await handleLogin(user, token);

      } catch (error) {
        console.error("Erro Google:", error);
        handleAuthError(error);
      }
    });
  }

  if (esqueceuSenha) {
    esqueceuSenha.addEventListener("click", async e => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();

      if (!email) return alert("Digite seu e-mail.");

      try {
        await sendPasswordResetEmail(auth, email);
        alert("E-mail enviado!");

      } catch (error) {
        console.error("Erro redefinir:", error);
        alert("Erro ao enviar e-mail.");
      }
    });
  }
});

function handleAuthError(error) {
  console.error(error);

  const map = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde.",
    "auth/network-request-failed": "Erro de conexão.",
    "auth/popup-closed-by-user": "Login cancelado."
  };

  alert(map[error.code] || error.message);
}
