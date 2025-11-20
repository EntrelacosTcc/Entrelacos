const navbarPath = "/src/components/navbar.html";
const footerPath = "/src/components/footer.html";
const doacaoPath = "/src/components/doacao.html";

// NAVBAR PATH
fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    initNavbarDropdown();
    updateCartIcon(); // <<< atualiza o ícone do carrinho quando a navbar carregar
  })
  .catch(err => console.error("Erro ao carregar navbar:", err));


// FOOTER PATH
fetch(footerPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
    initNavbarDropdown();
  })
  .catch(err => console.error("Erro ao carregar footer:", err));



// ===============================
// SISTEMA DE CARRINHO
// ===============================

// Salvar no localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("carrinho")) || [];

  cart.push(product);

  localStorage.setItem("carrinho", JSON.stringify(cart));

  updateCartIcon();
}


// Atualizar o número do carrinho no ícone
function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("carrinho")) || [];
  const countElement = document.getElementById("cart-count");

  if (countElement) {
    countElement.textContent = cart.length;
  }
}



// COMPONENTE VAGA
class VagaComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const imagem = this.getAttribute('imagem');
    const imagemHTML = imagem 
      ? `<img src="${imagem}" alt="${this.getAttribute('titulo')}" class="vaga-img">`
      : `<div class="vaga-img"></div>`;

    this.innerHTML = `
    <div class="vagas">
        ${imagemHTML}
        <h3>${this.getAttribute('titulo')}</h3>
        <a href="src/perfil-users/publicoong.html"><h4>${this.getAttribute('ong')}</h4></a>
        <div class="tags-vagas">
            ${this.getCausas()}
        </div>
        <p>${this.getAttribute('descricao')}</p>
        <div class="vagas-info">
            <div class="dados-vaga"><i class="fa-solid fa-location-dot fa-lg"></i>${this.getAttribute('localizacao')}</div>
            <div class="dados-vaga"><i class="fa-solid fa-calendar"></i>${this.getAttribute('frequencia')}</div>
            <div class="dados-vaga"><i class="fa-solid fa-clock"></i>${this.getAttribute('carga-horaria')}</div>
        </div>
        <center><button>Participe</button></center>
    </div>
    `;
  }

  getCausas() {
    const causas = this.getAttribute('causas');
    if (causas) {
      return causas.split(',').map(causa => 
          `<div class="causa">${causa.trim()}</div>`
      ).join('');
    }
    return '';
  }
}

customElements.define('vaga-item', VagaComponent);


// DOACAO PATH
fetch(doacaoPath)
  .then(response => response.text())
  .then(data => {
    const doacao = document.getElementsByClassName("doacao-container");
    
    Array.from(doacao).forEach(doacao => {
      doacao.innerHTML = data;
    });
  })
  .catch(err => console.error("Erro ao carregar pedido de doação:", err));



// Dropdown
function initNavbarDropdown() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const content = dropdown.querySelector('.dropdown-content');

    if (!btn || !content) return;

    dropdown.addEventListener('mouseenter', () => {
      dropdown.classList.add('show');
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdown.classList.remove('show');
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('show');
    });
  });
}



// *************************
// MENU HAMBURGUER MOBILE
function toggleMenu() {
  const menuContainer = document.querySelector(".mobile-menuContainer");
  const overlay = document.querySelector(".overlay");

  if (!menuContainer || !overlay) return;

  const isOpen = menuContainer.style.display === "block";

  if (isOpen) {
    menuContainer.style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  } else {
    menuContainer.style.display = "block";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".menu-saida")) {
    document.querySelector(".mobile-menuContainer").style.display = "none";
    document.querySelector(".overlay").style.display = "none";
    document.body.style.overflow = "auto";
  }

  if (e.target.classList.contains("overlay")) {
    document.querySelector(".mobile-menuContainer").style.display = "none";
    document.querySelector(".overlay").style.display = "none";
    document.body.style.overflow = "auto";
  }
});


// API Sienna
if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js"]')) {
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js";
  s.defer = true;
  s.onload = () => console.log("Sienna widget carregado");
  s.onerror = () => console.error("Erro ao carregar widget");
  document.body.appendChild(s);
}


// API Vlibras
if (!document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) {
  const container = document.createElement("div");
  container.setAttribute("vw", "");
  container.classList.add("enabled");

  container.innerHTML = `
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  `;

  document.body.appendChild(container);

  const script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.defer = true;

  script.onload = () => {
    console.log("VLibras carregado com sucesso!");
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  };

  script.onerror = () => {
    console.error("Erro ao carregar VLibras");
  };

  document.body.appendChild(script);
}



// animação scroll
window.addEventListener('DOMContentLoaded', () => {
  const elementos = document.querySelectorAll('.animar-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('mostrar');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.2 });

  elementos.forEach(el => observer.observe(el));
});


