// cadastro.js - VERSÃO CORRIGIDA
import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script de cadastro carregado!");

  const btnCadastrar = document.getElementById("btnCadastrar");

  btnCadastrar?.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;
    const confirmarSenha = document.getElementById("confirmarSenha")?.value;

    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (senha.length < 6) {
      alert("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    try {
      console.log('Iniciando cadastro...');
      
      // Cria usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      console.log('Usuário Firebase criado:', user.uid);

      // Atualiza o nome do usuário
      await updateProfile(user, { displayName: nome });
      
      // Envia verificação por email
      await sendEmailVerification(user);

      // Registra usuário no backend MySQL
      console.log('Registrando usuário no backend...');
      
      const response = await fetch('http://localhost:3002/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          nome: nome,
          data_nascimento: null
        })
      });

      const result = await response.json();
      console.log('Resposta do backend:', result);

      if (response.ok) {
        alert(`Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.`);
        
        // Salva dados do usuário
        const userProfile = {
          id_usuario: result.user.id_usuario,
          nome: nome,
          email: email,
          firebase_uid: user.uid
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Redireciona para a página de perfil
        window.location.href = "../perfil-users/perfilusuario.html";
      } else {
        throw new Error(result.error || 'Erro ao registrar no backend');
      }

    } catch (error) {
      console.error("Erro completo no cadastro:", error);
      
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
        case "auth/network-request-failed":
          alert("Erro de conexão. Verifique sua internet.");
          break;
        default:
          alert("Erro ao cadastrar: " + (error.message || "Tente novamente."));
      }
    }
  });
});