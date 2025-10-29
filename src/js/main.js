const navbarPath = "/src/components/navbar.html";
const footerPath = "/src/components/footer.html";
const vagaPath = "/src/components/vaga.html";
const doacaoPath = "/src/components/doacao.html";

// NAVBAR PATH
fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    initNavbarDropdown();
  })
  .catch(err => console.error("Erro ao carregar navbar:", err));


// FOOTER PATH
fetch(footerPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
    initNavbarDropdown(); // ou outra função se quiser para footer
  })
  .catch(err => console.error("Erro ao carregar footer:", err));


// VAGA PATH
fetch(vagaPath)
  .then(response => response.text())
  .then(data => {
    const vagas = document.getElementsByClassName("vaga");
    
    Array.from(vagas).forEach(vaga => {
      vaga.innerHTML = data;
    });
  })
  .catch(err => console.error("Erro ao carregar vaga:", err));


// DOACAO PATH
fetch(doacaoPath)
  .then(response => response.text())
  .then(data => {
    const doacao = document.getElementsByClassName("doacao-container");
    
    Array.from(doacao).forEach(doacao => {
      doacao.innerHTML = data;
    });
  })
  .catch(err => console.error("Erro ao carregar pedido de doação:", err));

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


