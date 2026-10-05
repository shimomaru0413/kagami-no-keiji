
(() => {
  const cards = window.KAGAMI_CARDS || [];
  const startScreen = document.getElementById("startScreen");
  const cardScreen = document.getElementById("cardScreen");
  const drawButton = document.getElementById("drawButton");
  const drawTextButton = document.getElementById("drawTextButton");
  const cardEl = document.getElementById("oracleCard");
  const redrawButton = document.getElementById("redrawButton");
  const tapHint = document.getElementById("tapHint");

  const frontArt = document.getElementById("frontArt");
  const frontSigil = document.getElementById("frontSigil");
  const frontTitle = document.getElementById("frontTitle");
  const messageSigil = document.getElementById("messageSigil");
  const messageTitle = document.getElementById("messageTitle");
  const messageText = document.getElementById("messageText");

  const palettes = {
    1: ["#173b42","#71808a","#b59a63"],
    2: ["#746b77","#a98984","#cfbd93"],
    3: ["#152637","#e7e2d8","#bda36c"],
    4: ["#315854","#c7b89b","#b29863"],
    5: ["#263744","#6d7070","#a88d59"],
    6: ["#5b3f2d","#d8c9aa","#87623c"],
    7: ["#222d45","#77797c","#c4a86e"]
  };

  function randomIndex(max) {
    if (window.crypto && crypto.getRandomValues) {
      const a = new Uint32Array(1);
      crypto.getRandomValues(a);
      return a[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function renderCard(card) {
    cardEl.classList.remove("flipped");
    tapHint.textContent = "カードをタップして言葉を読む";
    frontTitle.textContent = card.title;
    messageTitle.textContent = card.title;
    messageText.textContent = card.message;
    messageText.classList.remove("message-long", "message-very-long");
    if (card.message.length >= 175) {
      messageText.classList.add("message-very-long");
    } else if (card.message.length >= 135) {
      messageText.classList.add("message-long");
    }
    const sigilSrc = `assets/sigils/${card.sigil}.svg`;
    frontSigil.src = sigilSrc;
    messageSigil.src = sigilSrc;

    const p = palettes[card.mother];
    frontArt.style.setProperty("--m1", p[0]);
    frontArt.style.setProperty("--m2", p[1]);

    frontArt.classList.toggle("has-image", card.hasFinalArt);
    if (card.hasFinalArt) {
      frontArt.style.backgroundImage = `linear-gradient(rgba(5,15,20,.04),rgba(5,15,20,.15)),url("assets/cards/card-05.webp")`;
      frontArt.style.backgroundSize = "cover";
      frontArt.style.backgroundPosition = "center";
    } else {
      frontArt.style.backgroundImage = `radial-gradient(circle at 50% 22%, rgba(240,225,178,.18), transparent 26%), linear-gradient(160deg, ${p[0]}, ${p[1]})`;
    }
  }

  function drawCard() {
    if (!cards.length) return;
    const card = cards[randomIndex(cards.length)];
    renderCard(card);
    startScreen.hidden = true;
    cardScreen.hidden = false;
    window.scrollTo({top:0, behavior:"auto"});
  }

  function flipCard() {
    cardEl.classList.toggle("flipped");
    const flipped = cardEl.classList.contains("flipped");
    tapHint.textContent = flipped ? "" : "カードをタップして言葉を読む";
    cardEl.setAttribute("aria-label", flipped ? "カードをタップして表面へ戻る" : "カードをタップして言葉を読む");
  }

  drawButton.addEventListener("click", drawCard);
  drawTextButton.addEventListener("click", drawCard);
  cardEl.addEventListener("click", flipCard);
  redrawButton.addEventListener("click", drawCard);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
  }
})();
