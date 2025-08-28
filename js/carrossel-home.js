// Funcionamento Carrossel Depoimentos

function direcao(e) {
  var direcao = document.getElementById("content-slide");

  if (e == 1) {
    // Esquerda
    direcao.scrollBy({ left: -266, behavior: 'smooth' });
  } else if (e == 2) {
    // Direita
    direcao.scrollBy({ left: 266, behavior: 'smooth' });
  }
}