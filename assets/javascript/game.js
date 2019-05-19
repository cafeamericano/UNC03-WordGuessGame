//**************************************************GLOBAL VARIABLES**************************************************

let winningLetters = [];
let rightEntries = [];
let wrongEntries = [];
let numberOfGamesWon = 0;

//**************************************************OBJECTS**************************************************

let gameSession = {
  guessesRemaining: 20,
  wordPool: ["Mario", "Luigi", "Yoshi", "Bowser"]
};

let randomIndex = Math.floor(Math.random() * gameSession.wordPool.length);
let winningWord = gameSession.wordPool[randomIndex];

document.getElementById("winningWord").innerHTML = winningWord;



//Define what letters are correct
for (i = 0; i < winningWord.length; i++) {
  winningLetters.push(winningWord[i]);
}

//**************************************************FUNCTIONS**************************************************
function updateScoreboard() {
  document.getElementById("rightEntries").innerHTML = rightEntries;
  document.getElementById("wrongEntries").innerHTML = wrongEntries;
  document.getElementById("guessesRemaining").innerHTML =
    gameSession.guessesRemaining;
  document.getElementById("gamesWon").innerHTML = numberOfGamesWon;
}

function checkForWin() {
  //For every winning letter
  let neededToWin = winningLetters.length;
  let gotRight = 0;
  for (i = 0; i < winningLetters.length; i++) {
    //If it exists in rightEntries
    if (rightEntries.indexOf(winningLetters[i]) !== -1) {
      //Increase the number of letters gotten right by one
      gotRight = gotRight + 1;
    }
  }
  //If the number of letters gotten right is equal to that needed to win, player wins
  if (gotRight === neededToWin) {
    alert("You won!");
    numberOfGamesWon += 1;
    updateScoreboard();
  }
  console.log("Got right: " + gotRight);
}

//**************************************************RUNTIME**************************************************

//Handle user input
document.onkeyup = function(event) {
  //Define key entered as 'x'
  let x = event.key;
  //If a losing letter that hasn't been entered before, penalize
  if (winningLetters.indexOf(x) === -1 && wrongEntries.indexOf(x) === -1) {
    gameSession.guessesRemaining = gameSession.guessesRemaining - 1;
    wrongEntries.push(x);
    //If a winning letter that hasn't already been entered, reward
  } else if (
    winningLetters.indexOf(x) !== -1 &&
    rightEntries.indexOf(x) === -1
  ) {
    rightEntries.push(x);
    console.log("Correct letter entered!");
  }

  updateScoreboard();
  checkForWin();
};
