//**************************************************INITIALIZE GLOBAL VARIABLES**************************************************
let screenWidth = 600;

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
  winningWord: "",
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
  }
};

//Game//////////////////////////////////////////////////
let game = {
  ended: false,
  defaultBeginGuesses: 9,
  guessesRemaining: 0,
  numberOfGamesWon: 0,
  numberOfGamesLost: 0,

  resetGuessCount: function() {
    this.guessesRemaining = this.defaultBeginGuesses; //Reset
  },

  beginNew: function() {
    enemy.deanimate();
    princess.deanimate();
    this.resetGuessCount();
    this.ended = false;
    outcomeMessage.reset();
    audio.reset();
    magicWord.clear();
    magicWord.choose();
    scoreboard.update();
    princess.resetSprite();
    enemy.resetSprite();
    princess.animate();
    enemy.animate();
  }
};

//Input Processor//////////////////////////////////////////////////
let input = {
  normalize: function(event) {
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
    return x;
  },

  analyze: function(event) {
    if (game.ended === false) {
      //Define key entered as 'x'
      let x = this.normalize(event);
      //If a losing letter that hasn't been entered before, penalize
      if (
        magicWord.winningLetters.indexOf(x) === -1 &&
        magicWord.wrongEntries.indexOf(x) === -1
      ) {
        this.punishPlayer(x);
        //If a winning letter that hasn't already been entered, reward
      } else if (
        magicWord.winningLetters.indexOf(x) !== -1 &&
        magicWord.rightEntries.indexOf(x) === -1
      ) {
        this.rewardPlayer(x);
      }
      judge.checkWinOrLoss();
      scoreboard.update();
    }
  },

  rewardPlayer: function(x) {
    magicWord.rightEntries.push(x);
    for (i = 0; i < magicWord.winningLetters.length; i++) {
      if (x === magicWord.winningLetters[i]) {
        magicWord.concealedLetters[i] = magicWord.winningLetters[i];
      }
    }
  },

  punishPlayer: function(x) {
    game.guessesRemaining = game.guessesRemaining - 1;
    magicWord.wrongEntries.push(x);
    enemy.moveRight();
  }
};

//Outcome Overlay//////////////////////////////////////////////////
let outcomeMessage = {
  notifyLoss: function() {
    document.getElementById("gameOutcome").innerHTML = "You have lost.";
  },
  notifyWin: function() {
    document.getElementById("gameOutcome").innerHTML = "You have won!";
  },
  reset: function() {
    document.getElementById("gameOutcome").innerHTML = "";
  }
};

//Judge//////////////////////////////////////////////////
let judge = {
  checkForLoss: function() {
    if (game.guessesRemaining === 0) {
      game.ended = true;
      outcomeMessage.notifyLoss();
      audio.reset();
      audio.gameOver.play();
      princess.setAvatar(princess.avatars.dead);
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
      game.ended = true;
      outcomeMessage.notifyWin();
      audio.reset();
      audio.fanfare.play();
      game.numberOfGamesWon += 1;
      scoreboard.update();
      setTimeout(function() {
        game.beginNew();
      }, 4500);
    }
  },
  checkWinOrLoss: function() {
    this.checkForWin();
    this.checkForLoss();
  }
};

//Scoreboard//////////////////////////////////////////////////
let scoreboard = {
  update: function() {
    document.getElementById("rightEntries").innerHTML =
      "Right entries: " + magicWord.rightEntries;
    document.getElementById("wrongEntries").innerHTML =
      "Wrong entries: " + magicWord.wrongEntries;
    document.getElementById("guessesRemaining").innerHTML =
      "Guesses remaining: " + game.guessesRemaining;
    document.getElementById("gamesWon").innerHTML =
      "Number of games won: " + game.numberOfGamesWon;
    document.getElementById("gamesLost").innerHTML =
      "Number of games lost: " + game.numberOfGamesLost;
    document.getElementById(
      "concealedLetters"
    ).innerHTML = magicWord.concealedLetters.join(" ");
  }
};

//Enemy//////////////////////////////////////////////////
let enemy = {
  avatars: {
    current: "",
    openEye: "assets/images/openEye.png",
    closedEye: "assets/images/closedEye.png"
  },
  animation: "inactive",
  defaultXposition: 30,
  xPosition: this.defaultXposition,
  setAvatar: function(chosenavatar) {
    document.getElementById("enemy").setAttribute("src", `${chosenavatar}`);
    document.getElementById("enemy").style.transform = "scale(4)";
    this.avatars.current = chosenavatar;
  },
  moveRight: function() {
    this.xPosition += 50;
    document.getElementById("enemy").style.left = this.xPosition + "px";
    console.log(this.xPosition);
  },
  resetStartPosition: function() {
    this.xPosition = this.defaultXposition;
    document.getElementById("enemy").style.left = this.defaultXposition + "px";
  },
  resetSprite: function() {
    this.setAvatar(this.avatars.openEye);
    this.resetStartPosition();
  },
  animate: function() {
    this.animation = setInterval(function() {
      if (game.ended === false) {
        console.log(enemy.avatars.current);
        if (enemy.avatars.current == enemy.avatars.closedEye) {
          enemy.setAvatar(enemy.avatars.openEye);
        } else {
          enemy.setAvatar(enemy.avatars.closedEye);
        }
      }
    }, 1000);
  },
  deanimate: function() {
    clearInterval(this.animation);
  }
};

//Princess//////////////////////////////////////////////////
let princess = {
  avatars: {
    current: "",
    alive: "assets/images/princess.png",
    alternate: "assets/images/princessAlternate.png",
    dead: "assets/images/deadPrincess.png"
  },
  animation: "inactive",
  setAvatar: function(chosenavatar) {
    document.getElementById("princess").setAttribute("src", `${chosenavatar}`);
    document.getElementById("princess").style.transform = "scale(3)";
    this.avatars.current = chosenavatar;
  },
  resetSprite: function() {
    this.setAvatar(this.avatars.alive);
    document.getElementById("princess").style.transform = "scale(3)";
  },
  animate: function() {
    this.animation = setInterval(function() {
      if (game.ended === false) {
        console.log(princess.avatars.current);
        if (princess.avatars.current == princess.avatars.alive) {
          princess.setAvatar(princess.avatars.alternate);
        } else {
          princess.setAvatar(princess.avatars.alive);
        }
      }
    }, 500);
  },
  deanimate: function() {
    clearInterval(this.animation);
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
game.beginNew();

//Handle user input
document.onkeyup = function(event) {
  input.analyze(event);
};
