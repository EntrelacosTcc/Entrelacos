// Definição de Imagem - perfil usuário
const imgUser = document.querySelector('.img-user');
const inputImagem = document.getElementById('inputImagem');
const btnAlterarImagem = document.getElementById('btnAlterarImagem');

// Clicar no círculo ou no botão abre o seletor
imgUser.addEventListener('click', () => inputImagem.click());
btnAlterarImagem.addEventListener('click', () => inputImagem.click());

// Ao selecionar imagem, aplica no círculo
inputImagem.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        imgUser.style.backgroundImage = `url(${e.target.result})`;
        imgUser.style.backgroundSize = 'cover';
        imgUser.style.backgroundPosition = 'center';
    }
    reader.readAsDataURL(file);
});
