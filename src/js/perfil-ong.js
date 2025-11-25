// ===============================
// Causas principais
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll(".causas-checkboxes input[type='checkbox']");
  const perfilCausas = document.getElementById("perfilCausas");
  const maxCausas = 3;

  // Atualiza a exibição das causas selecionadas
  const atualizarCausas = () => {
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

  // Limita a seleção e atualiza a exibição
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const selecionadas = Array.from(checkboxes).filter(cb => cb.checked);
      if (selecionadas.length > maxCausas) {
        cb.checked = false;
        alert(`Você pode selecionar no máximo ${maxCausas} causas.`);
        return;
      }
      atualizarCausas();
      salvarCausas(); // salva sempre que mudar
    });
  });

  // Salva causas no localStorage
  const salvarCausas = () => {
    const causasSelecionadas = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    localStorage.setItem('causasUsuario', JSON.stringify(causasSelecionadas));
  };

  // Carrega causas salvas
  const causasSalvas = JSON.parse(localStorage.getItem('causasUsuario'));
  if (causasSalvas) {
    checkboxes.forEach(cb => cb.checked = causasSalvas.includes(cb.value));
    atualizarCausas();
  }
});


// JS POSTAGEM

const STORAGE_KEY = "entrelacos_posts_v1";

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
const postsContainer = document.getElementById("posts");

let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* --- Helpers --- */
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString("pt-BR");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* --- Renderizar feed --- */
function renderFeed() {
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const likeClass = post.liked ? "active" : "";

    const el = document.createElement("div");
    el.className = "post";

    el.innerHTML = `
<div class="post-header">
  <div class="post-avatar">${post.author ? post.author.charAt(0) : "U"}</div>
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

/* --- Curtir --- */
postsContainer.addEventListener("click", (e) => {
  const actionEl = e.target.closest(".post-action");
  if (!actionEl) return;

  const id = Number(actionEl.dataset.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  if (actionEl.classList.contains("like-action")) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    if (post.likes < 0) post.likes = 0;
  }

  saveToStorage();
  renderFeed();
});

/* --- Abrir modal --- */
btnOpenModal.addEventListener("click", () => {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

/* --- Fechar e resetar modal --- */
function resetModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
  postContent.value = "";
  postImage.value = "";
  imageCaption.value = "";
  previewImg.src = "";
  imagePreview.classList.add("hidden");

  postOptions.forEach((o) => o.classList.remove("active"));
  postOptions[0].classList.add("active"); // Texto ativo por padrão
  textPost.classList.remove("hidden");
  imagePost.classList.add("hidden");
}

btnCancel.addEventListener("click", resetModal);

/* --- Alternar tipo (Texto / Imagem) --- */
postOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    postOptions.forEach((o) => o.classList.remove("active"));
    opt.classList.add("active");

    const type = opt.dataset.type;
    if (type === "text") {
      textPost.classList.remove("hidden");
      imagePost.classList.add("hidden");

      // Limpar preview e input de imagem ao alternar para texto
      imagePreview.classList.add("hidden");
      previewImg.src = "";
      postImage.value = "";
      imageCaption.value = "";
    } else {
      textPost.classList.add("hidden");
      imagePost.classList.remove("hidden");
      // O preview só aparece se o usuário selecionar uma imagem
    }
  });
});

/* --- Preview imagem --- */
postImage.addEventListener("change", () => {
  const file = postImage.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    imagePreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

removeImage.addEventListener("click", () => {
  previewImg.src = "";
  imagePreview.classList.add("hidden");
  postImage.value = "";
  imageCaption.value = "";
});

/* --- Criar post --- */
btnPost.addEventListener("click", () => {
  const type = document.querySelector(".post-option.active").dataset.type;

  if (type === "text") {
    const content = postContent.value.trim();
    if (!content) return alert("Escreva algo antes de postar!");
    createPost(content, null);
  } else {
    const file = postImage.files[0];
    if (!file) return alert("Selecione uma imagem!");
    const caption = imageCaption.value.trim();
    const reader = new FileReader();
    reader.onload = (e) => createPost(caption, e.target.result);
    reader.readAsDataURL(file);
  }

  resetModal();
  renderFeed();
});

/* --- Criar post helper --- */
function createPost(content, image) {
  const post = {
    id: Date.now(),
    author: "Raízes do Futuro",
    date: formatDate(),
    content,
    image,
    likes: 0,
    liked: false
  };
  posts.unshift(post);
  saveToStorage();
}

const bgDiv = document.getElementById('bgUpload');
const bgInput = document.getElementById('bgInput');
const profileDiv = document.getElementById('profileUpload');
const profileInput = document.getElementById('profileInput');

bgDiv.addEventListener('click', () => bgInput.click());
profileDiv.addEventListener('click', () => profileInput.click());

bgInput.addEventListener('change', () => previewImage(bgInput, bgDiv));
profileInput.addEventListener('change', () => previewImage(profileInput, profileDiv));

function previewImage(input, div) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      div.innerHTML = `<img src="${e.target.result}" alt="Imagem">`;
    };
    reader.readAsDataURL(file);
  }
}

renderFeed();



document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById('pedidosDoacoes-container');

    if (!container) {
        console.error("Container #pedidosDoacoes-container não encontrado.");
        return;
    }

    const pedidos = JSON.parse(localStorage.getItem('todosPedidos')) || [];

    if (pedidos.length === 0) {
        container.innerHTML = "<p>Nenhum pedido cadastrado.</p>";
        return;
    }

    container.innerHTML = "";

    pedidos.forEach(pedido => {
        const itensEmLinha = pedido.itens.map(i => i.nome).join(' / ');

        const div = document.createElement('div');
        div.classList.add('vagaDoacao-box');

        div.innerHTML = `
            <div class="doacaoImage"></div>
            <div class="vagaDoacaoInfo">
                <h3>${pedido.nome}</h3>
                <p>Itens necessários: ${itensEmLinha}</p>
                <div class="status-vagaDoacao">Até ${pedido.prazo}</div>
            </div>
            <button class="cancelarPedidoBtn" data-id="${pedido.id}">Cancelar Pedido</button>
        `;

        container.appendChild(div);
    });

    // Cancelar pedido
    document.addEventListener("click", function(e) {
      if (e.target.classList.contains("cancelarPedidoBtn")) {
        const id = Number(e.target.dataset.id);

        let pedidos = JSON.parse(localStorage.getItem("todosPedidos")) || [];
        pedidos = pedidos.filter(p => p.id !== id);
        localStorage.setItem("todosPedidos", JSON.stringify(pedidos));

        const box = e.target.closest(".vagaDoacao-box");
        if (box) box.remove();
      }
    });

});
