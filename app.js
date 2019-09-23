const setCookie = (cvalue) => {
  let d = new Date();
  d.setTime(d.getTime() + (30*24*60*60*1000));
  let expires = "expires=" + d.toGMTString();
  const cname = "hscore";
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = () => {
  let name = "hscore=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const game = () => {
  let pScore = 0;
  let cScore = 0;
  //Start the Game
  const startGame = () => {
    const score = document.querySelector(".score");
    const playBtn = document.querySelector(".intro button");
    const introScreen = document.querySelector(".intro");
    const match = document.querySelector(".match");

    playBtn.addEventListener("click", () => {
      introScreen.classList.add("fadeOut");
      score.classList.add("fadeIn");
      match.classList.add("fadeIn");
    });
  };
  //Play Match
  const playMatch = () => {
    const input = document.querySelector("input");
    const options = document.querySelectorAll(".options button");
    const playerHand = document.querySelector(".player-hand");
    const computerHand = document.querySelector(".computer-hand");
    const hands = document.querySelectorAll(".hands img");
    const winningScoreDisplay = document.querySelector("#numInput");
    const resetButton = document.querySelector("#reset");
    const hscore = document.querySelector(".hscore");
    const gameover = false;
    let winningScore = 5;

    input.addEventListener("change", function(){
      winningScoreDisplay.textContent = this.value;
      winningScore = Number(this.value);
      reset();
    });

    resetButton.addEventListener("click", function(){
      reset();
      hscore.classList.add("fadeOut");
    });

    if(!gameover){
    hands.forEach(hand => {
      hand.addEventListener("animationend", function() {
        this.style.animation = "";
      });
    });
    //Computer Options
    const computerOptions = ["rock", "paper", "scissors"];
    
    options.forEach(option => {
      option.addEventListener("click", function() {
        //Computer Choice
        const computerNumber = Math.floor(Math.random() * 3);
        const computerChoice = computerOptions[computerNumber];

        if(pScore == winningScore || cScore == winningScore) {
          gameover = true;
          hscore.classList.add("fadeIn");
          if (pScore>cScore) {
            const oldScore = getCookie();
            if (oldScore=="") {
              hscore.appendChild(document.createTextNode("Congratulations, you have set a new record of " + pScore "."));
              setCookie(pScore);
            }
            else if (oldScore<pScore) {
              hscore.appendChild(document.createTextNode("Congratulations, you have broken your own record of " + oldScore "."));
              setCookie(pScore);
            }
            else {
              hscore.appendChild(document.createTextNode("You were " + pScore-oldScore + " points away from breaking your own record."));
            }
          }
          else {
            hscore.appendChild(document.createTextNode("Better luck next time!"));
          }
        }
        setTimeout(() => {
          //Update Images
          playerHand.src = `./assets/${this.textContent}.png`;
          computerHand.src = `./assets/${computerChoice}.png`;
          //Here is where we call compare hands
          compareHands(this.textContent, computerChoice);
        }, 2000);
        //Animation
        playerHand.style.animation = "shakePlayer 2s ease";
        computerHand.style.animation = "shakeComputer 2s ease";
      });
    });
  }
  };

  const reset = () => {
    pScore = 0;
    cScore = 0;
    gameover = false;
    updateScore();
    document.querySelector(".winner").textContent = "Choose an Option";
  }
  const updateScore = () => {
    const playerScore = document.querySelector(".player-score p");
    const computerScore = document.querySelector(".computer-score p");
    playerScore.textContent = pScore;
    computerScore.textContent = cScore;
    playerScore.classList.remove("selected");
    computerScore.classList.remove("selected");
  };

  const compareHands = (playerChoice, computerChoice) => {
    //Update Text
    const winner = document.querySelector(".winner");
    //Checking for a tie
    const gameover = false;
    if (playerChoice === computerChoice) {
      winner.textContent = "It is a tie";
      return;
    }
    //Check for Rock
    if (playerChoice === "rock") {
      if (computerChoice === "scissors") {
        winner.textContent = "Player Wins";
        pScore++;
        updateScore();
        return;
      } else {
        winner.textContent = "Computer Wins";
        cScore++;
        updateScore();
        return;
      }
    }
    //Check for Paper
    if (playerChoice === "paper") {
      if (computerChoice === "scissors") {
        winner.textContent = "Computer Wins";
        cScore++;
        updateScore();
        return;
      } else {
        winner.textContent = "Player Wins";
        pScore++;
        updateScore();
        return;
      }
    }
    //Check for Scissors
    if (playerChoice === "scissors") {
      if (computerChoice === "rock") {
        winner.textContent = "Computer Wins";
        cScore++;
        updateScore();
        return;
      } else {
        winner.textContent = "Player Wins";
        pScore++;
        updateScore();
        return;
      }
    }
  };

  //Is call all the inner function
  startGame();
  playMatch();
};

//start the game function
game();
