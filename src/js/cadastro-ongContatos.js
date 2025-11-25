// js/cadastro-ongContatos.js - SEGUNDA PÁGINA (ATUALIZADO)
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página 2 - Contatos da ONG carregada");

    const btnContinuar2 = document.getElementById("btnContinuar2");
    
    if (btnContinuar2) {
        btnContinuar2.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Coletar dados de contato
            const telefone = document.getElementById("telefone")?.value.trim();
            const website = document.getElementById("website")?.value.trim(); // ✅ CORRIGIDO
            const facebook = document.getElementById("facebook")?.value.trim();
            const instagram = document.getElementById("instagram")?.value.trim();

            // Validar campos obrigatórios
            if (!telefone) {
                alert("Por favor, preencha o campo de telefone.");
                return;
            }

            // Salvar contatos no localStorage
            localStorage.setItem('telefone', telefone || '');
            localStorage.setItem('website', website || '');
            localStorage.setItem('facebook', facebook || '');
            localStorage.setItem('instagram', instagram || '');
            
            console.log("Dados de contato salvos:", {
                telefone, website, facebook, instagram
            });
            
            // Ir para página final
            window.location.href = "./cadastro-ongFinal.html";
        });
    }
});