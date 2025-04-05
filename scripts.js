let balance = 100;
let bet = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let playerStands = false;

const balanceEl = document.getElementById("balance");
const betAmountEl = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBet");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const newGameBtn = document.getElementById("newGame");
const playerCardsEl = document.getElementById("playerCards");
const dealerCardsEl = document.getElementById("dealerCards");
const messageEl = document.getElementById("message");
const playerHandValueEl = document.getElementById("playerHandValue");
const dealerHandValueEl = document.getElementById("dealerHandValue");

function createDeck() {
  deck = [];
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  // Shuffle deck
  deck.sort(() => Math.random() - 0.5);
}

function startGame() {
  gameOver = false;
  playerStands = false;
  messageEl.textContent = "";
  playerHand = [];
  dealerHand = [];
  createDeck();

  // Deal two cards to player and dealer
  playerHand.push(drawCard());
  playerHand.push(drawCard());
  dealerHand.push(drawCard());
  dealerHand.push(drawCard());

  updateCards();
  updateButtons();

  // Check for blackjack immediately
  if (getHandValue(playerHand) === 21) {
    endGame();
  }
}

function drawCard() {
  return deck.pop();
}

function getCardValue(card) {
  if (card.value === "A") {
    return 11;
  } else if (["K", "Q", "J"].includes(card.value)) {
    return 10;
  } else {
    return parseInt(card.value);
  }
}

function getHandValue(hand) {
  let value = 0;
  let aceCount = 0;
  for (let card of hand) {
    value += getCardValue(card);
    if (card.value === "A") aceCount++;
  }
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

function updateCards() {
  // Update player's cards
  playerCardsEl.innerHTML = "";
  playerHand.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.textContent = card.value + card.suit;
    playerCardsEl.appendChild(cardDiv);
  });
  playerHandValueEl.textContent = getHandValue(playerHand);

  // Update dealer's cards
  dealerCardsEl.innerHTML = "";
  dealerHand.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    // Hide dealer's second card if game is not over
    if (index === 1 && !gameOver) {
      cardDiv.textContent = "❓";
    } else {
      cardDiv.textContent = card.value + card.suit;
    }
    dealerCardsEl.appendChild(cardDiv);
  });

  // Update dealer's hand value display:
  // Show full hand value only when game is over; otherwise, show "?".
  if (gameOver) {
    dealerHandValueEl.textContent = getHandValue(dealerHand);
  } else {
    dealerHandValueEl.textContent = "?";
  }
}

function updateButtons() {
  hitBtn.disabled = gameOver || playerStands;
  standBtn.disabled = gameOver || playerStands;
  newGameBtn.disabled = !gameOver;
  placeBetBtn.disabled = true;
  betAmountEl.disabled = true;
}

placeBetBtn.addEventListener("click", () => {
  const betVal = parseInt(betAmountEl.value);
  if (isNaN(betVal) || betVal <= 0 || betVal > balance) {
    alert("Please enter a valid bet amount.");
    return;
  }
  bet = betVal;
  balance -= bet;
  updateBalance();
  startGame();
});

hitBtn.addEventListener("click", () => {
  if (gameOver) return;
  playerHand.push(drawCard());
  updateCards();
  if (getHandValue(playerHand) > 21) {
    endGame();
  }
});

standBtn.addEventListener("click", () => {
  playerStands = true;
  dealerTurn();
});

newGameBtn.addEventListener("click", () => {
  if (balance <= 0) {
    messageEl.textContent = "Game Over! You've lost all your money.";
    return;
  }
  // Reset bet input for new round
  betAmountEl.disabled = false;
  placeBetBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  newGameBtn.disabled = true;
  playerCardsEl.innerHTML = "";
  dealerCardsEl.innerHTML = "";
  playerHandValueEl.textContent = "0";
  dealerHandValueEl.textContent = "?";
  messageEl.textContent = "Place your bet for a new round.";
});

function dealerTurn() {
  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  endGame();
}

function endGame() {
  gameOver = true;
  updateCards();
  const playerTotal = getHandValue(playerHand);
  const dealerTotal = getHandValue(dealerHand);

  if (playerTotal > 21) {
    messageEl.textContent = "You busted! You lose.";
  } else if (dealerTotal > 21) {
    messageEl.textContent = "Dealer busted! You win!";
    balance += bet * 2;
  } else if (playerTotal === dealerTotal) {
    messageEl.textContent = "Push! It's a tie.";
    balance += bet;
  } else if (playerTotal > dealerTotal) {
    messageEl.textContent = "You win!";
    balance += bet * 2;
  } else {
    messageEl.textContent = "You lose.";
  }
  updateBalance();
  updateButtons();
  if (balance <= 0) {
    messageEl.textContent = "Game Over! You've lost all your money.";
    hitBtn.disabled = true;
    standBtn.disabled = true;
    placeBetBtn.disabled = true;
    betAmountEl.disabled = true;
  }
}

function updateBalance() {
  balanceEl.textContent = balance;
}
