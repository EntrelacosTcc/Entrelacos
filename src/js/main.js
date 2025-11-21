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
    
    // Verificar autenticação primeiro
    checkAuth();
    
    // Carregar navbar se o elemento existir
    if (document.getElementById("navbar")) {
        loadNavbar();
    }
    
    // Carregar footer se o elemento existir
    if (document.getElementById("footer")) {
        loadFooter();
    }
    
    // Carregar componentes de doação
    loadDoacaoComponents();
    
    // Inicializar outros componentes
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
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
            console.log('✅ Navbar carregado com sucesso');

            // restaura perfil do localStorage (se existir)
            try {
                const stored = localStorage.getItem('userProfile');
                if (stored) {
                const profile = JSON.parse(stored);
                if (typeof updateNavbarWithUser === 'function') updateNavbarWithUser(profile);
                }
            } catch (e) {
                console.warn('Erro ao restaurar userProfile na navbar', e);
            }

            // Inicializar funcionalidades do navbar
            initNavbarDropdown();
            initNavbarAuth();
            initMobileMenu();
        })
        .catch(err => {
            console.error("❌ Erro ao carregar navbar:", err);
            // Fallback: mostrar navbar básico se o arquivo não carregar
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
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer").innerHTML = data;
            console.log('✅ Footer carregado com sucesso');
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
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                Array.from(doacaoElements).forEach(doacao => {
                    doacao.innerHTML = data;
                });
                console.log('✅ Componentes de doação carregados');
            })
            .catch(err => {
                console.error("❌ Erro ao carregar componentes de doação:", err);
            });
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
// NAVBAR FUNCTIONALITIES
// =============================================

// Dropdown do Navbar
function initNavbarDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (dropdowns.length === 0) {
        console.log('⚠️ Nenhum dropdown encontrado no navbar');
        return;
    }

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');

        if (!btn || !content) return;

        // Hover no container inteiro
        dropdown.addEventListener('mouseenter', () => {
            dropdown.classList.add('show');
        });

        dropdown.addEventListener('mouseleave', () => {
            dropdown.classList.remove('show');
        });

        // Toggle por clique (mobile)
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('show');
        });
    });
    
    console.log('✅ Dropdowns do navbar inicializados');
}

// Sistema de Autenticação no Navbar
function initNavbarAuth() {
    // Verificar se há usuário logado no localStorage
    const userProfile = localStorage.getItem('userProfile');
    
    if (userProfile) {
        try {
            const profile = JSON.parse(userProfile);
            updateNavbarWithUser(profile);
        } catch (error) {
            console.error('❌ Erro ao carregar perfil do usuário:', error);
            localStorage.removeItem('userProfile');
        }
    }
    
    // Configurar logout
    setupLogout();
    console.log('✅ Sistema de autenticação do navbar inicializado');
}

function updateNavbarWithUser(profile) {
    const authItem = document.getElementById('auth-item');
    const enterBtn = document.querySelector('.enter-btn');
    
    if (authItem && enterBtn && profile) {
        // Pega o primeiro nome
        const firstName = profile.nome ? profile.nome.split(' ')[0] : 'Usuário';
        
        // Substitui o botão "Entrar" pela foto e nome
        enterBtn.innerHTML = `
            <div class="user-navbar-info" style="display: flex; align-items: center; gap: 8px; cursor: pointer; justify-content: center;">
                <img src="${profile.foto || '/src/assets/img/default-avatar.png'}" 
                     alt="Foto do perfil" 
                     style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid #4CAF50;">
                <span style="color: #000; font-weight: 500; font-size: 10px;">${firstName}</span>
            </div>
        `;
        
        // Muda o link para o perfil
        const authLink = authItem.querySelector('a');
        if (authLink) {
            authLink.href = "/src/perfil-users/perfilusuario.html";
        }
        
        // Adiciona dropdown do usuário
        addUserDropdown(authItem, profile);
    }
}

function addUserDropdown(authItem, profile) {
    // Remove dropdown existente se houver
    const existingDropdown = authItem.querySelector('.user-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
    
    // Cria dropdown do usuário
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 10px 0;
        min-width: 180px;
        display: none;
        z-index: 1000;
    `;
    
    dropdown.innerHTML = `
        <div style="padding: 10px 15px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold; color: #333;">${profile.nome || 'Usuário'}</div>
            <div style="font-size: 12px; color: #666;">${profile.email || ''}</div>
        </div>
        <a href="/src/perfil-users/perfilusuario.html" style="display: block; padding: 10px 15px; color: #333; text-decoration: none; transition: background 0.2s;">
            <i class="fas fa-user" style="margin-right: 8px;"></i>Meu Perfil
        </a>
        <a href="#" class="logout-btn" style="display: block; padding: 10px 15px; color: #e74c3c; text-decoration: none; transition: background 0.2s;">
            <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>Sair
        </a>
    `;
    
    authItem.style.position = 'relative';
    authItem.appendChild(dropdown);
    
    // Mostrar/ocultar dropdown
    const userInfo = authItem.querySelector('.user-navbar-info');
    if (userInfo) {
        userInfo.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    }
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!authItem.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function setupLogout() {
    // Logout via evento delegado (para elementos dinâmicos)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('logout-btn') || e.target.closest('.logout-btn')) {
            e.preventDefault();
            
            if (confirm('Tem certeza que deseja sair?')) {
                // Limpar dados de autenticação
                localStorage.removeItem('userProfile');
                localStorage.removeItem('usuarioLogado');
                sessionStorage.clear();
                
                // Redirecionar para home
                window.location.href = '/index.html';
            }
        }
    });
}

// =============================================
// MENU MOBILE
// =============================================
function initMobileMenu() {
    console.log('📱 Inicializando menu mobile...');
}

function toggleMenu() {
    const menuContainer = document.querySelector(".mobile-menuContainer");
    const overlay = document.querySelector(".overlay");

    if (!menuContainer || !overlay) {
        console.log('❌ Elementos do menu mobile não encontrados');
        return;
    }

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

// Botão de saída (X) do menu mobile
document.addEventListener("click", (e) => {
    if (e.target.closest(".menu-saida")) {
        const menuContainer = document.querySelector(".mobile-menuContainer");
        const overlay = document.querySelector(".overlay");
        
        if (menuContainer && overlay) {
            menuContainer.style.display = "none";
            overlay.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    if (e.target.classList.contains("overlay")) {
        const menuContainer = document.querySelector(".mobile-menuContainer");
        const overlay = document.querySelector(".overlay");
        
        if (menuContainer && overlay) {
            menuContainer.style.display = "none";
            overlay.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

// =============================================
// ACESSIBILIDADE
// =============================================
function initAccessibility() {
    loadSiennaAccessibility();
    loadVLibras();
}

// API Sienna
function loadSiennaAccessibility() {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js"]')) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js";
        s.defer = true;
        s.onload = () => console.log("✅ Sienna widget carregado");
        s.onerror = () => console.error("❌ Erro ao carregar widget Sienna");
        document.body.appendChild(s);
    }
}

// API Vlibras
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
            if (window.VLibras) {
                new window.VLibras.Widget("https://vlibras.gov.br/app");
            }
        };

        script.onerror = () => {
            console.error("❌ Erro ao carregar VLibras");
        };

        document.body.appendChild(script);
    }
}

// =============================================
// VERIFICAÇÃO DE AUTENTICAÇÃO PARA PÁGINAS PROTEGIDAS
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
            // Redirecionar para login se não estiver autenticado
            window.location.href = '/src/pages-html/entrar.html';
            return false;
        }
        
        return true;
    }
    
    return true;
}

console.log('🎯 main.js carregado - aguardando DOMContentLoaded...');