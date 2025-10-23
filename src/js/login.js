import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");

  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);

      const nomeUsuario = userCredential.user.displayName; 
      alert(`Bem-vindo(a), ${nomeUsuario}!`);
      console.log("Usuário logado:", userCredential.user);

    } catch (error) {
      console.error("Erro no login:", error);

      // Tratamento baseado na mensagem retornada
      if (error.message.includes("user-not-found")) {
        alert("Não existe uma conta com esse e-mail. Cadastre-se primeiro.");
      } else if (error.message.includes("wrong-password")) {
        alert("Senha incorreta. Tente novamente.");
      } else if (error.message.includes("invalid-email")) {
        alert("O e-mail digitado não é válido.");
      } else {
        alert("Erro ao fazer login. Tente novamente mais tarde.");
      }
    }
  });
});
