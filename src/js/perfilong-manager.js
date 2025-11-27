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
            const token = await this.getFirebaseToken();
            if (!token) throw new Error('Token ausente. Faça login novamente.');

            const response = await fetch(`http://localhost:3002/api/ong/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.ongProfile = await response.json();
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

    redirectToLogin() {
        setTimeout(() => {
            alert('❌ Sessão expirada. Faça login novamente.');
            window.location.href = '../pages-html/login-ong.html';
        }, 1000);
    }

    async getFirebaseToken() {
        // aqui você deve obter o token do Firebase diretamente
        if (firebase && firebase.auth && firebase.auth().currentUser) {
            return await firebase.auth().currentUser.getIdToken();
        }
        return '';
    }

    populateForm() {
        if (!this.ongProfile) return;

        console.log('📝 Preenchendo formulário com dados:', this.ongProfile);

        // Informações gerais
        const descricao = document.getElementById('descricao');
        const classificacao = document.getElementById('classificacao');
        const endereco = document.getElementById('endereco');

        if (descricao) descricao.value = this.ongProfile.descricao || '';
        if (classificacao) classificacao.value = this.ongProfile.classificacao || '';
        if (endereco) endereco.value = this.ongProfile.endereco || '';

        // Causas
        this.loadCausas();

        // Contatos
        const telefone = document.getElementById('telefone');
        const email_contato = document.getElementById('email_contato');
        const instagram = document.getElementById('instagram');

        if (telefone) telefone.value = this.ongProfile.telefone || '';
        if (email_contato) email_contato.value = this.ongProfile.email_contato || '';
        if (instagram) instagram.value = this.ongProfile.instagram || '';

        // Carregar imagens
        this.loadImages();

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

    loadImages() {
        if (this.ongProfile.foto) {
            const profileDiv = document.getElementById('profileUpload');
            if (profileDiv) {
                profileDiv.innerHTML = `<img src="${this.ongProfile.foto}" alt="Imagem de perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
        }
        if (this.ongProfile.capa) {
            const bgDiv = document.getElementById('bgUpload');
            if (bgDiv) {
                bgDiv.innerHTML = `<img src="${this.ongProfile.capa}" alt="Imagem de capa" style="width: 100%; height: 100%; object-fit: cover;">`;
            }
        }
    }

    loadHeaderInfo() {
        const nomeOngElement = document.querySelector('.navbar-header h1');
        if (nomeOngElement && this.ongProfile.nome_ong) {
            nomeOngElement.textContent = this.ongProfile.nome_ong;
        }
    }

    async salvarInformacoesGerais() {
        try {
            const descricao = document.getElementById('descricao').value;
            const classificacao = document.getElementById('classificacao').value;
            const endereco = document.getElementById('endereco').value;

            const selecionadas = Array.from(document.querySelectorAll('.causas-checkboxes input[type="checkbox"]:checked'))
                .map(cb => cb.value);

            const data = {
                ...this.ongProfile, // merge para não sobrescrever dados existentes
                descricao: descricao || this.ongProfile.descricao,
                classificacao: classificacao || this.ongProfile.classificacao,
                endereco: endereco || this.ongProfile.endereco,
                causas_atuacao: selecionadas.length > 0 ? selecionadas : this.ongProfile.causas_atuacao
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
            const telefone = document.getElementById('telefone').value;
            const email_contato = document.getElementById('email_contato').value;
            const instagram = document.getElementById('instagram').value;

            const data = {
                ...this.ongProfile,
                telefone: telefone || this.ongProfile.telefone,
                email_contato: email_contato || this.ongProfile.email_contato,
                instagram: instagram || this.ongProfile.instagram
            };

            await this.updateProfile(data);
            alert('Contatos salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar contatos:', error);
            alert('Erro ao salvar contatos.');
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

            const div = type === 'bg' ? document.getElementById('bgUpload') : document.getElementById('profileUpload');
            const style = type === 'bg' 
                ? 'width: 100%; height: 100%; object-fit: cover;'
                : 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';

            div.innerHTML = `<img src="${imageUrl}" alt="Imagem ${type}" style="${style}">`;

            const field = type === 'bg' ? 'capa' : 'foto';
            await this.updateProfile({ ...this.ongProfile, [field]: imageUrl });

            this.ongProfile[field] = imageUrl;

            if (type === 'profile') this.updateNavbar();

            alert('Imagem atualizada com sucesso!');
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

    async updateProfile(data) {
        try {
            const token = await this.getFirebaseToken();
            const response = await fetch(`http://localhost:3002/api/ong/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao atualizar perfil');
            }

            const updatedProfile = await response.json();
            this.ongProfile = { ...this.ongProfile, ...updatedProfile };
            this.updateProfileDisplay();
            return updatedProfile;
        } catch (error) {
            console.error('Erro updateProfile:', error);
            throw error;
        }
    }

    updateProfileDisplay() {
        if (!this.ongProfile) return;
        this.updateNavbar();
        this.loadHeaderInfo();
    }

    updateNavbar() {
        if (typeof updateNavbarWithOng === 'function') {
            updateNavbarWithOng(this.ongProfile);
        }
    }

    setupEventListeners() {
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

        this.setupImageUpload();

        const btnSalvarInfoGerais = document.querySelector('#opcao1 .btnSalvar');
        if (btnSalvarInfoGerais) btnSalvarInfoGerais.addEventListener('click', () => this.salvarInformacoesGerais());

        const btnSalvarContatos = document.querySelector('#opcao2 .btnSalvar');
        if (btnSalvarContatos) btnSalvarContatos.addEventListener('click', () => this.salvarContatos());
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
}

// Inicializar
let perfilOngManager;
document.addEventListener('DOMContentLoaded', function() {
    perfilOngManager = new PerfilOngManager();
});

// Funções globais para botões
function salvarInformacoesGerais() {
    if (perfilOngManager) perfilOngManager.salvarInformacoesGerais();
}
function salvarContatos() {
    if (perfilOngManager) perfilOngManager.salvarContatos();
}
