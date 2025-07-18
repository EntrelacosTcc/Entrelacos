document.querySelectorAll('.dropdown').forEach(dropdown => {
  const btn = dropdown.querySelector('.dropdown-btn');
  const content = dropdown.querySelector('.dropdown-content');

  function showDropdown() {
    dropdown.classList.add('show');
  }

  function hideDropdown() {
    setTimeout(() => {
      if (!dropdown.matches(':hover')) {
        dropdown.classList.remove('show');
      }
    }, 150);
  }

  btn.addEventListener('mouseenter', showDropdown);
  content.addEventListener('mouseenter', showDropdown);
  btn.addEventListener('mouseleave', hideDropdown);
  content.addEventListener('mouseleave', hideDropdown);
});