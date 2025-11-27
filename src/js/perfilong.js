// perfilong.js - versão sem salvar perfil no localStorage, puxa do banco sempre
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class PerfilOngManager {
  constructor() {
    this.ongProfile = null;
    
    this.init();
  }

  // API publico para compatibilidade
  async saveGeneralInfo() {
    return this.salvarInformacoesGerais();
  }

  async init() {
    await this.loadOngProfile();
    this.setupEventListeners();
    this.updateProfileDisplay();
    this.initPostSystem();
  }

  // Pega token: prefere sessionStorage.ongToken, senão tenta Firebase currentUser
  async getAuthToken() {
    try {
      const sessionToken = sessionStorage.getItem("ongToken");
      if (sessionToken) {
        console.log("🔑 Usando token da sessionStorage");
        return sessionToken;
      }

      if (auth.currentUser) {
        const t = await auth.currentUser.getIdToken();
        console.log("🔑 Token obtido do Firebase currentUser");
        return t;
      }

      console.warn("⚠️ Nenhum token disponível (sessionStorage vazio e Firebase currentUser não setado)");
      return "";
    } catch (err) {
      console.error("Erro ao obter token:", err);
      return "";
    }
  }

  // Carrega perfil do backend (sempre do DB)
  async loadOngProfile() {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        console.error("Token ausente — redirecionando para login");
        window.location.href = "../login/loginong.html";
        return;
      }

      const res = await fetch("http://localhost:3002/api/ong/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (res.status === 401) {
        console.error("401 ao carregar perfil — token inválido/expirado");
        // Deslogar/redirect para login
        try { await auth.signOut(); } catch (e) { /* ignore */ }
        window.location.href = "../login/loginong.html";
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro ao carregar perfil:", res.status, text);
        alert("Erro ao carregar perfil. Veja console.");
        return;
      }

      const profile = await res.json();
      // O backend pode retornar { message, profile } ou o objeto diretamente.
      this.ongProfile = profile.profile ? profile.profile : profile;
      console.log("✅ Perfil carregado do DB:", this.ongProfile);

      // Preenche o formulário com os dados do DB (não salva localmente)
      this.populateForm();
      this.updateProfileDisplay();

    } catch (err) {
      console.error("Erro na loadOngProfile:", err);
      alert("Erro ao carregar perfil. Verifique o console.");
    }
  }

  // Preenche campos do formulário com o objeto this.ongProfile
  populateForm() {
    if (!this.ongProfile) return;

    console.log("📝 Preenchendo formulário com:", this.ongProfile);

    // Informações gerais
    this.setValue("descricao", this.ongProfile.descricao);
    this.setValue("classificacao", this.ongProfile.classificacao);
    this.setValue("endereco", this.ongProfile.endereco);
    this.setChecked("exibir_endereco", !!this.ongProfile.exibir_endereco);

    // Contatos
    this.setValue("telefone", this.ongProfile.telefone);
    this.setValue("email_contato", this.ongProfile.email_contato || this.ongProfile.email);
    this.setValue("instagram", this.ongProfile.instagram);
    this.setValue("website", this.ongProfile.website);
    this.setValue("facebook", this.ongProfile.facebook);

    // Causas (pode vir array ou string JSON)
    this.loadCausas();

    // Imagens
    this.loadImages();

    // Header
    this.loadHeaderInfo();
  }

  setValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (value === null || value === undefined) {
      // limpar só se o campo estiver realmente vazio no DB
      // el.value = ""; // não forçar limpeza se preferir preservar
      return;
    }
    el.value = value;
  }

  setChecked(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = !!value;
  }

  loadCausas() {
    if (!this.ongProfile) return;

    let causas = [];
    // backend returns causas_atuacao as array or JSON string
    const raw = this.ongProfile.causas_atuacao ?? this.ongProfile.causas_atuacao;
    if (!raw) {
      this.atualizarCausasUI();
      return;
    }

    if (Array.isArray(raw)) causas = raw;
    else {
      try { causas = JSON.parse(raw); }
      catch { causas = typeof raw === "string" && raw ? [raw] : []; }
    }

    const checkboxes = document.querySelectorAll('input[name="causas_atuacao"]');
    checkboxes.forEach(cb => {
      cb.checked = causas.includes(cb.value);
    });

    this.atualizarCausasUI();
  }

  atualizarCausasUI() {
    const perfilCausas = document.getElementById("perfilCausas");
    if (!perfilCausas) return;

    const selecionadas = Array.from(document.querySelectorAll('input[name="causas_atuacao"]:checked'))
      .map(cb => cb.value);

    perfilCausas.innerHTML = "";
    selecionadas.forEach(c => {
      const tag = document.createElement("div");
      tag.classList.add("causa-tag");
      tag.textContent = c;
      perfilCausas.appendChild(tag);
    });
  }

  loadImages() {
    // capa
    if (this.ongProfile.capa) {
      const bgDiv = document.getElementById("bgUpload");
      if (bgDiv) {
        bgDiv.style.backgroundImage = `url(${this.ongProfile.capa})`;
        bgDiv.style.backgroundSize = "cover";
        bgDiv.style.backgroundPosition = "center";
      }
    }
    // foto perfil
    if (this.ongProfile.foto) {
      const pDiv = document.getElementById("profileUpload");
      if (pDiv) {
        pDiv.style.backgroundImage = `url(${this.ongProfile.foto})`;
        pDiv.style.backgroundSize = "cover";
        pDiv.style.backgroundPosition = "center";
        this.updateNavbarImage(this.ongProfile.foto);
      }
    }
  }

  loadHeaderInfo() {
    const el = document.getElementById("ongNomeHeader");
    if (el && this.ongProfile.nome_ong) el.textContent = this.ongProfile.nome_ong;
  }

  updateNavbarImage(imageUrl) {
    window.dispatchEvent(new CustomEvent("ongProfileUpdated", {
      detail: { foto: imageUrl, nome_ong: this.ongProfile.nome_ong }
    }));
  }

  setupEventListeners() {
    const checkboxes = document.querySelectorAll('input[name="causas_atuacao"]');
    const maxCausas = 3;
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const selecionadas = Array.from(checkboxes).filter(c => c.checked);
        if (selecionadas.length > maxCausas) {
          cb.checked = false;
          alert(`Você pode selecionar no máximo ${maxCausas} causas.`);
          return;
        }
        this.atualizarCausasUI();
      });
    });

    this.setupImageUpload();
  }

  setupImageUpload() {
    const bgDiv = document.getElementById('bgUpload');
    const bgInput = document.getElementById('bgInput');
    const profileDiv = document.getElementById('profileUpload');
    const profileInput = document.getElementById('profileInput');

    if (bgDiv && bgInput) {
        bgDiv.addEventListener('click', () => bgInput.click());
        bgInput.addEventListener('change', (e) => this.handleImageUpload(e, 'capa')); // 'capa' no backend
    }

    if (profileDiv && profileInput) {
        profileDiv.addEventListener('click', () => profileInput.click());
        profileInput.addEventListener('change', (e) => this.handleImageUpload(e, 'foto')); // 'foto' no backend
    }
}

async handleImageUpload(event, field) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Selecione apenas imagens.');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('Máximo 5MB por imagem.');
        return;
    }

    try {
        // converter a imagem em base64 (ou enviar para storage real)
        const imageUrl = await this.uploadImage(file);

        // Atualizar preview
        const div = field === 'capa' ? document.getElementById('bgUpload') : document.getElementById('profileUpload');
        if (div) {
            const style = field === 'capa'
                ? 'width:100%; height:100%; object-fit:cover;'
                : 'width:100%; height:100%; object-fit:cover; border-radius:50%;';
            div.innerHTML = `<img src="${imageUrl}" alt="${field}" style="${style}">`;
        }

        // Atualizar no backend
        await this.updateProfile({ [field]: imageUrl });

        // Atualizar objeto local
        this.ongProfile[field] = imageUrl;

        // Atualizar navbar se for a foto de perfil
        if (field === 'foto') this.updateNavbar();

        alert('Imagem atualizada com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar imagem:', err);
        alert('Erro ao atualizar imagem.');
    }
}

async uploadImage(file) {
    // Converte para base64
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ---------- handleImageUpload ----------
// ---------- salvarInformacoesGerais ----------
async salvarInformacoesGerais() {
  try {
    const selecionadas = Array.from(document.querySelectorAll('input[name="causas_atuacao"]:checked'))
      .map(cb => cb.value);

    // ⚡ Mesclar com this.ongProfile para não sobrescrever campos existentes com null
    const data = {
      ...this.ongProfile,
      descricao: document.getElementById("descricao")?.value ?? this.ongProfile.descricao,
      classificacao: document.getElementById("classificacao")?.value ?? this.ongProfile.classificacao,
      endereco: document.getElementById("endereco")?.value ?? this.ongProfile.endereco,
      causas_atuacao: selecionadas.length > 0 ? selecionadas : this.ongProfile.causas_atuacao
    };

    await this.updateProfile(data);
    alert("Informações gerais salvas com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar gerais:", err);
    alert("Erro ao salvar informações.");
  }
}

// ---------- salvarContatos ----------
async salvarContatos() {
  try {
    const data = {
      ...this.ongProfile,
      telefone: document.getElementById("telefone")?.value ?? this.ongProfile.telefone,
      email_contato: document.getElementById("email_contato")?.value ?? this.ongProfile.email_contato,
      instagram: document.getElementById("instagram")?.value ?? this.ongProfile.instagram,
      website: document.getElementById("website")?.value ?? this.ongProfile.website,
      facebook: document.getElementById("facebook")?.value ?? this.ongProfile.facebook
    };

    await this.updateProfile(data);
    alert("Contatos salvos com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar contatos:", err);
    alert("Erro ao salvar contatos.");
  }
}

// ---------- handleImageUpload ----------
async handleImageUpload(event, type) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { alert("Selecione uma imagem."); return; }
  if (file.size > 5 * 1024 * 1024) { alert("Máx 5MB."); return; }

  try {
    const imageUrl = await this.uploadImage(file);

    // Atualiza preview da imagem
    const div = type === "capa" ? document.getElementById("bgUpload") : document.getElementById("profileUpload");
    if (div) {
      div.style.backgroundImage = `url(${imageUrl})`;
      div.style.backgroundSize = "cover";
      div.style.backgroundPosition = "center";
    }

    // ⚡ Mesclar imagem com this.ongProfile para não sobrescrever outros campos
    const payload = { ...this.ongProfile, [type]: imageUrl };

    const token = await this.getAuthToken();
    if (!token) throw new Error("Token ausente");

    const res = await fetch("http://localhost:3002/api/ong/profile", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Status ${res.status}`);
    }

    const ret = await res.json();
    const updated = ret.profile ? ret.profile : ret;

    // Atualiza this.ongProfile com o retorno do servidor
    this.ongProfile = { ...this.ongProfile, ...updated };
    if (type === "foto") this.updateNavbarImage(imageUrl);

    alert("Imagem atualizada com sucesso!");
  } catch (err) {
    console.error("Erro upload imagem:", err);
    alert("Erro ao atualizar imagem.");
  }
}

  // atualiza perfil no backend
  async updateProfile(data) {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error("Token ausente. Faça login novamente.");

      // filtrar keys vazias para não sobrescrever sem querer
      const payload = {};
      Object.keys(data).forEach(k => {
        // permitir arrays (causas_atuacao) e booleanos (exibir_endereco)
        if (data[k] !== undefined) payload[k] = data[k];
      });

      const res = await fetch("http://localhost:3002/api/ong/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        console.error("401 updateProfile -> token inválido");
        await auth.signOut().catch(()=>{});
        window.location.href = "../login/loginong.html";
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        console.error("Erro no updateProfile:", res.status, txt);
        throw new Error(txt || `Status ${res.status}`);
      }

      const ret = await res.json();
      // controller costuma retornar { message, profile }
      const updated = ret.profile ? ret.profile : ret;

      // Atualizar this.ongProfile com o retorno do servidor (não salvar no localStorage)
      this.ongProfile = { ...this.ongProfile, ...updated };
      console.log("✅ Perfil atualizado (do servidor):", this.ongProfile);

      // Re-popular UI com o perfil retornado
      this.populateForm();
      this.updateProfileDisplay();

      return updated;
    } catch (err) {
      console.error("Erro updateProfile:", err);
      throw err;
    }
  }

  updateProfileDisplay() {
    if (!this.ongProfile) return;
    this.loadHeaderInfo();
  }

  // ---------- Post system (mantive localStorage, opcional remover) -----------
  initPostSystem() {
    const STORAGE_KEY = "entrelacos_ong_posts_v1";
    let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const postsContainer = document.getElementById("posts");
    const btnOpenModal = document.getElementById("btn-open-modal");
    const modal = document.getElementById("modal");
    const btnCancel = document.getElementById("btn-cancel");
    const btnPost = document.getElementById("btn-post");
    const postOptions = document.querySelectorAll(".post-option");
    const textPost = document.getElementById("text-post");
    const imagePost = document.getElementById("image-post");
    const postContent = document.getElementById("post-content");
    const postImage = document.getElementById("post-image");
    const imagePreview = document.getElementById("image-preview");
    const previewImg = document.getElementById("preview-img");
    const removeImage = document.getElementById("remove-image");
    const imageCaption = document.getElementById("image-caption");

    function formatDate(d = new Date()) { return d.toLocaleDateString("pt-BR"); }
    function saveToStorage() { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
    function escapeHtml(str) { return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

    function renderFeed() {
      if (!postsContainer) return;
      postsContainer.innerHTML = "";
      posts.forEach(post => {
        const likeClass = post.liked ? "active" : "";
        const el = document.createElement("div");
        el.className = "post";
        el.innerHTML = `
          <div class="post-header">
            <div class="post-avatar">${post.author ? post.author.charAt(0) : "O"}</div>
            <div>
              <div class="post-author">${post.author}</div>
              <div class="post-date">${post.date}</div>
            </div>
          </div>
          <div class="post-content">
            <p>${escapeHtml(post.content)}</p>
            ${post.image ? `<img class="post-image" src="${post.image}" alt="Imagem do post">` : ""}
          </div>
          <div class="post-actions">
            <div class="post-action like-action ${likeClass}" data-id="${post.id}">
              <div class="action-content">
                <i class="fa-solid fa-heart"></i>
                <span>${post.likes}</span>
              </div>
            </div>
          </div>
        `;
        postsContainer.appendChild(el);
      });
    }

    if (postsContainer) {
      postsContainer.addEventListener("click", e => {
        const actionEl = e.target.closest(".post-action");
        if (!actionEl) return;
        const id = Number(actionEl.dataset.id);
        const post = posts.find(p => p.id === id);
        if (!post) return;
        if (actionEl.classList.contains("like-action")) {
          post.liked = !post.liked;
          post.likes += post.liked ? 1 : -1;
          if (post.likes < 0) post.likes = 0;
        }
        saveToStorage();
        renderFeed();
      });
    }

    if (btnOpenModal) {
      btnOpenModal.addEventListener("click", () => {
        if (modal) { modal.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
      });
    }

    function resetModal() {
      if (modal) modal.classList.add("hidden");
      document.body.style.overflow = "auto";
      if (postContent) postContent.value = "";
      if (postImage) postImage.value = "";
      if (imageCaption) imageCaption.value = "";
      if (previewImg) previewImg.src = "";
      if (imagePreview) imagePreview.classList.add("hidden");
      if (postOptions) { postOptions.forEach(o => o.classList.remove("active")); if (postOptions[0]) postOptions[0].classList.add("active"); }
      if (textPost) textPost.classList.remove("hidden");
      if (imagePost) imagePost.classList.add("hidden");
    }

    if (btnCancel) btnCancel.addEventListener("click", resetModal);

    if (postOptions) {
      postOptions.forEach(opt => {
        opt.addEventListener("click", () => {
          postOptions.forEach(o => o.classList.remove("active"));
          opt.classList.add("active");
          const type = opt.dataset.type;
          if (type === "text") {
            if (textPost) textPost.classList.remove("hidden");
            if (imagePost) imagePost.classList.add("hidden");
            if (imagePreview) imagePreview.classList.add("hidden");
            if (previewImg) previewImg.src = "";
            if (postImage) postImage.value = "";
            if (imageCaption) imageCaption.value = "";
          } else {
            if (textPost) textPost.classList.add("hidden");
            if (imagePost) imagePost.classList.remove("hidden");
          }
        });
      });
    }

    if (postImage) {
      postImage.addEventListener("change", () => {
        const file = postImage.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          if (previewImg) previewImg.src = e.target.result;
          if (imagePreview) imagePreview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      });
    }

    if (removeImage) {
      removeImage.addEventListener("click", () => {
        if (previewImg) previewImg.src = "";
        if (imagePreview) imagePreview.classList.add("hidden");
        if (postImage) postImage.value = "";
        if (imageCaption) imageCaption.value = "";
      });
    }

    if (btnPost) {
      btnPost.addEventListener("click", () => {
        const activeOption = document.querySelector(".post-option.active");
        if (!activeOption) return;
        const type = activeOption.dataset.type;
        if (type === "text") {
          const content = postContent ? postContent.value.trim() : "";
          if (!content) return alert("Post Criado com Sucesso!");
          createPost(content, null);
        } else {
          const file = postImage ? postImage.files[0] : null;
          if (!file) return alert("Selecione uma imagem!");
          const caption = imageCaption ? imageCaption.value.trim() : "";
          const reader = new FileReader();
          reader.onload = e => createPost(caption, e.target.result);
          reader.readAsDataURL(file);
        }
        resetModal();
        renderFeed();
      });
    }

    function createPost(content, image) {
      const author = this?.ongProfile?.nome_ong || "ONG";
      const post = {
        id: Date.now(),
        author,
        date: formatDate(),
        content,
        image,
        likes: 0,
        liked: false
      };
      posts.unshift(post);
      saveToStorage();
    }

    renderFeed();
  }
}

// Inicializar quando DOM pronto + verificar auth
document.addEventListener("DOMContentLoaded", function() {
  console.log("⌛ Iniciando perfil ONG (aguardando Firebase auth)...");
  const unregister = onAuthStateChanged(auth, user => {
    if (user) {
      console.log("🔥 Usuário autenticado — inicializando PerfilOngManager");
      window.perfilOngManager = new PerfilOngManager();
      unregister();
    } else {
      console.log("⚠️ Usuário não autenticado — redirecionando para login");
      window.location.href = "../login/loginong.html";
    }
  });
});

// funções globais compatíveis com HTML
window.salvarInformacoesGerais = function () {
  if (window.perfilOngManager) return window.perfilOngManager.salvarInformacoesGerais();
  console.error("perfilOngManager não encontrado");
};
window.salvarContatos = function () {
  if (window.perfilOngManager) return window.perfilOngManager.salvarContatos();
  console.error("perfilOngManager não encontrado");
};

function salvarInformacoesGerais() {
  if (window.perfilOngManager) return window.perfilOngManager.salvarInformacoesGerais();
}
function salvarContatos() {
  if (window.perfilOngManager) return window.perfilOngManager.salvarContatos();
}
