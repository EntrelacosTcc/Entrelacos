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
