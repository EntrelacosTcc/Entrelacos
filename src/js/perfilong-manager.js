class PerfilOngManager {
    constructor() {
        this.ongProfile = null;
        this.init();
    }

    async init() {
        await this.loadOngProfile();
        this.setupEventListeners();
        this.updateProfileDisplay();
    }

    async loadOngProfile() {
        try {
            const ongProfile = JSON.parse(localStorage.getItem('ongProfile'));
            if (!ongProfile?.firebase_uid) {
                console.error('Perfil da ONG não encontrado no localStorage');
                this.redirectToLogin();
                return;
            }

            const token = await this.getFirebaseToken();
            const response = await fetch(`http://localhost:3002/api/ong/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.ongProfile = await response.json();
                localStorage.setItem('ongProfile', JSON.stringify(this.ongProfile));
                this.populateForm();
                console.log('✅ Perfil da ONG carregado:', this.ongProfile);
            } else if (response.status === 401) {
                console.error('Token inválido ou expirado');
                this.redirectToLogin();
            } else {
                console.error('Erro ao carregar perfil da ONG:', response.status);
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            this.redirectToLogin();
        }
    }

    // redirectToLogin() {
    //     setTimeout(() => {
    //         alert('❌ Sessão expirada. Faça login novamente.');
    //         window.location.href = './login-ong.html';
    //     }, 1000);
    // }

    async getFirebaseToken() {
        return new Promise((resolve) => {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().currentUser?.getIdToken().then(resolve).catch(() => resolve(''));
            } else {
                const ongProfile = JSON.parse(localStorage.getItem('ongProfile'));
                resolve(ongProfile?.firebase_token || '');
            }
        });
    }

//     /* =========================
//    Load profile into UI
//    ========================= */
// async function loadProfileFromBackend() {
//   const profile = await fetchUserProfile();
//   if (!profile) return;

//   $('#email').value = profile.email || '';
//   $('#telefone').value = profile.telefone || '';
//   $('#instagram').value = profile.instagram || '';
//   $('#endereco').value = profile.endereco || '';
//   $('#nome_ong').value = profile.nome_ong || '';
//   $('#descricao').value = profile.descricao || '';

//   if (profile.foto) {
//     const imgUser = $('.img-user');
//     imgUser.style.backgroundImage = `url(${profile.foto})`;
//     imgUser.style.backgroundSize = 'cover';
//     imgUser.style.backgroundPosition = 'center';
//     _perfilImgBase64 = profile.foto;
//   }

//   $('#name').textContent = profile.nome || 'Usuário';

//   // preencher causas
//   if (profile.tags) {
//     const tags = profile.tags.split(',').map(t => t.trim()).filter(Boolean);
//     const checkboxes = $all('.causas-checkboxes input[type="checkbox"]');
//     checkboxes.forEach(cb => cb.checked = tags.includes(cb.value));
//     atualizarCausasUI();
//   }
// }

    populateForm() {
        if (!this.ongProfile) return;

        console.log('📝 Preenchendo formulário com dados:', this.ongProfile);

        // Informações Gerais - usando os campos da tabela ong
        const descricao = document.getElementById('descricao');
        const classificacao = document.getElementById('classificacao');
        const endereco = document.getElementById('endereco');

        if (descricao) descricao.value = this.ongProfile.descricao || '';
        if (classificacao) classificacao.value = this.ongProfile.classificacao || '';
        if (endereco) endereco.value = this.ongProfile.endereco || '';
        
        // Causas - vindo da tabela perfil_ong
        this.loadCausas();
        
        // Contatos - vindo da tabela ong
        const telefone = document.getElementById('telefone');
        const email_contato = document.getElementById('email_contato');
        const instagram = document.getElementById('instagram');
        const website = document.getElementById('website');
        const facebook = document.getElementById('facebook');

        if (telefone) telefone.value = this.ongProfile.telefone || '';
        if (email_contato) email_contato.value = this.ongProfile.email || '';
        if (instagram) instagram.value = this.ongProfile.instagram || '';
        if (website) website.value = this.ongProfile.website || '';
        if (facebook) facebook.value = this.ongProfile.facebook || '';

        // Carregar informações do header
        this.loadHeaderInfo();
    }

    loadCausas() {
        if (!this.ongProfile?.causas_atuacao) return;
        
        let causas;
        try {
            causas = Array.isArray(this.ongProfile.causas_atuacao) 
                ? this.ongProfile.causas_atuacao 
                : JSON.parse(this.ongProfile.causas_atuacao || '[]');
        } catch (e) {
            console.error('Erro ao parsear causas:', e);
            causas = [];
        }
        
        const checkboxes = document.querySelectorAll('.causas-checkboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = causas.includes(checkbox.value);
        });
        this.atualizarCausas();
    }

    loadHeaderInfo() {
        // Atualizar nome da ONG no header
        const nomeOngElement = document.querySelector('.navbar-header h1');
        if (nomeOngElement && this.ongProfile.nome_ong) {
            nomeOngElement.textContent = this.ongProfile.nome_ong;
        }

        // Aqui você pode carregar outras informações do header se necessário
    }

    atualizarCausas() {
        const perfilCausas = document.getElementById("perfilCausas");
        if (!perfilCausas) return;

        const selecionadas = Array.from(document.querySelectorAll('.causas-checkboxes input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        perfilCausas.innerHTML = '';
        selecionadas.forEach(causa => {
            const tag = document.createElement('div');
            tag.classList.add('causa-tag');
            tag.textContent = causa;
            perfilCausas.appendChild(tag);
        });
    }

    async salvarInformacoesGerais() {
        try {
            const selecionadas = Array.from(document.querySelectorAll('.causas-checkboxes input[type="checkbox"]:checked'))
                .map(cb => cb.value);

            const data = {
                descricao: document.getElementById('descricao').value,
                causas_atuacao: selecionadas,
                classificacao: document.getElementById('classificacao').value,
                endereco: document.getElementById('endereco').value
            };

            await this.updateProfile(data);
            alert('Informações gerais salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar informações:', error);
            alert('Erro ao salvar informações');
        }
    }

    async salvarContatos() {
        try {
            const data = {
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email_contato').value,
                instagram: document.getElementById('instagram').value,
                website: document.getElementById('website').value,
                facebook: document.getElementById('facebook').value
            };

            await this.updateProfile(data);
            alert('Contatos salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar contatos:', error);
            alert('Erro ao salvar contatos');
        }
    }

    async updateProfile(data) {
        const token = await this.getFirebaseToken();
        const response = await fetch(`http://localhost:3002/api/ong/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const updatedProfile = await response.json();
            this.ongProfile = { ...this.ongProfile, ...updatedProfile };
            localStorage.setItem('ongProfile', JSON.stringify(this.ongProfile));
            this.updateProfileDisplay();
            return updatedProfile;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar perfil');
        }
    }

    updateProfileDisplay() {
        if (!this.ongProfile) return;

        // Atualizar navbar
        this.updateNavbar();
        
        // Atualizar header do perfil
        this.loadHeaderInfo();
    }

    updateNavbar() {
        if (typeof updateNavbarWithOng === 'function') {
            updateNavbarWithOng(this.ongProfile);
        }
    }

    setupEventListeners() {
        // Event listeners para as causas
        const checkboxes = document.querySelectorAll(".causas-checkboxes input[type='checkbox']");
        const maxCausas = 3;

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const selecionadas = Array.from(checkboxes).filter(cb => cb.checked);
                if (selecionadas.length > maxCausas) {
                    cb.checked = false;
                    alert(`Você pode selecionar no máximo ${maxCausas} causas.`);
                    return;
                }
                this.atualizarCausas();
            });
        });

        // Event listeners para upload de imagens (se você quiser implementar)
        this.setupImageUpload();
    }

    setupImageUpload() {
        const bgDiv = document.getElementById('bgUpload');
        const bgInput = document.getElementById('bgInput');
        const profileDiv = document.getElementById('profileUpload');
        const profileInput = document.getElementById('profileInput');

        if (bgDiv && bgInput) {
            bgDiv.addEventListener('click', () => bgInput.click());
            bgInput.addEventListener('change', (e) => this.handleImageUpload(e, 'bg'));
        }

        if (profileDiv && profileInput) {
            profileDiv.addEventListener('click', () => profileInput.click());
            profileInput.addEventListener('change', (e) => this.handleImageUpload(e, 'profile'));
        }
    }

    async handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas imagens.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }

        try {
            const imageUrl = await this.uploadImage(file);
            
            // Atualizar visualização
            const div = type === 'bg' ? document.getElementById('bgUpload') : document.getElementById('profileUpload');
            const style = type === 'bg' 
                ? 'width: 100%; height: 100%; object-fit: cover;'
                : 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
            
            div.innerHTML = `<img src="${imageUrl}" alt="Imagem ${type}" style="${style}">`;

            alert('Imagem atualizada com sucesso!');
            
            // Se você quiser salvar no banco, precisaria adicionar campos para imagens na tabela ong
            // await this.updateProfile({
            //     [type === 'bg' ? 'bg_image' : 'profile_image']: imageUrl
            // });

        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            alert('Erro ao fazer upload da imagem');
        }
    }

    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Inicializar gerenciador do perfil da ONG
let perfilOngManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando gerenciador do perfil da ONG...');
    perfilOngManager = new PerfilOngManager();
});

// Funções globais para os botões
function salvarInformacoesGerais() {
    if (perfilOngManager) {
        perfilOngManager.salvarInformacoesGerais();
    }
}

function salvarContatos() {
    if (perfilOngManager) {
        perfilOngManager.salvarContatos();
    }
}