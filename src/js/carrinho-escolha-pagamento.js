// infos compra resumo
document.addEventListener("DOMContentLoaded", () => {
  const resumo = JSON.parse(localStorage.getItem("resumoCompra"));

  if (!resumo) return;

  const linhas = document.querySelectorAll(".linha-total");
  const totalEl = document.querySelector(".linha-total.totalzao strong");

  // Subtotal
  linhas[0].querySelector("span:nth-child(2)").textContent =
    `R$ ${resumo.subtotal.toFixed(2)}`;

  // Frete
  linhas[1].querySelector("span:nth-child(2)").textContent =
    `R$ ${resumo.frete.toFixed(2)}`;

  // Total
  totalEl.textContent = `R$ ${resumo.total.toFixed(2)}`;
});

// pagamentos

function mostrarPagamento(id) {

  // Esconde todas
  document.querySelectorAll('.pagamento-box').forEach(div => {
    div.style.display = 'none';
  });

  // Mostra a selecionada
  document.getElementById(id).style.display = 'block';
}

