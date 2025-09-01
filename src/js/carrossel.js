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