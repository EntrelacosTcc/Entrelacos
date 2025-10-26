// Funcionamento Carrossel Depoimentos

function direcao(e, qnt) {
  var direcao = document.getElementById("content-slide");

  if (e == 1) {
    // Esquerda
    direcao.scrollBy({ left: -(qnt), behavior: 'smooth' });
  } else if (e == 2) {
    // Direita
    direcao.scrollBy({ left: qnt, behavior: 'smooth' });
  }
}

function direcao1(e, qnt) {
  var direcao1 = document.getElementById("content-slide1");

  if (e == 1) {
    // Esquerda
    direcao1.scrollBy({ left: -(qnt), behavior: 'smooth' });
  } else if (e == 2) {
    // Direita
    direcao1.scrollBy({ left: qnt, behavior: 'smooth' });
  }
}


