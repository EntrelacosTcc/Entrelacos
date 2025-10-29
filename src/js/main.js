const navbarPath = "/src/components/navbar.html";
const footerPath = "/src/components/footer.html";
const doacaoPath = "/src/components/doacao.html";

// NAVBAR PATH
fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    initNavbarDropdown();
  })
  .catch(err => console.error("Erro ao carregar navbar:", err));


// FOOTER PATH
fetch(footerPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
    initNavbarDropdown(); // ou outra função se quiser para footer
  })
  .catch(err => console.error("Erro ao carregar footer:", err));

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
            <h4>${this.getAttribute('ong')}</h4>
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

    // Hover no container inteiro (resolve o "sumir")
    dropdown.addEventListener('mouseenter', () => {
      dropdown.classList.add('show');
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdown.classList.remove('show');
    });

    // Extra: toggle por clique (funciona no celular)
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('show');
    });
  });
}


