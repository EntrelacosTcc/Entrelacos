import perguntas from "../js/perguntas-quiz.js";


// ===== Configurações =====
  const NUM_PERGUNTAS = 5;
  let selecionadas = [];
  let indiceAtual = 0;
  let pontos = { matematica: 0, portugues: 0, historia: 0 };

  const questionBlock = document.getElementById("questionBlock");
  const nextBtn = document.getElementById("nextBtn");
  const resultDiv = document.getElementById("result");
  const restartBtn = document.getElementById("restartBtn");
  const finishBtn = document.getElementById("finishBtn");
  const progressBar = document.getElementById("progressBar");

  // ===== Embaralhar array =====
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ===== Iniciar Quiz =====
  function iniciarQuiz() {
    pontos = { matematica: 0, portugues: 0, historia: 0 };
    selecionadas = shuffleArray(perguntas).slice(0, NUM_PERGUNTAS);
    indiceAtual = 0;
    resultDiv.style.display = "none";
    restartBtn.style.display = "none";
    finishBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    atualizarProgresso();
    mostrarPergunta();
  }

  // ===== Mostrar Pergunta =====
  function mostrarPergunta() {
    nextBtn.disabled = true;
    const p = selecionadas[indiceAtual];
    questionBlock.innerHTML = `<div class="question"><h3>${p.texto}</h3></div>`;
    const ops = document.createElement("div");
    ops.className = "options";

    p.opcoes.forEach((op, idx) => {
      const id = `q${indiceAtual}_opt${idx}`;
      const label = document.createElement("label");
      label.htmlFor = id;

      const rb = document.createElement("input");
      rb.type = "radio";
      rb.name = "pergunta";
      rb.id = id;
      rb.value = op.resultado;

      rb.addEventListener("change", () => {
        nextBtn.disabled = false;
      });

      const span = document.createElement("span");
      span.textContent = op.texto;

      label.appendChild(rb);
      label.appendChild(span);
      ops.appendChild(label);
    });

    questionBlock.appendChild(ops);
    atualizarProgresso();
  }

  // ===== Avançar =====
  function handleNext() {
    const selecionado = document.querySelector('input[name="pergunta"]:checked');
    if (!selecionado) return;

    pontos[selecionado.value]++;

    indiceAtual++;
    if (indiceAtual < selecionadas.length) {
      mostrarPergunta();
    } else {
      mostrarResultado();
    }
  }

  // ===== Atualizar barra =====
  function atualizarProgresso() {
    const progresso = ((indiceAtual) / NUM_PERGUNTAS) * 100;
    progressBar.style.width = progresso + "%";
  }

  // ===== Resultado =====
  function mostrarResultado() {
    questionBlock.innerHTML = "";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    finishBtn.style.display = "inline-block"
    progressBar.style.width = "100%";

    const vencedor = Object.keys(pontos).reduce((a, b) => pontos[a] > pontos[b] ? a : b);

    const textos = {
      matematica: "Você combina com carreiras que envolvem lógica e números (engenharia, estatística, programação).",
      portugues: "Você combina com carreiras de comunicação e linguagem (jornalismo, letras, professor).",
      historia: "Você combina com carreiras de análise do passado (historiador, arqueólogo, pesquisador)."
    };

    resultDiv.innerHTML = `<h2>Sua causa ideal é:</h2><p><strong>${vencedor.toUpperCase()}</strong></p><p>${textos[vencedor]}</p>`;
    resultDiv.style.display = "block";
  }

  // ===== Reiniciar =====
  function restartQuiz() {
    iniciarQuiz();
  }

  nextBtn.addEventListener("click", handleNext);
  restartBtn.addEventListener("click", restartQuiz);

  iniciarQuiz();