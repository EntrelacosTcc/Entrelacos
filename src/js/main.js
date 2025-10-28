const navbarPath = "/src/components/navbar.html";
const footerPath = "/src/components/footer.html";
const vagaPath = "/src/components/vaga.html";

fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    initNavbarDropdown();
  })
  .catch(err => console.error("Erro ao carregar navbar:", err));

fetch(footerPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
    initNavbarDropdown(); // ou outra função se quiser para footer
  })
  .catch(err => console.error("Erro ao carregar footer:", err));

fetch(vagaPath)
  .then(response => response.text())
  .then(data => {
    // Pega todos os elementos com a classe 'vaga'
    const vagas = document.getElementsByClassName("vaga");
    
    // Percorre todos os elementos e injeta o HTML
    Array.from(vagas).forEach(vaga => {
      vaga.innerHTML = data;
    });
  })
  .catch(err => console.error("Erro ao carregar vaga:", err));

  // Dropdown
function initNavbarDropdown() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const content = dropdown.querySelector('.dropdown-content');

    if (!btn || !content) return;

    // Hover no container inteiro (resolve o "sumir")
    dropdown.addEventListener('mouseenter', () => {
      dropdown.classList.add('show');
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdown.classList.remove('show');
    });

    // Extra: toggle por clique (funciona no celular)
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('show');
    });
  });
}


