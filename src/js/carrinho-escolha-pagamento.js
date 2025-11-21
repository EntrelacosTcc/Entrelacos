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

// parcelas

// Atualiza parcelas do cartão com base no total do carrinho
const selectParcelas = document.getElementById("parcelas");
const resultadoParcelas = document.getElementById("resultadoParcelas");

function atualizarParcelas() {
  const resumo = JSON.parse(localStorage.getItem("resumoCompra"));
  if (!resumo) return;

  const totalCompra = resumo.total; // pega o total já calculado
  const qtdParcelas = Number(selectParcelas.value);
  const valorParcela = totalCompra / qtdParcelas;

  resultadoParcelas.textContent = `${qtdParcelas}x de R$ ${valorParcela.toFixed(2)}`;
}

// Atualiza quando muda a opção de parcelamento
selectParcelas.addEventListener("change", atualizarParcelas);

// Atualiza ao mostrar o pagamento
function mostrarPagamento(id) {
  document.querySelectorAll('.pagamento-box').forEach(div => {
    div.style.display = 'none';
  });

  document.getElementById(id).style.display = 'block';

  // Se for cartão, atualiza as parcelas
  if(id === 'pagCartao') atualizarParcelas();
}

