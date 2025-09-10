const mainImg = document.getElementById("MainImg");
  const smallImg = document.getElementById("small-img");

  smallImg.addEventListener("click", () => {
    // Guarda o src da principal
    let temp = mainImg.src;

    // Troca os src
    mainImg.src = smallImg.src;
    smallImg.src = temp;
  });