const mainImg = document.getElementById("MainImg");
  const smallImg = document.getElementById("small-img");

  smallImg.addEventListener("click", () => {
    let trocarImagem = mainImg.src;

    mainImg.src = smallImg.src;
    smallImg.src = trocarImagem;
  });

  const botao = document.getElementById("calcularFrete");
const resultado = document.getElementById("resultadoFrete");

botao.addEventListener("click", async () => {
  const cep = document.getElementById("cep").value.replace(/\D/g, '');
  if(cep.length !== 8){
    resultado.textContent = "CEP inválido!";
    return;
  }

  resultado.textContent = "Calculando...";

  try {
    const res = await fetch("/frete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep })
    });

    const data = await res.json();
    if(data.erro){
      resultado.textContent = data.erro;
    } else {
      resultado.textContent = `Frete: R$ ${data.valor} | Prazo: ${data.prazo} dias`;
    }
  } catch(err) {
    resultado.textContent = "Erro ao calcular o frete.";
    console.error(err);
  }
});
