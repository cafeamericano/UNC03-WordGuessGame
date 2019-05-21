//**************************************************INITIALIZE GLOBAL VARIABLES**************************************************

let wordPool = [
  "sword",
  "axe",
  "shield",
  "staff",
  "helmet",
  "gloves",
  "boots",
  "magic",
  "potion",
  "monster"
];

//**************************************************OBJECTS**************************************************

//Magic Word//////////////////////////////////////////////////
let magicWord = {
  randomIndex: 0,
  winningWord: '',
  winningLetters: [],
  concealedLetters: [],
  rightEntries: [],
  wrongEntries: [],
  clear: function() {
    this.winningLetters = []; //Reset
    this.concealedLetters = []; //Reset
    this.rightEntries = []; //Reset
    this.wrongEntries = []; //Reset
  },
  choose: function() {
    this.randomIndex = Math.floor(Math.random() * wordPool.length);
    this.winningWord = wordPool[this.randomIndex];
    for (i = 0; i < this.winningWord.length; i++) {
      this.winningLetters.push(this.winningWord[i].toLowerCase());
    }
    //Display anonymized letters
    for (i = 0; i < this.winningWord.length; i++) {
      this.concealedLetters.push("__  ");
    }
  },

}

//Game//////////////////////////////////////////////////
let game = {
  defaultBeginGuesses: 5,
  guessesRemaining: 0,
  numberOfGamesWon: 0,
  numberOfGamesLost: 0,

  resetGuessCount: function() {
    this.guessesRemaining = this.defaultBeginGuesses; //Reset
  },
  
  beginNew: function() {
    this.resetGuessCount();
    audio.reset();
    magicWord.clear();
    magicWord.choose();
    scoreboard.update();
    princess.resetSprite();
    enemy.resetStartPosition();
    audio.battleTheme.play();
  }
};

//Status//////////////////////////////////////////////////
let status = {
  checkForLoss: function() {
    if (game.guessesRemaining === 0) {
      audio.battleTheme.pause();
      audio.gameOver.play();
      princess.makeDead();
      game.numberOfGamesLost += 1;
      setTimeout(function() {
        game.beginNew();
      }, 6000);
    }
  },
  checkForWin: function() {
    let neededToWin = magicWord.winningLetters.length;
    let gotRight = 0;
    for (i = 0; i < magicWord.winningLetters.length; i++) {
      //For every winning letter
      if (magicWord.rightEntries.indexOf(magicWord.winningLetters[i]) !== -1) {
        //If it exists in rightEntries
        gotRight = gotRight + 1; //Increase the number of letters gotten right by one
      }
    }
    if (gotRight === neededToWin) {
      //If the number of letters gotten right is equal to that needed to win, player wins
      audio.battleTheme.pause();
      audio.fanfare.play();
      game.numberOfGamesWon += 1;
      scoreboard.update();
      setTimeout(function() {
        game.beginNew();
      }, 5000);
    }
  },
  check: function() {
    this.checkForWin();
    this.checkForLoss();
  }
};

//Scoreboard//////////////////////////////////////////////////
let scoreboard = {
  update: function() {
    document.getElementById("rightEntries").innerHTML = "Right entries: " + magicWord.rightEntries;
    document.getElementById("wrongEntries").innerHTML = "Wrong entries: " + magicWord.wrongEntries;
    document.getElementById("guessesRemaining").innerHTML = "Guesses remaining: " + game.guessesRemaining;
    document.getElementById("gamesWon").innerHTML = "Number of games won: " + game.numberOfGamesWon;
    document.getElementById("gamesLost").innerHTML = "Number of games lost: " + game.numberOfGamesLost;
    document.getElementById("concealedLetters").innerHTML = "Concealed letters: " + magicWord.concealedLetters.join(" ");
  }
};

//Enemy//////////////////////////////////////////////////
let enemy = {
  defaultXposition: 50,
  xPosition: 5,
  moveRight: function() {
    this.xPosition += 100;
    document.getElementById("evilEye").style.left = this.xPosition + "px";
    console.log(this.xPosition)
  },
  resetStartPosition: function() {
    this.xPosition = this.defaultXposition;
    document.getElementById("evilEye").style.left = this.defaultXposition + "px";
  }
};

//Princess//////////////////////////////////////////////////
let princess = {
  makeDead: function() {
    document.getElementById("princess").style.transform = "rotate(90deg) scale(3)";
  },
  resetSprite: function() {
    document.getElementById("princess").style.transform = "scale(3)";
  }
};

//Audio//////////////////////////////////////////////////
let audio = {
  battleTheme: document.getElementById("battleTheme"),
  gameOver: document.getElementById("gameOverSound"),
  fanfare: document.getElementById("fanfare"),
  reset: function() {
    this.fanfare.pause();
    this.fanfare.currentTime = 0;
    this.gameOver.pause();
    this.gameOver.currentTime = 0;
    this.battleTheme.pause();
    this.battleTheme.currentTime = 0;
  }
};

//**************************************************RUNTIME**************************************************

//Start the first game
let ready = confirm("Ready to play?")
if(ready){
  audio.reset();
  game.beginNew();
}

//Handle user input
document.onkeyup = function(event) {
  //Define key entered as 'x'
  let x;
  let validKeyStrokes = [];
  //Allow uppercase characters
  for (i = 65; i < 91; i++) {
    validKeyStrokes.push(i);
  }
  //Allow lowercase charcters
  for (i = 97; i < 123; i++) {
    validKeyStrokes.push(i);
  }
  //Define key entered as long as it's a lowercase or uppercase letter
  if (validKeyStrokes.indexOf(event.keyCode) !== -1) {
    x = event.key.toLowerCase();
  }
  //If a losing letter that hasn't been entered before, penalize
  if (magicWord.winningLetters.indexOf(x) === -1 && magicWord.wrongEntries.indexOf(x) === -1) {
    game.guessesRemaining = game.guessesRemaining - 1;
    magicWord.wrongEntries.push(x);
    enemy.moveRight();
    

    //If a winning letter that hasn't already been entered, reward
  } else if (
    magicWord.winningLetters.indexOf(x) !== -1 &&
    magicWord.rightEntries.indexOf(x) === -1
  ) {
    magicWord.rightEntries.push(x);

    for (i = 0; i < magicWord.winningLetters.length; i++) {
      if (x === magicWord.winningLetters[i]) {
        magicWord.concealedLetters[i] = magicWord.winningLetters[i];
      }
    }
  }

  status.check();
  scoreboard.update();
};
