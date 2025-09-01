const navbarPath = "/src/components/navbar.html";
const footerPath = "/src/components/footer.html";

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


function initNavbarDropdown() {
  console.log("Dropdown inicializado!");

  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const content = dropdown.querySelector('.dropdown-content');

    if (!btn || !content) {
      console.warn("Dropdown incompleto no DOM.");
      return;
    }

    btn.addEventListener('mouseenter', () => {
      dropdown.classList.add('show');
    });
    btn.addEventListener('mouseleave', () => {
      dropdown.classList.remove('show');
    });

    content.addEventListener('mouseenter', () => {
      dropdown.classList.add('show');
    });
    content.addEventListener('mouseleave', () => {
      dropdown.classList.remove('show');
    });
  });
}
