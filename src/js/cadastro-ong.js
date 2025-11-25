// js/cadastro-ong.js - PRIMEIRA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página 1 - Informações da ONG carregada");

    const btnContinuar = document.getElementById("btnContinuar");
    
    if (btnContinuar) {
        btnContinuar.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Coletar dados da primeira etapa
            const classificacao = document.getElementById("classificacao")?.value;
            const descricao = document.getElementById("descricao")?.value.trim();
            const endereco = document.getElementById("endereco")?.value.trim();
            const causas = document.getElementById("causas")?.value;
            const nome_responsavel = document.getElementById("nome_responsavel")?.value.trim();
            const cargo_responsavel = document.getElementById("cargo_responsavel")?.value.trim();
            const cnpj = document.getElementById("cnpj")?.value.trim();

            // Validar campos obrigatórios
            if (!classificacao || !causas) {
                alert("Por favor, preencha os campos obrigatórios: Classificação e Causas.");
                return;
            }

            // Salvar dados no localStorage
            localStorage.setItem('classificacao', classificacao);
            localStorage.setItem('descricao', descricao);
            localStorage.setItem('endereco', endereco);
            localStorage.setItem('causas', causas);
            localStorage.setItem('nome_responsavel', nome_responsavel);
            localStorage.setItem('cargo_responsavel', cargo_responsavel);
            localStorage.setItem('cnpj', cnpj);
            
            console.log("Dados da primeira etapa salvos:", {
                classificacao, descricao, endereco, causas, 
                nome_responsavel, cargo_responsavel, cnpj
            });
            
            // Ir para próxima página
            window.location.href = "./cadastro-ongContatos.html";
        });
    }
});