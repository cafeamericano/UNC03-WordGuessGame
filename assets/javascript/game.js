let gameSession = {
  guessesRemaining: 20,
  wordPool: ["Mario", "Luigi", "Yoshi", "Bowser"]
};

let randomIndex = Math.floor(Math.random() * gameSession.wordPool.length);
let randomWord = gameSession.wordPool[randomIndex];

let winningLetters = [];

let rightEntries = [];
let wrongEntries = [];

//Define what letters are correct
for (i = 0; i < randomWord.length; i++) {
  winningLetters.push(randomWord[i]);
}

document.write(randomWord);

//Accept user input
document.onkeyup = function(event) {
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
  console.log("===============================");
  console.log("Right entries: " + rightEntries);
  console.log("Wrong entries: " + wrongEntries);
  console.log("Remaining guesses: " + gameSession.guessesRemaining);
};
