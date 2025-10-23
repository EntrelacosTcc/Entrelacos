// cadastro.js
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script de cadastro carregado!");

  const btnCadastrar = document.getElementById("btnCadastrar");

  btnCadastrar.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (senha.length < 6) {
      alert("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    try {
      // Cria usuário
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      // Atualiza o nome do usuário
      await updateProfile(userCredential.user, { displayName: nome });

      alert(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome}!`);

      // Limpa os campos
      document.getElementById("nome").value = "";
      document.getElementById("email").value = "";
      document.getElementById("senha").value = "";

      // Redireciona para a página de login
      window.location.href = "./login.html"; // 🔹 ajusta o caminho se necessário

    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
          break;
        case "auth/invalid-email":
          alert("O e-mail digitado não é válido.");
          break;
        case "auth/weak-password":
          alert("A senha precisa ter no mínimo 6 caracteres.");
          break;
        default:
          alert("Erro ao cadastrar: " + error.message);
      }
      console.error("Erro ao cadastrar:", error);
    }
  });
});
