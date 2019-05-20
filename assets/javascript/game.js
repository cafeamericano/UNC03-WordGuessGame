//**************************************************INITIALIZE GLOBAL VARIABLES**************************************************

let wordPool = ["Mario", "Luigi", "Yoshi", "Bowser"];
let guessesRemaining = 0;

let numberOfGamesWon = 0;
let numberOfGamesLost = 0;

let randomIndex = 0;
let winningWord = "";
let winningLetters = [];
let rightEntries = [];
let wrongEntries = [];

//**************************************************OBJECTS**************************************************

//**************************************************FUNCTIONS**************************************************

function beginNewGame() {
  updateScoreboard(); //Reset
  guessesRemaining = 20; //Reset
  winningLetters = []; //Reset
  rightEntries = []; //Reset
  wrongEntries = []; //Reset

  randomIndex = Math.floor(Math.random() * wordPool.length);
  winningWord = wordPool[randomIndex];
  for (i = 0; i < winningWord.length; i++) {
    winningLetters.push(winningWord[i].toLowerCase());
  }
  document.getElementById("winningWord").innerHTML = winningWord;
}

function updateScoreboard() {
  document.getElementById("rightEntries").innerHTML =
    "Right entries: " + rightEntries;
  document.getElementById("wrongEntries").innerHTML =
    "Wrong entries: " + wrongEntries;
  document.getElementById("guessesRemaining").innerHTML =
    "Guesses remaining: " + guessesRemaining;
  document.getElementById("gamesWon").innerHTML =
    "Number of games won: " + numberOfGamesWon;
document.getElementById("gamesLost").innerHTML =
    "Number of games lost: " + numberOfGamesLost;
}

function checkForWin() {
  let neededToWin = winningLetters.length;
  let gotRight = 0;
  for (i = 0; i < winningLetters.length; i++) {
    //For every winning letter
    if (rightEntries.indexOf(winningLetters[i]) !== -1) {
      //If it exists in rightEntries
      gotRight = gotRight + 1; //Increase the number of letters gotten right by one
    }
  }
  if (gotRight === neededToWin) {
    //If the number of letters gotten right is equal to that needed to win, player wins
    alert("You won!");
    numberOfGamesWon += 1;
    updateScoreboard();
    beginNewGame();
  }
}

function checkForLoss() {
    if(guessesRemaining < 0) {
        numberOfGamesLost += 1;
        beginNewGame();
    }
}

//**************************************************RUNTIME**************************************************

//Start the first game
beginNewGame();

//Handle user input
document.onkeyup = function(event) {
  //Define key entered as 'x'
  let x = event.key.toLowerCase();
  //If a losing letter that hasn't been entered before, penalize
  if (winningLetters.indexOf(x) === -1 && wrongEntries.indexOf(x) === -1) {
    guessesRemaining = guessesRemaining - 1;
    wrongEntries.push(x);
    //If a winning letter that hasn't already been entered, reward
  } else if (
    winningLetters.indexOf(x) !== -1 &&
    rightEntries.indexOf(x) === -1
  ) {
    rightEntries.push(x);
  }

  checkForWin();
  checkForLoss();
  updateScoreboard();
};
