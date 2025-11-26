// =============================================
// CONFIGURAÇÃO DE PATHS
// =============================================
const navbarPath = "/src/components/navbar.html";
const footerPath = "/src/components/footer.html";
const doacaoPath = "/src/components/doacao.html";

// =============================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando carregamento dos componentes...');

    checkAuth();

    if (document.getElementById("navbar")) {
        loadNavbar();
    }

    if (document.getElementById("footer")) {
        loadFooter();
    }

    loadDoacaoComponents();

    initVagaComponents();
    initAccessibility();
});

// =============================================
// CARREGAMENTO DE COMPONENTES
// =============================================

// NAVBAR
function loadNavbar() {
    console.log('📦 Carregando navbar...');
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
            console.log('✅ Navbar carregado com sucesso');

            try {
                const stored = localStorage.getItem('userProfile');
                if (stored) {
                    const profile = JSON.parse(stored);
                    if (typeof updateNavbarWithUser === 'function') updateNavbarWithUser(profile);
                }
            } catch (e) {
                console.warn('Erro ao restaurar userProfile na navbar', e);
            }

            initNavbarDropdown();
            initNavbarAuth();
            initMobileMenu();
            updateCartIcon();
        })
        .catch(err => {
            console.error("❌ Erro ao carregar navbar:", err);
            document.getElementById("navbar").innerHTML = `
                <div style="padding: 10px; background: #f8f9fa; text-align: center;">
                    <strong>Entrelaços</strong> | 
                    <a href="/index.html">Home</a> | 
                    <a href="/src/pages-html/entrar.html">Entrar</a>
                </div>
            `;
        });
}

// FOOTER
function loadFooter() {
    console.log('📦 Carregando footer...');
    fetch(footerPath)
        .then(response => {
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.getElementById("footer").innerHTML = data;
            console.log('✅ Footer carregado com sucesso');
            initNavbarDropdown();
        })
        .catch(err => {
            console.error("❌ Erro ao carregar footer:", err);
        });
}

// COMPONENTES DE DOAÇÃO
function loadDoacaoComponents() {
    const doacaoElements = document.getElementsByClassName("doacao-container");

    if (doacaoElements.length > 0) {
        console.log('📦 Carregando componentes de doação...');
        fetch(doacaoPath)
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                return response.text();
            })
            .then(data => {
                Array.from(doacaoElements).forEach(el => el.innerHTML = data);
                console.log('✅ Componentes de doação carregados');
            })
            .catch(err => console.error("❌ Erro ao carregar componentes de doação:", err));
    }
}


// =============================================
// COMPONENTE VAGA (CORRIGIDO)
// =============================================
class VagaItem extends HTMLElement {
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

// Registrar componente apenas uma vez
if (!customElements.get('vaga-item')) {
    customElements.define('vaga-item', VagaItem);
}

function initVagaComponents() {
    console.log('✅ Componentes Vaga inicializados');
}

// =============================================
// SISTEMA DE CARRINHO
// =============================================
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("carrinho")) || [];
    cart.push(product);
    localStorage.setItem("carrinho", JSON.stringify(cart));
    updateCartIcon();
}

function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem("carrinho")) || [];
    const countElement = document.getElementById("cart-count");
    if (countElement) countElement.textContent = cart.length;
}

// =============================================
// NAVBAR FUNCTIONALITIES
// =============================================
function initNavbarDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    if (dropdowns.length === 0) return;

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');

        if (!btn || !content) return;

        dropdown.addEventListener('mouseenter', () => dropdown.classList.add('show'));
        dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('show'));

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('show');
        });
    });

    console.log('✅ Dropdowns do navbar inicializados');
}

// =============================================
// SISTEMA DE AUTENTICAÇÃO
// =============================================
function initNavbarAuth() {
    const userProfile = localStorage.getItem('userProfile');
    const ongProfile = localStorage.getItem('ongProfile');

    if (userProfile) {
        try {
            updateNavbarWithUser(JSON.parse(userProfile));
        } catch {
            localStorage.removeItem('userProfile');
        }
    } else if (ongProfile) {
        try {
            updateNavbarWithOng(JSON.parse(ongProfile));
        } catch {
            localStorage.removeItem('ongProfile');
        }
    }

    setupLogout();
    console.log('✅ Sistema de autenticação do navbar inicializado');
}

function updateNavbarWithUser(profile) {
    const authItem = document.getElementById('auth-item');
    const enterBtn = document.querySelector('.enter-btn');

    if (!authItem || !enterBtn) return;

    const firstName = profile.nome ? profile.nome.split(' ')[0] : 'Usuário';

    enterBtn.innerHTML = `
        <div class="user-navbar-info" style="display: flex; align-items: center; gap: 8px; cursor: pointer; justify-content: center;">
            <img src="${profile.foto || '/src/assets/img/default-avatar.png'}"
                 style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid #4CAF50;">
            <span style="color: #fff; font-weight: 500; font-size: 10px;">${firstName}</span>
        </div>
    `;

    const authLink = authItem.querySelector('a');
    if (authLink) authLink.href = "/src/perfil-users/perfilusuario.html";

    addUserDropdown(authItem, profile);
}

function addUserDropdown(authItem, profile) {
    const existing = authItem.querySelector('.user-dropdown');
    if (existing) existing.remove();

    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.cssText = `
        position: absolute; top: 100%; right: 0;
        background: white; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 10px 0; min-width: 180px;
        display: none; z-index: 1000;
    `;

    dropdown.innerHTML = `
        <div style="padding: 10px 15px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold;">${profile.nome}</div>
            <div style="font-size: 12px; color: #666;">${profile.email}</div>
        </div>
        <a href="/src/perfil-users/perfilusuario.html" style="display: block; padding: 10px 15px;">
            <i class="fas fa-user"></i> Meu Perfil
        </a>
        <a href="#" class="logout-btn" style="display: block; padding: 10px 15px; color: #e74c3c;">
            <i class="fas fa-sign-out-alt"></i> Sair
        </a>
    `;

    authItem.style.position = 'relative';
    authItem.appendChild(dropdown);

    authItem.querySelector('.user-navbar-info').addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!authItem.contains(e.target)) dropdown.style.display = 'none';
    });
}

function updateNavbarWithOng(profile) {
    const authItem = document.getElementById('auth-item');
    const enterBtn = document.querySelector('.enter-btn');

    if (!authItem || !enterBtn) return;

    const firstName = profile.nome_ong ? profile.nome_ong.split(' ')[0] : 'ONG';

    enterBtn.innerHTML = `
        <div class="user-navbar-info" style="display: flex; align-items: center; gap: 8px; cursor: pointer; justify-content: center;">
            <img src="${profile.profileImage || '/src/assets/img/default-avatar.png'}"
                 style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid #4CAF50;">
            <span style="color: #000; font-weight: 500; font-size: 10px;">${firstName}</span>
        </div>
    `;

    const authLink = authItem.querySelector('a');
    if (authLink) authLink.href = "/src/perfil-users/perfilong.html";

    addOngDropdown(authItem, profile);
}

function addOngDropdown(authItem, profile) {
    const existing = authItem.querySelector('.user-dropdown');
    if (existing) existing.remove();

    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.cssText = `
        position: absolute; top: 100%; right: 0;
        background: white; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 10px 0; min-width: 180px;
        display: none; z-index: 1000;
    `;

    dropdown.innerHTML = `
        <div style="padding: 10px 15px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold;">${profile.nome_ong}</div>
            <div style="font-size: 12px; color: #666;">${profile.email}</div>
        </div>
        <a href="/src/pages-html/perfilong.html" style="display: block; padding: 10px 15px;">
            <i class="fas fa-user"></i> Meu Perfil
        </a>
        <a href="#" class="logout-btn" style="display: block; padding: 10px 15px; color: #e74c3c;">
            <i class="fas fa-sign-out-alt"></i> Sair
        </a>
    `;

    authItem.style.position = 'relative';
    authItem.appendChild(dropdown);

    authItem.querySelector('.user-navbar-info').addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!authItem.contains(e.target)) dropdown.style.display = 'none';
    });
}



function setupLogout() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.logout-btn');
        if (!btn) return;

        e.preventDefault();
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('ongProfile');
            localStorage.removeItem('usuarioLogado');
            sessionStorage.clear();
            window.location.href = '/index.html';
        }
    });
}

// =============================================
// MENU MOBILE
// =============================================
function initMobileMenu() {
    console.log('📱 Inicializando menu mobile...');
}

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".mobile-menuContainer");
  const overlay = document.querySelector(".overlay");

  if (menu) menu.style.display = "";
  if (overlay) overlay.style.display = "";

  document.addEventListener("click", (e) => {
    if (e.target.closest(".menu-saida")) {
      e.preventDefault();
      closeMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("overlay")) {
      closeMenu();
    }
  });
});

function openMenu() {
  const menu = document.querySelector(".mobile-menuContainer");
  const overlay = document.querySelector(".overlay");
  if (!menu || !overlay) return;
  menu.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  const menu = document.querySelector(".mobile-menuContainer");
  const overlay = document.querySelector(".overlay");
  if (!menu || !overlay) return;
  menu.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "auto";
}

function toggleMenu() {
  const menu = document.querySelector(".mobile-menuContainer");
  if (!menu) return;
  menu.classList.contains("open") ? closeMenu() : openMenu();
}

// =============================================
// ACESSIBILIDADE SIENNA API Vlibras
// =============================================
function initAccessibility() {
    loadSiennaAccessibility();
    loadVLibras();
}

function loadSiennaAccessibility() {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js"]')) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js";
        s.defer = true;
        s.onload = () => console.log("✅ Sienna widget carregado");
        s.onerror = () => console.error("❌ Erro ao carregar Sienna");
        document.body.appendChild(s);
    }
}

function loadVLibras() {
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
            console.log("✅ VLibras carregado com sucesso!");
            new window.VLibras.Widget("https://vlibras.gov.br/app");
        };

        document.body.appendChild(script);
    }
}

// =============================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// =============================================
function checkAuth() {
    const protectedPages = [
        '/src/perfil-users/perfilusuario.html',
        '/src/pages-html/perfilusuario.html'
    ];

    const currentPage = window.location.pathname;

    if (protectedPages.some(page => currentPage.includes(page))) {
        const userProfile = localStorage.getItem('userProfile');
        if (!userProfile) {
            window.location.href = '/src/pages-html/entrar.html';
            return false;
        }
    }
    return true;
}

console.log('🎯 main.js carregado - aguardando DOMContentLoaded...');

// =============================================
// ANIMAÇÃO DE SCROLL
// =============================================
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
