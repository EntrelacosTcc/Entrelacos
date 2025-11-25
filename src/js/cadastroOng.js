// js/cadastroOng.js - TERCEIRA PÁGINA (CORRIGIDO PARA TABELA ONG)
import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Função auxiliar para tratar valores do localStorage
function getLocalStorageValue(key) {
    const value = localStorage.getItem(key);
    return (value === "undefined" || value === null || value === "") ? null : value;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página 3 - Cadastro Final da ONG carregada");

    const btnCadastrar = document.getElementById("btnCadastrar");

    btnCadastrar?.addEventListener("click", async (e) => {
        e.preventDefault();
        
        // 🔹 Coletar dados da página final
        const nome_ong = document.getElementById("nome")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const senha = document.getElementById("senha")?.value;
        const estado = document.getElementById("estado")?.value;

        // 🔹 Validar campos obrigatórios
        if (!nome_ong || !email || !senha || !estado) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }

        if (senha.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        let user;

        try {
            console.log("Iniciando cadastro completo da ONG...");
            
            // 🔹 1. Criar usuário no Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            user = userCredential.user;

            console.log("Firebase UID da ONG:", user.uid);

            // 🔹 2. Atualizar perfil no Firebase
            await updateProfile(user, { displayName: nome_ong });
            await sendEmailVerification(user);
            console.log("E-mail de verificação enviado.");

            // 🔹 3. Recuperar dados das etapas anteriores do localStorage
            const classificacao = getLocalStorageValue("classificacao");
            const descricao = getLocalStorageValue("descricao");
            const endereco = getLocalStorageValue("endereco");
            const causa = getLocalStorageValue("causas"); // Note: do localStorage vem "causas"
            const nome_responsavel = getLocalStorageValue("nome_responsavel");
            const cargo_responsavel = getLocalStorageValue("cargo_responsavel");
            const cnpj = getLocalStorageValue("cnpj");
            const telefone = getLocalStorageValue("telefone");
            const website = getLocalStorageValue("website");
            const facebook = getLocalStorageValue("facebook");
            const instagram = getLocalStorageValue("instagram");

            console.log("Dados recuperados do localStorage:", {
                classificacao, descricao, endereco, causa,
                nome_responsavel, cargo_responsavel, cnpj,
                telefone, website, facebook, instagram
            });

            // 🔹 4. Preparar dados para a tabela ONG
            const dadosOng = {
                // Campos OBRIGATÓRIOS (baseados no seu erro)
                uid: user.uid,
                email: email,
                nome_ong: nome_ong,
                estado: estado,

                // Campos da tabela ONG (conforme sua estrutura)
                perfil_oficial: null, // ou você pode definir um valor padrão
                classificacao: classificacao,
                nome_responsavel: nome_responsavel,
                cargo_responsavel: cargo_responsavel,
                cnpj: cnpj,
                descricao: descricao,
                endereco: endereco,
                causa: causa,

                // Campos de contato (se estiverem na tabela ong)
                telefone: telefone,
                website: website,
                facebook: facebook,
                instagram: instagram
            };

            console.log("Dados enviando para tabela ONG:", dadosOng);

            // 🔹 5. Enviar para o backend - registrar na tabela ONG
            console.log("Registrando ONG na tabela principal...");
            
            const response = await fetch("http://localhost:3002/api/ong/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosOng)
            });

            const result = await response.json();
            console.log("Resposta do backend:", result);

            if (!response.ok) {
                throw new Error(result.error || "Erro ao registrar ONG no backend.");
            }

            // 🔹 6. Salvar perfil da ONG no localStorage
            const ongProfile = {
                id_ong: result.id_ong || result.ongId,
                uid: user.uid,
                nome_ong: nome_ong,
                email: email,
                estado: estado,
                classificacao: classificacao,
                causa: causa
            };

            localStorage.setItem("ongProfile", JSON.stringify(ongProfile));

            // 🔹 7. Limpar dados temporários do localStorage
            const keysToRemove = [
                "classificacao", "descricao", "endereco", "causas",
                "nome_responsavel", "cargo_responsavel", "cnpj",
                "telefone", "website", "facebook", "instagram"
            ];
            
            keysToRemove.forEach(key => localStorage.removeItem(key));

            alert("✅ ONG cadastrada com sucesso! Verifique seu e-mail para ativar sua conta.");
            window.location.href = "./login-ong.html";

        } catch (error) {
            console.error("Erro no cadastro de ONG:", error);

            // 🔹 Se houve erro no backend, deletar o usuário do Firebase
            if (user) {
                try {
                    await user.delete();
                    console.log("Usuário deletado do Firebase devido a erro no backend");
                } catch (deleteError) {
                    console.error("Erro ao deletar usuário:", deleteError);
                }
            }

            switch (error.code) {
                case "auth/email-already-in-use":
                    alert("❌ Este e-mail já está cadastrado.");
                    break;
                case "auth/invalid-email":
                    alert("❌ E-mail inválido.");
                    break;
                case "auth/weak-password":
                    alert("❌ A senha deve ter pelo menos 6 caracteres.");
                    break;
                case "auth/network-request-failed":
                    alert("❌ Erro de conexão. Tente novamente.");
                    break;
                default:
                    alert(`❌ Erro ao cadastrar ONG: ${error.message}`);
            }
        }
    });
});