const abas = document.querySelectorAll('.detalhes-title h2');
const conteudos = document.querySelectorAll('.conteudo');

abas.forEach(aba => {
  aba.addEventListener('click', () => {
    // remove ativo de todos
    abas.forEach(a => a.classList.remove('ativo'));
    conteudos.forEach(c => c.classList.remove('ativo'));

    // adiciona ativo na aba clicada e seu conteúdo
    aba.classList.add('ativo');
    document.querySelector(`.${aba.dataset.target}`).classList.add('ativo');
  });
});
