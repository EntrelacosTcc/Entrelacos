import perguntas from "./perguntas-quiz.js";

// ===== Configurações =====
const NUM_PERGUNTAS = 6;
let selecionadas = [];
let indiceAtual = 0;
let pontos = {
  animal: 0,
  ambiental: 0,
  religiosa: 0,
  minorias: 0,
  social: 0,
  educacional: 0,
  saude: 0,
};

const questionBlock = document.getElementById("questionBlock");
const nextBtn = document.getElementById("nextBtn");
const resultDiv = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const finishBtn = document.getElementById("finishBtn");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");

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
  pontos = {
    animal: 0,
    ambiental: 0,
    religiosa: 0,
    minorias: 0,
    social: 0,
    educacional: 0,
    saude: 0,
  };
  selecionadas = shuffleArray(perguntas).slice(0, NUM_PERGUNTAS);
  indiceAtual = 0;
  resultDiv.style.display = "none";
  restartBtn.style.display = "none";
  finishBtn.style.display = "none";
  progressContainer.style.display = "inline-block";
  progressBar.style.display = "inline-block";
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
  const progresso = (indiceAtual / NUM_PERGUNTAS) * 100;
  progressBar.style.width = progresso + "%";
}

// ===== Resultado =====
function mostrarResultado() {
  questionBlock.innerHTML = "";
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  finishBtn.style.display = "inline-block";
  progressBar.style.display = "none";
  progressContainer.style.display = "none";

  const vencedor = Object.keys(pontos).reduce((a, b) =>
    pontos[a] > pontos[b] ? a : b
  );

  const textos = {
    animal:
      '<p>Sua causa é animal! Seu amor pelos animais é evidente. Seja protegendo pets abandonados ou lutando contra a exploração animal, você acredita que todos os seres vivos merecem respeito e compaixão. Provavelmente adora compartilhar vídeos fofos de animais.</p><img src="img/causa-animal.png" alt="Imagem Causa Animal">',

    ambiental:
      '<p>Sua causa é ambiental! Você se importa profundamente com o planeta e entende que cada pequena ação conta. Reciclar, economizar água, reduzir o uso de plástico ou simplesmente defender a natureza faz parte do seu dia a dia. Você é daquelas pessoas que não conseguem ver uma árvore sendo cortada sem sentir no peito.</p><img src="../assets/img/causa-ambiental.png" alt="Imagem Causa Ambiental">.',

    religiosa:
      '<p>Sua causa é a liberdade de fé. Você acredita que cada pessoa deve ter o direito de viver sua espiritualidade, ou sua escolha de não tê-la, com respeito e acolhimento. Para você, é essencial criar espaços de diálogo, compreensão e convivência harmoniosa, onde todas as crenças sejam vistas como legítimas expressões do ser.</p><img src="../assets/img/causa-religiosa.png" alt="Imagem Causa Religiosa">',

    minorias:
      '<p>Sua causa é a defesa de grupos sub-representados. Você acredita que pessoas LGBTQIA+, mulheres e PcD merecem respeito, igualdade e visibilidade reais. Para você, não basta empatia: é preciso agir para que ser quem se é, viver com segurança e ter acesso a oportunidades justas deixe de ser privilégio e se torne, de fato, um direito garantido a todos.</p><img src="../assets/img/causa-minorias.png" alt="Imagem Causa Minorias(Mulheres, PcD e LGBTQIAP+" style="margin-top:70px">',

    social:
      '<p>Sua causa é o cuidado com a sociedade. Você acredita que cada pessoa merece atenção, apoio e oportunidades para viver bem. Para você, o que transforma o mundo é a união, a empatia entre as pessoas e a disposição de ajudar. É sobre estender a mão, valorizar as diferenças e construir, juntos, um caminho mais humano e solidário. </p><img src="../assets/img/causa-social.png" alt="Imagem Causa Saúde">',

    educacional:
      '<p>Sua causa é a educação. Você acredita que o acesso ao conhecimento transforma realidades e abre caminhos para a igualdade de oportunidades. Para você, não basta ensinar: é preciso garantir qualidade, inclusão e condições que permitam a todos aprender e crescer. A educação, em sua visão, é direito essencial e base para a justiça social.</p><img src="../assets/img/causa-educacional.png" alt="Imagem Casa Educacional">',

    saude:
      '<p>Sua causa é a saúde. Você acredita que cuidar do corpo e da mente não deve ser luxo, mas direito assegurado. Para você, não basta oferecer tratamento: é preciso garantir acesso digno, prevenção e bem-estar. A saúde, em sua visão, é pilar fundamental para que cada pessoa viva com qualidade e dignidade.</p><img src="img/causa-saude.png" alt="Imagem Causa Saúde">',
  };

  resultDiv.innerHTML = `<section class="causa-container"><h2>Sua causa ideal é :</h2><h3>${vencedor.toUpperCase()}</h3><div class="texto-resultado">${
    textos[vencedor]
  }</div></section>`;
  resultDiv.style.display = "block";
}

// ===== Reiniciar =====
function restartQuiz() {
  iniciarQuiz();
}

nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", restartQuiz);

iniciarQuiz();