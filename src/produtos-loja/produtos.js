const mainImg = document.getElementById("MainImg");
  const smallImg = document.getElementById("small-img");

  smallImg.addEventListener("click", () => {
    let trocarImagem = mainImg.src;

    mainImg.src = smallImg.src;
    smallImg.src = trocarImagem;
  });


