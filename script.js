
const $ = id => document.getElementById(id);

let stage = 0;
let audioContext;
let chatBusy = false;
let conversationStarted = false;
let suspicion = 0;

// CHAT

function message(who, text) {
  const line = document.createElement("p");
  const name = document.createElement("b");

  name.textContent = who + ": ";
  line.append(name, document.createTextNode(text));

  $("chat").appendChild(line);
  $("chat").scrollTop = $("chat").scrollHeight;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function stranger(text, delay = 1700) {
  await wait(delay);
  message("unknown_404", text);
}

async function player(text) {
  message("Você", text);
  await wait(700);
}

function choices(options) {
  const area = document.createElement("div");
  area.className = "chat-choices";
  area.style.display = "flex";
  area.style.flexDirection = "column";
  area.style.alignItems = "flex-start";
  area.style.gap = "7px";
  area.style.margin = "12px 0";

  options.forEach(item => {
    const button = document.createElement("button");
    button.textContent = item.text;
    button.style.cursor = "pointer";

    button.addEventListener("click", async () => {
      if (chatBusy) return;

      chatBusy = true;

      area.querySelectorAll("button").forEach(b => {
        b.disabled = true;
      });

      await player(item.text);
      area.remove();

      try {
        await item.action();
      } catch (error) {
        console.error(error);
      }

      chatBusy = false;
    });

    area.appendChild(button);
  });

  $("chat").appendChild(area);
  $("chat").scrollTop = $("chat").scrollHeight;
}

// CONVERSA INICIAL

async function startChat() {
  if (conversationStarted) return;
  conversationStarted = true;

  await stranger("oi", 1200);
  await stranger("oi??", 2300);
  await stranger("kkkk achei que vc não ia responder", 2400);

  choices([
    {
      text: "Quem é você?",
      action: async () => {
        await stranger("ah, foi mal KKKKK", 1800);
        await stranger("me chama de unknown mesmo", 2000);
        await stranger("é meu nick na internet", 2000);
        await stranger("e vc? costuma jogar no pc?", 2200);

        choices([
          {
            text: "Às vezes. Por quê?",
            action: async () => {
              await stranger("nada demais", 1800);
              await stranger("eu gosto de encontrar gente que curte jogos", 2200);
              await stranger("principalmente jogos antigos", 2300);
              await stranger("posso te perguntar uma coisa?", 2000);
              await questionAboutGames();
            }
          },
          {
            text: "Não te conheço. Como conseguiu meu contato?",
            action: async () => {
              suspicion++;
              await stranger("calma KKKKK", 1900);
              await stranger("eu achei seu perfil por acaso", 2300);
              await stranger("não precisa ficar com medo de mim", 2500);
              await stranger("...vc ficou com medo?", 2600);
              await askIfAfraid();
            }
          },
          {
            text: "Não vou falar com um desconhecido.",
            action: async () => {
              await stranger("justo", 2000);
              await stranger("eu também não devia falar com desconhecidos", 2200);
              await stranger("mas achei que vc ia gostar do que encontrei", 2500);
              await stranger("é um jogo bem antigo", 2100);
              await offerGame();
            }
          }
        ]);
      }
    },
    {
      text: "Como me encontrou?",
      action: async () => {
        suspicion++;
        await stranger("eu tava procurando uma coisa", 2000);
        await stranger("aí seu perfil apareceu", 2200);
        await stranger("nem lembro onde foi exatamente", 2400);

        choices([
          {
            text: "Isso não faz sentido.",
            action: async () => {
              await stranger("eu sei, parece estranho", 2000);
              await stranger("mas não tem nada demais", 2100);
              await stranger("posso te mostrar uma coisa pra compensar?", 2200);
              await offerGame();
            }
          },
          {
            text: "Tá, e o que você quer?",
            action: async () => {
              await stranger("um minuto da sua atenção KKKKK", 2000);
              await stranger("eu encontrei um jogo muito estranho", 2200);
              await stranger("queria que alguém testasse", 2000);
              await questionAboutGames();
            }
          },
          {
            text: "Você sabe meu nome?",
            action: async () => {
              await stranger("não", 1800);
              await stranger("deveria saber?", 2300);
              await stranger("pera", 1700);
              await stranger("seu nome não aparece aqui pra mim", 2500);
              await stranger("que estranho...", 2800);
              await askIfAfraid();
            }
          }
        ]);
      }
    },
    {
      text: "Oi! Tudo bem?",
      action: async () => {
        await stranger("tudo sim KKKKK", 1800);
        await stranger("finalmente alguém responde", 2200);
        await stranger("vc costuma conversar com gente aleatória?", 2300);

        choices([
          {
            text: "Não muito, na verdade.",
            action: async () => {
              await stranger("eu também não", 1900);
              await stranger("mas hoje eu tava entediado", 2100);
              await stranger("e encontrei um jogo que queria mostrar", 2400);
              await offerGame();
            }
          },
          {
            text: "Depende da pessoa.",
            action: async () => {
              await stranger("então vou tentar ser uma pessoa legal KKKK", 2000);
              await stranger("vc gosta de jogos de terror?", 2200);
              await askHorrorGames();
            }
          },
          {
            text: "Quem é você mesmo?",
            action: async () => {
              await stranger("unknown_404", 1800);
              await stranger("só isso que vc precisa saber por enquanto", 2400);
              await stranger("brincadeira KKKKK", 1800);
              await questionAboutGames();
            }
          }
        ]);
      }
    }
  ]);
}

async function questionAboutGames() {
  await stranger("vc prefere jogos fofinhos ou jogos de terror?", 2000);

  choices([
    {
      text: "Jogos fofinhos ♡",
      action: async () => {
        await stranger("SÉRIO???", 1800);
        await stranger("então esse é perfeito pra vc", 2100);
        await stranger("tem um coelhinho muito bonitinho", 2000);
        await stranger("acho que vc vai gostar dele", 2200);
        await offerGame();
      }
    },
    {
      text: "Terror psicológico.",
      action: async () => {
        await stranger("sabia KKKKK", 1900);
        await stranger("esse jogo começa parecendo outra coisa", 2300);
        await stranger("não vou estragar a surpresa", 2200);
        await stranger("quer ver?", 1900);
        await offerGame();
      }
    },
    {
      text: "Depende do jogo.",
      action: async () => {
        await stranger("resposta justa", 1700);
        await stranger("esse aqui é meio difícil de explicar", 2200);
        await stranger("vc precisa abrir pra entender", 2100);
        await offerGame();
      }
    }
  ]);
}

async function askIfAfraid() {
  choices([
    {
      text: "Um pouco. Você está sendo estranho.",
      action: async () => {
        await stranger("desculpa...", 2100);
        await stranger("não queria assustar vc", 2300);
        await stranger("eu só quero te mostrar o jogo", 2200);
        await stranger("depois vc decide se quer continuar falando comigo", 2500);
        await offerGame();
      }
    },
    {
      text: "Não. Só quero respostas.",
      action: async () => {
        await stranger("gosto de gente direta", 2000);
        await stranger("tá, vou explicar", 2100);
        await stranger("encontrei esse jogo num arquivo antigo", 2300);
        await stranger("e tem uma coisa nele que eu não entendi", 2500);
        await stranger("pensei que vc pudesse ajudar", 2200);
        await offerGame();
      }
    },
    {
      text: "Vou bloquear você.",
      action: async () => {
        await stranger("espera, por favor", 1800);
        await stranger("eu não fiz nada", 2200);
        await stranger("só abre o jogo uma vez", 2300);
        await stranger("se não gostar, pode fechar", 2400);
        await offerGame();
      }
    }
  ]);
}

async function askHorrorGames() {
  choices([
    {
      text: "Sim, principalmente os que assustam de verdade.",
      action: async () => {
        await stranger("então vc não vai se importar", 2000);
        await stranger("com algumas coisas estranhas", 2200);
        await stranger("que podem acontecer", 2500);
        await offerGame();
      }
    },
    {
      text: "Não gosto de sustos.",
      action: async () => {
        await stranger("ah, então talvez esse não seja pra vc", 2000);
        await stranger("ele parece bem inocente no começo", 2300);
        await stranger("mas posso te mandar mesmo assim?", 2200);
        await offerGame();
      }
    },
    {
      text: "Por que tantas perguntas?",
      action: async () => {
        await stranger("KKKKKK foi mal", 1900);
        await stranger("tô tentando puxar assunto", 2200);
        await stranger("não sou muito bom nisso", 2300);
        await stranger("enfim, olha esse jogo", 2000);
        await offerGame();
      }
    }
  ]);
}

// ESCOLHA ANTES DE ABRIR O LINK

async function offerGame() {
  await stranger("posso te mandar o link?", 2000);

  choices([
    {
      text: "Pode mandar.",
      action: async () => {
        await stranger("aí sim!!", 1600);
        await stranger("o nome é HAPPY_PLACE.exe", 2000);
        await stranger("parece um jogo de 1998 KKKKK", 2200);
        await stranger("não repara nos gráficos", 1800);
        await stranger("me avisa quando abrir", 2200);
        showGameLink();
      }
    },
    {
      text: "Manda primeiro uma imagem.",
      action: async () => {
        await stranger("uma imagem?", 1800);
        await stranger("pera, tenho uma", 2200);
        await stranger("🐰🌷☀️", 1900);
        await stranger("tá vendo? é fofinho", 2000);
        await stranger("agora posso mandar?", 2100);

        choices([
          {
            text: "Tá bom, manda.",
            action: async () => {
              await stranger("beleza!!", 1700);
              await stranger("HAPPY_PLACE.exe", 1800);
              showGameLink();
            }
          },
          {
            text: "Ainda não confio em você.",
            action: async () => {
              await stranger("justo...", 2000);
              await stranger("não precisa confiar", 2200);
              await stranger("só decide se quer jogar", 2300);
              await showLinkChoice();
            }
          }
        ]);
      }
    },
    {
      text: "Não quero abrir nada.",
      action: async () => {
        await stranger("tudo bem", 2000);
        await stranger("não vou te obrigar", 2200);
        await stranger("mas posso te contar uma coisa?", 2200);

        choices([
          {
            text: "Pode.",
            action: async () => {
              await stranger("eu já tentei abrir esse jogo", 2300);
              await stranger("e ele mostrou um nome que não devia estar lá", 2800);
              await stranger("o seu", 2500);
              await stranger("...brincadeira?", 3000);
              await showLinkChoice();
            }
          },
          {
            text: "Não. Tchau.",
            action: async () => {
              await stranger("tá...", 2200);
              await stranger("até mais", 2300);
              await stranger("espero que não apareça pra vc também", 2800);
              await showLinkChoice();
            }
          }
        ]);
      }
    }
  ]);
}

async function showLinkChoice() {
  await stranger("vou deixar o link aqui de qualquer jeito", 2000);
  showGameLink();
}

function showGameLink() {
  const link = document.createElement("button");
  link.textContent = "🔗 ABRIR HAPPY_PLACE.exe";
  link.style.margin = "10px 0";
  link.style.display = "block";

  link.addEventListener("click", async () => {
    if (link.disabled) return;

    link.disabled = true;
    message("Você", "Abriu HAPPY_PLACE.exe.");

    await stranger("hehe.", 1400);
    await stranger("sabia que vc ia abrir", 2000);
    await stranger("ou talvez não...", 2400);

    showGame();
    message("Sistema", "HAPPY_PLACE.exe foi iniciado.");
  });

  $("chat").appendChild(link);
  $("chat").scrollTop = $("chat").scrollHeight;
}

// EFEITOS SONOROS

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

// JOGO FOFO QUE VIRA TERROR

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

// MENSAGENS DIGITADAS PELO JOGADOR

$("chatForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = $("message");
  const text = input.value.trim();

  if (!text || chatBusy) return;

  message("Você", text);
  input.value = "";

  chatBusy = true;

  setTimeout(() => {
    if (stage >= 2) {
      message("unknown_404", "ela consegue ler o que você escreve.");
    } else {
      message("unknown_404", "kkkk escolhe uma das opções primeiro");
    }

    chatBusy = false;
  }, 2200);
});

// RELÓGIO

setInterval(() => {
  $("clock").textContent = new Date().toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" }
  );
}, 1000);

// COMEÇAR

startChat();
