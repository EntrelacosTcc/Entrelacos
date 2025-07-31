const path = window.location.pathname.includes("/pages-html/")
  ? "../components/navbar.html"
  : "components/navbar.html";

fetch(path)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    initNavbarDropdown(); 
  });

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


// FOOTER

const pathFooter = window.location.pathname.includes("/pages-html/")
  ? "../components/footer.html"
  : "components/footer.html";

fetch(pathFooter)
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
    initNavbarDropdown(); 
  });