// ===========================
// 1. BUSCAR VAGAS DO BANCO
// ===========================

async function carregarVagasDoBanco() {
  const carrossel = document.getElementById("carrossel1");
  carrossel.innerHTML = ""; // limpa antes de carregar

  try {
    const response = await fetch("http://localhost:3002/api/vagas");
    const vagas = await response.json();

    vagas.forEach(vaga => {
      const card = document.createElement("div");
      card.classList.add("card-volunt");

      card.innerHTML = `
        <img src="${vaga.imagem_url || 'https://picsum.photos/600/400'}" class="card-img">
        <div class="card-body">

          <h3>${vaga.titulo}</h3>
          <p class="ong">${vaga.nome_ong || "Organização"}</p>

          <p class="descricao">${vaga.visao_geral || "Sem descrição disponível."}</p>

          <div class="infos">
            <div><span class="icon">⏳</span> ${vaga.formato_trabalho}</div>
            <div><span class="icon">🕒</span> ${vaga.horas || 0} horas</div>
            <div><span class="icon">📅</span> ${vaga.status}</div>
          </div>

  <button class="btn-participar"
    onclick="window.location.href='../pages-html/vagas-info.html?id=${vaga.id_vaga}'">
    Participe
</button>

        </div>
      `;

      carrossel.appendChild(card);
    });

    // Atualizar indicadores do carrossel após criar cards
    setTimeout(() => {
      if (window.carrosselManager) {
        window.carrosselManager.initIndicators();
      }
    }, 300);

  } catch (erro) {
    console.log("Erro ao buscar vagas:", erro);
  }
}



// ===========================
// 2. CLASSE DO CARROSSEL
// ===========================

class CarrosselManager {
  constructor() {
    this.carrosseis = ['carrossel1'];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initIndicators();
  }

  setupEventListeners() {
    document.querySelectorAll('.arrow').forEach(arrow => {
      arrow.addEventListener('click', (e) => {
        const carrosselId = e.target.getAttribute('data-carrossel');
        const direction = parseInt(e.target.getAttribute('data-direction'));
        this.scrollCarrossel(carrosselId, direction);
      });
    });

    window.addEventListener('resize', () => {
      this.initIndicators();
    });

    // Scroll listeners
    this.carrosseis.forEach(id => {
      const carrossel = document.getElementById(id);
      if (carrossel) {
        carrossel.addEventListener('scroll', () => {
          this.updateIndicators(id);
        });
      }
    });
  }

  scrollCarrossel(carrosselId, direction) {
    const carrossel = document.getElementById(carrosselId);
    const card = carrossel?.querySelector('.card-volunt');

    if (!card) return;

    const gap = parseInt(window.getComputedStyle(carrossel).gap) || 25;
    const scrollAmount = (card.offsetWidth + gap) * direction;

    carrossel.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });

    setTimeout(() => this.updateIndicators(carrosselId), 300);
  }

  initIndicators() {
    this.carrosseis.forEach(id => {
      const carrossel = document.getElementById(id);
      const cards = carrossel?.querySelectorAll('.card-volunt');

      const indicators = document.getElementById(`indicators${id.slice(-1)}`);
      if (!indicators || !cards) return;

      indicators.innerHTML = "";

      const totalIndicators = Math.ceil(cards.length / this.getVisibleCards());

      for (let i = 0; i < totalIndicators; i++) {
        const indicator = document.createElement("div");
        indicator.className = "indicator";
        indicator.addEventListener('click', () => this.scrollToCard(id, i));
        indicators.appendChild(indicator);
      }

      this.updateIndicators(id);
    });
  }

  getVisibleCards() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1024) return 2;
    return 3;
  }

  scrollToCard(carrosselId, index) {
    const carrossel = document.getElementById(carrosselId);
    const card = carrossel.querySelector(".card-volunt");

    if (!card) return;

    const gap = parseInt(window.getComputedStyle(carrossel).gap) || 25;
    const scroll = index * (card.offsetWidth + gap) * this.getVisibleCards();

    carrossel.scrollTo({
      left: scroll,
      behavior: "smooth"
    });

    this.updateIndicators(carrosselId);
  }

  updateIndicators(carrosselId) {
    const carrossel = document.getElementById(carrosselId);
    const indicators = document.getElementById(`indicators${carrosselId.slice(-1)}`)?.querySelectorAll(".indicator");

    if (!indicators || indicators.length === 0) return;

    const card = carrossel.querySelector(".card-volunt");
    if (!card) return;

    const gap = parseInt(window.getComputedStyle(carrossel).gap) || 25;
    const cardWidth = card.offsetWidth + gap;
    const visible = this.getVisibleCards();

    const active = Math.min(
      Math.round(carrossel.scrollLeft / (cardWidth * visible)),
      indicators.length - 1
    );

    indicators.forEach((i, index) => {
      i.classList.toggle("active", index === active);
    });
  }
}



// ===========================
// 3. INICIALIZAÇÃO
// ===========================

document.addEventListener("DOMContentLoaded", async () => {
  window.carrosselManager = new CarrosselManager();
  await carregarVagasDoBanco();
});
