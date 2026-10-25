
const $ = id => document.getElementById(id);

let stage = 0;
let audioContext;

function message(who, text) {
  const line = document.createElement("p");
  const name = document.createElement("b");

  name.textContent = who + ": ";
  line.append(name, document.createTextNode(text));

  $("chat").appendChild(line);
  $("chat").scrollTop = $("chat").scrollHeight;
}

function systemMessage() {
  message("Sistema", "Não há nenhum lugar seguro para ir.");
}

function sound(frequency = 100, duration = 0.5) {
  try {
    audioContext = audioContext ||
      new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.15;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {}
}

function showGame() {
  $("game").style.display = "block";
  $("game").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function setScene(title, description, bunny, dark = false) {
  $("title").textContent = title;
  $("description").textContent = description;
  $("bunny").textContent = bunny;
  $("scene").classList.toggle("dark", dark);
  $("actions").replaceChildren();
}

function option(text, callback) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", callback);
  $("actions").appendChild(button);
}

function scare(text, face = "☻", duration = 1000) {
  $("face").textContent = face;
  $("scareText").textContent = text;
  $("jumpscare").classList.add("show");

  sound(45, 0.65);
  setTimeout(() => sound(75, 0.3), 100);

  setTimeout(() => {
    $("jumpscare").classList.remove("show");
  }, duration);
}

function startGame() {
  stage = 1;

  setScene(
    "Bem-vindo ao Happy Place!",
    "Escolha para onde o coelhinho deve ir. 🌷",
    "🐰"
  );

  option("🌼 Jardim", () => {
    setScene(
      "Que lindo!",
      "O coelho encontrou uma flor. Mas... ela está olhando para você.",
      "🌼"
    );

    option("Pegar a flor", corridor);
    option("Voltar", corridor);
  });

  option("🍄 Floresta", () => {
    setScene(
      "Um lugar tranquilo...",
      "Os passarinhos pararam de cantar.",
      "🍄"
    );

    option("Continuar", corridor);
  });
}

function corridor() {
  stage = 2;

  setScene(
    "VOCÊ ESTÁ SOZINHO?",
    "Você ouve três batidas. Não vire a cabeça.",
    "🐰",
    true
  );

  $("status").textContent = "Arquivo desconhecido";

  message("unknown_404", "vc chegou no corredor?");
  message("unknown_404", "NÃO OLHA PRA TRÁS.");

  sound(180, 0.2);
  setTimeout(() => sound(180, 0.2), 350);
  setTimeout(() => sound(180, 0.2), 700);

  option("Olhar para trás", () => {
    scare("EU DISSE PARA NÃO OLHAR.", "👁", 1100);
    setTimeout(errorScene, 1300);
  });

  option("Continuar andando", errorScene);
}

function errorScene() {
  stage = 3;

  setScene(
    "ERRO 0x000404",
    "O jogo tentou fechar, mas alguma coisa impediu.",
    "☻",
    true
  );

  $("status").textContent = "Não respondendo";

  message("unknown_404", "EU NÃO MANDEI ESSA MENSAGEM.");
  message("unknown_404", "FECHA A JANELA. AGORA.");

  option("Fechar o jogo", ending);

  option("Continuar", () => {
    scare("VOCÊ FICOU.", "☻", 900);
    setTimeout(errorScene, 1200);
  });
}

function ending() {
  $("game").style.display = "none";

  message("unknown_404", "acabou?");
  message("unknown_404", "olha atrás de você.");

  setTimeout(() => {
    scare("I CAN SEE YOU.", "◉", 1500);
  }, 700);

  setTimeout(() => {
    $("endingMessage").textContent =
      'Última mensagem: "não fui eu que te mandei o link."';

    $("ending").style.display = "flex";
  }, 2400);
}

$("play").addEventListener("click", startGame);

$("chatForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = $("message");
  const text = input.value.trim();

  if (!text) return;

  message("Você", text);
  input.value = "";

  setTimeout(() => {
    if (stage >= 2) {
      message("unknown_404", "ela consegue ler o que você escreve.");
    } else {
      message("unknown_404", "kkkk abre o jogo primeiro");
    }
  }, 500);
});

// Mensagens iniciais do desconhecido
const intro = [
  ["unknown_404", "oi"],
  ["unknown_404", "vc tá ocupado?"],
  ["Você", "quem é?"],
  ["unknown_404", "achei seu perfil por acaso kkkkk"],
  ["unknown_404", "posso te mostrar uma coisa?"],
  ["unknown_404", "promete que não vai fechar?"]
];

intro.forEach((item, index) => {
  setTimeout(() => {
    message(item[0], item[1]);
  }, 700 * (index + 1));
});

// Link para abrir o jogo
setTimeout(() => {
  message("unknown_404", "olha o que eu encontrei:");

  showGame();

  const link = document.createElement("button");
  link.textContent = "ABRIR HAPPY_PLACE.exe";
  link.style.marginTop = "8px";

  link.addEventListener("click", () => {
    showGame();
    message("Sistema", "HAPPY_PLACE.exe foi iniciado.");
  });

  $("chat").appendChild(link);
}, 5000);

// Relógio da barra de tarefas
setInterval(() => {
  $("clock").textContent = new Date().toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" }
  );
}, 1000);

