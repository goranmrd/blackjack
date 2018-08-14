// Challenge 5: Blackjack
let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-score', 'div': '#your-box', 'score': 0},
  'dealer': {'scoreSpan': '#dealer-blackjack-score', 'div': '#dealer-box', 'score': 0},
  'isStand': false,
  'turnsOver': false,
  // Here the values are the database values.
  'money': parseInt(document.querySelector('#money').textContent),
  'wins': parseInt(document.querySelector('#wins').textContent),
  'losses': parseInt(document.querySelector('#losses').textContent),
  'draws': parseInt(document.querySelector('#draws').textContent),
  'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11]},
  'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A']
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

// we are gonna use event listeners
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

const hitSound = new Audio("/static/game/sounds/swish.m4a");
const winSound = new Audio("/static/game/sounds/cash.mp3");
const lossSound = new Audio("/static/game/sounds/aww.mp3");

function blackjackHit() {
  if (blackjackGame['isStand'] === false) {
    let card = randomCard();
	showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
  if (card === 'A') {
    if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
      activePlayer['score'] += blackjackGame['cardsMap'][card][1];
    } else {
      activePlayer['score'] += blackjackGame['cardsMap'][card][0];
    }
  } else {
    activePlayer['score'] += blackjackGame['cardsMap'][card];
  }
}

function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('IMG');
    cardImage.src = `/static/game/images/${card}.png`
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackjackGame['isStand'] = true;
  while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame['turnsOver'] = true;
  showResult();
}

function blackjackDeal() {
  if (blackjackGame['turnsOver'] === true) {

    blackjackGame['isStand'] = false;

    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    for (i=0; i<yourImages.length; i++) {
      yourImages[i].remove();
    }

    for (i=0; i<dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-score').textContent = 0;
    document.querySelector('#dealer-blackjack-score').textContent = 0;

    document.querySelector('#your-blackjack-score').style.color = '#ffffff';
    document.querySelector('#dealer-blackjack-score').style.color = '#ffffff';

    document.querySelector('#blackjack-result').textContent = "Let's play";
    document.querySelector('#blackjack-result').style.color = 'black';

    blackjackGame['turnsOver'] = false;
    updateScoreDb();
  }
}

let twins = document.querySelector('#twins');
let tlosses = document.querySelector('#tlosses');
let tdraws = document.querySelector('#tdraws');

// show result on the top and update the score in the table
function showResult() {
  let message, messageColor;


  if (blackjackGame['turnsOver'] === true) {

    if (YOU['score'] <= 21) {

      // condition: higher score than dealer's or when dealer busts but you're 21 or under.
      if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
        blackjackGame['wins']++;
        blackjackGame['money'] += 10;
        document.querySelector('#wins').textContent =  blackjackGame['wins'];
        document.querySelector('#money').textContent =  blackjackGame['money'];
        message = 'You won!';
        messageColor = 'green';
        winSound.play();

      } else if (YOU['score'] < DEALER['score']) {
        blackjackGame['losses']++;
        document.querySelector('#losses').textContent =  blackjackGame['losses'];
        if (blackjackGame['money'] >= 10){
            blackjackGame['money'] -= 10;
        }
        document.querySelector('#money').textContent =  blackjackGame['money'];
        message = 'You lost!';
        messageColor = 'red';
        lossSound.play();

      } else if (YOU['score'] === DEALER['score']) {
        blackjackGame['draws']++;
        document.querySelector('#draws').textContent = blackjackGame['draws']; 
        message = 'You drew!';
        messageColor = 'black';
      }

      // condition: user busts but dealer doesn't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
      blackjackGame['losses']++;
      document.querySelector('#losses').textContent = blackjackGame['losses'];
      if (blackjackGame['money'] >= 10){
            blackjackGame['money'] -= 10;
        }
      document.querySelector('#money').textContent =  blackjackGame['money'];
      message = 'You lost!';
      messageColor = 'red';
      lossSound.play();

    // condition: when DEALER bust.
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
      blackjackGame['draws']++;
      document.querySelector('#draws').textContent = blackjackGame['draws'];
      message = 'You drew!';
      messageColor = 'black';
    }
  }

  document.querySelector('#blackjack-result').textContent = message;
  document.querySelector('#blackjack-result').style.color = messageColor;
  // If deal is not clicked this function will be triggered after 5 seconds.
  setTimeout(function(){

        updateScoreDb();

    },5000);
}

// Function to update the database
function updateScoreDb() {
    document.querySelector("#id_money").value = blackjackGame['money'];
    document.querySelector("#id_wins").value = blackjackGame['wins'];
    document.querySelector("#id_losses").value = blackjackGame['losses'];
    document.querySelector("#id_draws").value = blackjackGame['draws'];
    setTimeout(function(){

        document.querySelector("#update_button").click();

    },1);
}

