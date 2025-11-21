import { auth } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const googleBtn = document.querySelector(".icons img");

  // === LOGIN COM E-MAIL E SENHA ===
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      if (!email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const nomeUsuario = userCredential.user.displayName || "Usuário";
        alert(`Bem-vindo(a), ${nomeUsuario}!`);
        console.log("Usuário logado:", userCredential.user);

        // redirecionar após login
      window.location.href = "../pages-html/carrinho-endereco.html";

      } catch (error) {
        console.error("Erro no login:", error);

        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
            alert("E-mail ou senha incorretos. Verifique suas credenciais.");
            break;
          case "auth/invalid-email":
            alert("O e-mail digitado não é válido.");
            break;
          case "auth/user-not-found":
            alert("Usuário não encontrado. Faça o cadastro primeiro.");
            break;
          case "auth/too-many-requests":
            alert("Muitas tentativas de login. Tente novamente mais tarde.");
            break;
          default:
            alert("Erro ao fazer login. Tente novamente mais tarde.");
        }
      }
    });
  }

  // === LOGIN COM GOOGLE ===
  if (googleBtn) {
    const provider = new GoogleAuthProvider();

    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        alert(`Bem-vindo(a), ${user.displayName || "Usuário"}!`);
        console.log("Usuário logado com Google:", user);

        // redirecionar após login com Google
       window.location.href = "../pages-html/carrinho-endereco.html";

      } catch (error) {
        console.error("Erro no login com Google:", error);

        if (error.code === "auth/popup-closed-by-user") {
          alert("Login cancelado. Tente novamente.");
        } else if (error.code === "auth/unauthorized-domain") {
          alert("Domínio não autorizado no Firebase. Adicione seu site em 'Domínios autorizados'.");
        } else if (error.code === "auth/operation-not-allowed") {
          alert("Login com Google não está ativado no Firebase.");
        } else {
          alert("Não foi possível fazer login com Google. Verifique as configurações e tente novamente.");
        }
      }
    });
  }
});
