// perfilong.js
import { auth } from "./firebase.js";

// ===============================
// Causas principais - ONG
// ===============================
document.addEventListener('DOMContentLoaded', async () => {

  // === ELEMENTOS ===
  const checkboxes = document.querySelectorAll(".causas-checkboxes input[type='checkbox']");
  const perfilCausas = document.getElementById("perfilCausas");
  const maxCausas = 3;

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

  const bgDiv = document.getElementById('bgUpload');
  const bgInput = document.getElementById('bgInput');
  const profileDiv = document.getElementById('profileUpload');
  const profileInput = document.getElementById('profileInput');

  const STORAGE_KEY = "entrelacos_ong_posts_v1";
  let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // ===============================
  // Funções utilitárias
  // ===============================
  function formatDate(d = new Date()) {
    return d.toLocaleDateString("pt-BR");
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // ===============================
  // Causas - seleção
  // ===============================
  const atualizarCausas = () => {
    if (!perfilCausas) return;
    const selecionadas = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    perfilCausas.innerHTML = '';
    selecionadas.forEach(causa => {
      const tag = document.createElement('div');
      tag.classList.add('causa-tag');
      tag.textContent = causa;
      perfilCausas.appendChild(tag);
    });
  };

  const salvarCausas = () => {
    const selecionadas = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    localStorage.setItem('causasOng', JSON.stringify(selecionadas));
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const selecionadas = Array.from(checkboxes).filter(cb => cb.checked);
      if (selecionadas.length > maxCausas) {
        cb.checked = false;
        alert(`Você pode selecionar no máximo ${maxCausas} causas.`);
        return;
      }
      atualizarCausas();
      salvarCausas();
    });
  });

  // Carrega causas salvas
  const causasSalvas = JSON.parse(localStorage.getItem('causasOng'));
  if (causasSalvas) {
    checkboxes.forEach(cb => cb.checked = causasSalvas.includes(cb.value));
    atualizarCausas();
  }

  // ===============================
  // Feed de posts
  // ===============================
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

  postsContainer?.addEventListener("click", e => {
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

  // ===============================
  // Modal de posts
  // ===============================
  btnOpenModal?.addEventListener("click", () => {
    modal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  function resetModal() {
    modal?.classList.add("hidden");
    document.body.style.overflow = "auto";
    postContent.value = "";
    postImage.value = "";
    imageCaption.value = "";
    previewImg.src = "";
    imagePreview?.classList.add("hidden");
    postOptions.forEach(o => o.classList.remove("active"));
    postOptions[0]?.classList.add("active");
    textPost.classList.remove("hidden");
    imagePost.classList.add("hidden");
  }

  btnCancel?.addEventListener("click", resetModal);

  postOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      postOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");

      const type = opt.dataset.type;
      if (type === "text") {
        textPost.classList.remove("hidden");
        imagePost.classList.add("hidden");
        imagePreview?.classList.add("hidden");
        previewImg.src = "";
        postImage.value = "";
        imageCaption.value = "";
      } else {
        textPost.classList.add("hidden");
        imagePost.classList.remove("hidden");
      }
    });
  });

  postImage?.addEventListener("change", () => {
    const file = postImage.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      imagePreview?.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  removeImage?.addEventListener("click", () => {
    previewImg.src = "";
    imagePreview?.classList.add("hidden");
    postImage.value = "";
    imageCaption.value = "";
  });

  btnPost?.addEventListener("click", () => {
    const type = document.querySelector(".post-option.active")?.dataset.type;
    if (!type) return;

    if (type === "text") {
      const content = postContent.value.trim();
      if (!content) return alert("Escreva algo antes de postar!");
      createPost(content, null);
    } else {
      const file = postImage.files[0];
      if (!file) return alert("Selecione uma imagem!");
      const caption = imageCaption.value.trim();
      const reader = new FileReader();
      reader.onload = e => createPost(caption, e.target.result);
      reader.readAsDataURL(file);
    }

    resetModal();
    renderFeed();
  });

  function createPost(content, image) {
    const ongProfile = JSON.parse(localStorage.getItem("ongProfile"));
    const post = {
      id: Date.now(),
      author: ongProfile?.nome_ong || "ONG",
      date: formatDate(),
      content,
      image,
      likes: 0,
      liked: false
    };
    posts.unshift(post);
    saveToStorage();
  }

  // ===============================
  // Upload de perfil e capa
  // ===============================
  if (bgDiv) bgDiv.addEventListener('click', () => bgInput.click());
  if (profileDiv) profileDiv.addEventListener('click', () => profileInput.click());

  if (bgInput) bgInput.addEventListener('change', () => previewImage(bgInput, bgDiv));
  if (profileInput) profileInput.addEventListener('change', () => previewImage(profileInput, profileDiv));

  function previewImage(input, div) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => div.innerHTML = `<img src="${e.target.result}" alt="Imagem">`;
    reader.readAsDataURL(file);
  }

  // ===============================
  // Inicialização feed
  // ===============================
  renderFeed();

  // ===============================
  // Carregar perfil da ONG
  // ===============================
  async function loadOngProfile() {
    try {
      const ongProfile = JSON.parse(localStorage.getItem("ongProfile"));
      if (!ongProfile?.firebase_uid) return;

      const response = await fetch(`http://localhost:3002/api/ong/profile/${ongProfile.firebase_uid}`);
      if (response.ok) {
        const profile = await response.json();
        localStorage.setItem('ongProfile', JSON.stringify(profile));
        updateProfileDisplay(profile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil da ONG:', error);
    }
  }

  function updateProfileDisplay(profile) {
    if (!profile) return;

    const nomeOngElement = document.querySelector('.navbar-header h1');
    if (nomeOngElement && profile.nome_ong) {
      nomeOngElement.textContent = profile.nome_ong;
    }

    // Atualizar email, estado, etc.
    const emailEl = document.getElementById('email_ong');
    if (emailEl && profile.email) emailEl.textContent = profile.email;

    const estadoEl = document.getElementById('estado_ong');
    if (estadoEl && profile.estado) estadoEl.textContent = profile.estado;
  }

  // Carrega perfil
  loadOngProfile();
});
