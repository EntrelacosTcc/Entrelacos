//slider (primeira parte )
var cont = 1;
document.getElementById('radio1').checked = true;

setInterval(() => {
    proximaImg();
}, 6000); //tempo de transição

function proximaImg() {
    cont++;
    if(cont > 2) cont = 1;
    document.getElementById('radio' + cont).checked = true;
}


// perguntas frequentes
function mostrarEsconder(id) {
    const conteudo = document.querySelector(id);
    //faz aparecer o texto ao clicar no +
    if (conteudo.style.maxHeight && conteudo.style.maxHeight !== "0px") {
        conteudo.style.maxHeight = "0px"; 
    } else {
        conteudo.style.maxHeight = conteudo.scrollHeight + "px"; 
    }
}

//carrossel
document.querySelectorAll(".carousel-container").forEach((carousel) => {
  const controls = carousel.querySelectorAll(".control");
  const items = carousel.querySelectorAll(".item");
  const maxItems = items.length;
  let currentItem = 0;

  const updateButtons = () => {
    controls.forEach(control => {
      if (control.classList.contains("arrow-left")) {
        control.classList.toggle("disabled", currentItem === 0);
      } else {
        control.classList.toggle("disabled", currentItem === maxItems - 1);
      }
    });
  };

  updateButtons();

  controls.forEach((control) => {
    control.addEventListener("click", (e) => {
      e.preventDefault(); 

      if (control.classList.contains("disabled")) return;

      const isLeft = control.classList.contains("arrow-left");

      if (isLeft && currentItem > 0) {
        currentItem -= 1;
      } else if (!isLeft && currentItem < maxItems - 1) {
        currentItem += 1;
      }

      items.forEach((item) => item.classList.remove("current-item"));

      items[currentItem].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });

      items[currentItem].classList.add("current-item");
      updateButtons();
    });
  });
});
