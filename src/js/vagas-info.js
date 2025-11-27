// PEGAR ID PELA URL
const params = new URLSearchParams(window.location.search);
const idVaga = params.get("id");

// Se não tiver ID, erro
if (!idVaga) {
  alert("Nenhuma vaga selecionada.");
  throw new Error("ID da vaga não encontrado");
}

// Buscar vaga
fetch(`http://localhost:3002/api/vagas/${idVaga}`)
  .then(res => res.json())
  .then(vaga => preencherVaga(vaga))
  .catch(err => console.error("Erro ao carregar vaga:", err));

// Função para renderizar listas de tarefas ou requisitos
function renderLista(containerId, lista, icone = "fa-circle") {
  const container = document.getElementById(containerId);

  if (typeof lista === "string") {
    try { lista = JSON.parse(lista); } catch (e) {}
  }

  if (Array.isArray(lista)) {
    container.innerHTML = lista
      .map(item => `
        <div class="vaga-li-content">
          <i class="fa-solid ${icone}"></i>
          <p>${item.trim()}.</p>
        </div>
      `)
      .join("");
  } else if (typeof lista === "string" && lista.trim() !== "") {
    container.innerHTML = `
      <div class="vaga-li-content">
        <i class="fa-solid ${icone}"></i>
        <p>${lista.trim()}.</p>
      </div>
    `;
  } else {
    container.innerHTML = "<p>Não informado.</p>";
  }
}

// Preencher toda a página
function preencherVaga(vaga) {
  document.getElementById("vaga-titulo").textContent = vaga.titulo;
  document.getElementById("vaga-visao").textContent = vaga.visao_geral;
  document.getElementById("vaga-sobre").textContent = vaga.sobre_a_vaga;
  document.getElementById("vaga-ong").textContent = vaga.nome_ong || "ONG";
  document.getElementById("vaga-formato").textContent = vaga.formato_trabalho;
  document.getElementById("vaga-etaria").textContent = vaga.classificacao_etaria;
  
// DATA DA VAGA
document.getElementById("vaga-data").textContent =
    vaga.data_escolhida
        ? new Date(vaga.data_escolhida).toLocaleDateString("pt-BR")
        : "Não informado";

// ENDEREÇO DA VAGA
document.getElementById("vaga-endereco").textContent =
    vaga.endereco || "Não informado";

  // Imagem no hero
  document.getElementById("vaga-imagem").style.backgroundImage = `url('${vaga.imagem_url}')`;

  // TAGS
  document.getElementById("vaga-tags").innerHTML = `
    <div class="causa">${vaga.categoria || "Voluntariado"}</div>
    <div class="causa">${vaga.nome_ong || "ONG"}</div>
  `;

  // TAREFAS
  renderLista("vaga-tarefas", vaga.tarefas_voluntario, "fa-check");

  // REQUISITOS
  renderLista("vaga-requisitos", vaga.requisitos, "fa-circle");

  // CONTATOS
  const contatoContainer = document.querySelector(".contato-box");
  contatoContainer.innerHTML = `
    <h3>Contato</h3>
    <div class="contato-item">
        <i class="fa-solid fa-envelope contato-icone"></i>
        <div>
            <strong>Email</strong><br>
            ${vaga.ong_email || "Não informado"}
        </div>
    </div>
    <div class="contato-item">
        <i class="fa-solid fa-phone contato-icone"></i>
        <div>
            <strong>Telefone</strong><br>
            ${vaga.ong_telefone || "Não informado"}
        </div>
    </div>
  `;
}
