

// [0][1][2]
// [3][4][5]
// [6][7][8]


"use strict";
document.onkeypress = function (evt) {
    evt = evt || window.event;
    let modal = document.getElementsByClassName("modal")[0];
    if (evt.keyCode === 27) {
      modal.style.display = "none";
    }
  };
  
  window.onclick = function (evt) {
    let modal = document.getElementsByClassName("modal")[0];
    if (evt.target === modal) {
      modal.style.display = "none";
    }
  };
  
  function sumArray(array) {
    let sum = 0,
      i = 0;
    for (i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum;
  }
  
  function isInArray(element, array) {
    if (array.indexOf(element) > -1) {
      return true;
    }
    return false;
  }
  
  function shuffleArray(array) {
    let counter = array.length,
      temp,
      index;
    while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }
  
  function intRandom(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

//Global variables

let moves = 0
let winner = 0
let x = 1
let o = 3
let player = x
let computer = o
let score = {
    ties:0,
    computer:0,
    player: 0
}
let xText = '<span class="x">&times</span>'
let oText ='<span class="o">0</span>'
let playerText = xText
let computerText = oText
let difficulty = 1
let myGrid = null
let whoseTurn = false
let gameOver = false


// Grid Object

//grid constructor
function Grid(){
    this.cells = new Array(9)
}

//Grid methods

Grid.prototype.getFreeCellIndices = function(){
    let i = 0, resultArray = []
    for(i=0; i< this.cells.length; i++){
        if(this.cells[i]===0){
            resultArray.push(i)
        }
    }
    console.log("Result array:" + resultArray.toString())
    return resultArray
}


//Get row

Grid.prototype.getRowValues = function(index){
    if(index !== 0 && index !== 1 && index !==2){
        console.log("not right argument")
        return undefined
    }
    let i = index * 3
    return this.cells.slice(i, i + 3)
};

Grid.prototype.getRowIndices = function(index){
    if(index !== 0 && index !== 1 && index !==2){
        console.log("not")
        return undefined
    }
    let row = []
    index = index * 3
    row.push(index)
    row.push(index + 1)
    row.push(index + 2)

    return row
}

// get column value


Grid.prototype.getColumnValues = function(index){
    if(index !== 0 && index !== 1 && index !==2){
        console.log("not")
        return undefined
    }
    let i, column = []
    for(i = index; i < this.cells.length; i += 3){
        column.push(this.cells[i])
    }
    return column
}

// get column index

Grid.prototype.getColumnIndices = function(index){
    if(index !== 0 && index !== 1 && index !==2){
        console.log("not")
        return undefined
    }
    let i, column = []
    for(i = 0; i < this.cells.length; i += 3){
        column.push(i)
    }
    return column
}

// get diagonal cells
// arg 0 left
// arg 1 right

Grid.prototype.getDiagValues = function(arg){
    let cells= []
    if(arg !== 1 && arg !== 0){
        console.log("not arg getDiagValues")
     return undefined
    } else if(arg === 0){
        cells.push(this.cells[0])
        cells.push(this.cells[4])
        cells.push(this.cells[8])
    }else {
        cells.push(this.cells[2])
        cells.push(this.cells[4])
        cells.push(this.cells[6])
    }
    return cells

}


Grid.prototype.getDiagIndices = function(arg){
    if(arg !== 1 && arg !== 0){
        console.log("not arg getDiagValues")
     return undefined
    } else if (arg === 0){
        return[0, 4, 8]
    }else {
        return[2, 4, 6]
    }
}

// get first with two in a row


Grid.prototype.getFirstWithTwoInARow = function (agent) {
    if (agent !== computer && agent !== player) {
      console.error(
        "Function getFirstWithTwoInARow accepts only player or computer as argument."
      );
      return undefined;
    }
    let sum = agent * 2,
      freeCells = shuffleArray(this.getFreeCellIndices());
    for (let i = 0; i < freeCells.length; i++) {
      for (let j = 0; j < 3; j++) {
        let rowV = this.getRowValues(j);
        let rowI = this.getRowIndices(j);
        let colV = this.getColumnValues(j);
        let colI = this.getColumnIndices(j);
        if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
          return freeCells[i];
        } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
          return freeCells[i];
        }
      }
      for (let j = 0; j < 2; j++) {
        let diagV = this.getDiagValues(j);
        let diagI = this.getDiagIndices(j);
        if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
          return freeCells[i];
        }
      }
    }
    return false;
};

Grid.prototype.reset = function(){
    for(let i=0; i<this.cells.length; i++){
        this.cells[i] = 0
    }
    return true
}


// Main functions

function initialize(){
    myGrid = new Grid();
    moves = 0
    winner = 0
    gameOver = false
    whoseTurn = player
    for(let i =0; i < myGrid.cells.length; i++){
        myGrid.cells[i] = 0
    }
    setTimeout(showOptions, 500)
}


function assignRoles(){
    askUser("Do you want to go first?")
    document.getElementById('yesBtn').addEventListener('click', makePlayer0)
}

function makePlayerX(){
    player =x
    computer = o
    whoseTurn = player
    playerText = xText
    computerText = oText
    document.getElementById('yesBtn').removeEventListener("click", makePlayerX)
    document.getElementById('yesBtn').removeEventListener("click", makePlayerO)
}
function makePlayerO(){
    player =o
    computer = x
    whoseTurn = computer
    playerText = oText
    computerText = xText
    setTimeout(makeComputerMove, 500)
    document.getElementById('userFeedback').style.display = "none"
    document.getElementById('yesBtn').removeEventListener("click", makePlayerX)
    document.getElementById('yesBtn').removeEventListener("click", makePlayerO)
}

// make computer move
function cellClicked(id){
    let idName = id.toString(id)
    let cell = parseInt(idName[idName.length - 1])
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        return false;
    }
    moves++
    document.getElementById(id).innerHTML = playerText
    let rand = Math.random()
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
      } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
      }
    
    document.getElementById(id).style.cursor = 'default'
    myGrid.cells[cell] = player
    if (moves>=5){
        winner = checkWin()
    }
    if(winner === 0 ){
        whoseTurn = computer
        makeComputerMove()
    }
    return true
}
function restartGame(ask) {
    if (moves > 0) {
      var response = confirm("Are you sure you want to start over?");
      if (response === false) {
        return;
      }
    }
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = x;
    myGrid.reset();
    for (let i = 0; i <= 8; i++) {
      var id = "cell" + i.toString();
      document.getElementById(id).innerHTML = "";
      document.getElementById(id).style.cursor = "pointer";
      document.getElementById(id).classList.remove("win-color");
    }
    if (ask === true) {
      setTimeout(showOptions, 200);
    } else if (whoseTurn == computer) {
      setTimeout(makeComputerMove, 800);
    }
  }
  
  function makeComputerMove() {
    if (gameOver) {
      return false;
    }
    let cell = -1,
      myArr = [],
      corners = [0, 2, 6, 8];
    if (moves >= 3) {
      cell = myGrid.getFirstWithTwoInARow(computer);
      if (cell === false) {
        cell = myGrid.getFirstWithTwoInARow(player);
      }
      if (cell === false) {
        if (myGrid.cells[4] === 0 && difficulty == 1) {
          cell = 4;
        } else {
          myArr = myGrid.getFreeCellIndices();
          cell = myArr[intRandom(0, myArr.length - 1)];
        }
      }
      if (
        moves == 3 &&
        myGrid.cells[4] == computer &&
        player == x &&
        difficulty == 1
      ) {
        if (
          myGrid.cells[7] == player &&
          (myGrid.cells[0] == player || myGrid.cells[2] == player)
        ) {
          myArr = [6, 8];
          cell = myArr[intRandom(0, 1)];
        } else if (
          myGrid.cells[5] == player &&
          (myGrid.cells[0] == player || myGrid.cells[6] == player)
        ) {
          myArr = [2, 8];
          cell = myArr[intRandom(0, 1)];
        } else if (
          myGrid.cells[3] == player &&
          (myGrid.cells[2] == player || myGrid.cells[8] == player)
        ) {
          myArr = [0, 6];
          cell = myArr[intRandom(0, 1)];
        } else if (
          myGrid.cells[1] == player &&
          (myGrid.cells[6] == player || myGrid.cells[8] == player)
        ) {
          myArr = [0, 2];
          cell = myArr[intRandom(0, 1)];
        }
      } else if (
        moves == 3 &&
        myGrid.cells[4] == player &&
        player == x &&
        difficulty == 1
      ) {
        if (myGrid.cells[2] == player && myGrid.cells[6] == computer) {
          cell = 8;
        } else if (myGrid.cells[0] == player && myGrid.cells[8] == computer) {
          cell = 6;
        } else if (myGrid.cells[8] == player && myGrid.cells[0] == computer) {
          cell = 2;
        } else if (myGrid.cells[6] == player && myGrid.cells[2] == computer) {
          cell = 0;
        }
      }
    } else if (moves === 1 && myGrid.cells[4] == player && difficulty == 1) {
      cell = corners[intRandom(0, 3)];
    } else if (
      moves === 2 &&
      myGrid.cells[4] == player &&
      computer == x &&
      difficulty == 1
    ) {
      if (myGrid.cells[0] == computer) {
        cell = 8;
      } else if (myGrid.cells[2] == computer) {
        cell = 6;
      } else if (myGrid.cells[6] == computer) {
        cell = 2;
      } else if (myGrid.cells[8] == computer) {
        cell = 0;
      }
    } else if (moves === 0 && intRandom(1, 10) < 8) {
      cell = corners[intRandom(0, 3)];
    } else {
      if (myGrid.cells[4] === 0 && difficulty == 1) {
        cell = 4;
      } else {
        myArr = myGrid.getFreeCellIndices();
        cell = myArr[intRandom(0, myArr.length - 1)];
      }
    }
    var id = "cell" + cell.toString();
    console.log("computer chooses " + id);
    document.getElementById(id).innerHTML = computerText;
    document.getElementById(id).style.cursor = "default";
  
    var rand = Math.random();
    if (rand < 0.3) {
      document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
      document.getElementById(id).style.transform = "rotate(90deg)";
    }
    myGrid.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
      winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
      whoseTurn = player;
    }
}


function checkWin(){
    winner =0
    // rows
    for(let i = 0; i <=2; i++){
        let row = myGrid.getRowValues(i)
        if (row[0]>0 && row[0]==row[1] && row[0]== row[2]){
            if(row[0]==computer){
                score.computer++
                winner=computer
                console.log("comp wins")
            }else{
                score.player++
                winner = player
                console.log("wins player")
            }

            let tmpAr = myGrid.getRowIndices(i)
            for(let j =0; j<tmpAr.length; j++){
                let str = "cell" + tmpAr [j]
                document.getElementById(str).classList.add("win-color")

            }
            setTimeout(endGame, 1000, winners)
            return winner
        }
    }

    for(let i = 0; i <=2; i++){
        let col = myGrid.getColumnValues(i)
        if (col[0]>0 && col[0]==col[1] && col[0]== col[2]){
            if(col[0]==computer){
                score.computer++
                winner=computer
                console.log("comp wins")
            }else{
                score.player++
                winner = player
                console.log("wins player")
            }
    
            let tmpAr = myGrid.getColumnIndices(i)
            for(let j =0; j<tmpAr.length; j++){
                let str = "cell" + tmpAr [j]
                document.getElementById(str).classList.add("win-color")
    
            }
            setTimeout(endGame, 1000, winner)
            return winner
        }
    }


    //diagonals

    for(let i = 0; i<= 1; i++){
        let diagonal = myGrid.getDiagValues(i)
        if(diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0]== diagonal[2]){
            if(diagonal[0]== computer){
                score.computer++
                winner = computer
            } else {
                score.player++
                winner= player
            }

            let tmpAr = myGrid.getDiagIndices(i)
            for(let j =0; j<tmpAr.length; j++){
                let str = "cell" + tmpAr [j]
                document.getElementById(str).classList.add("win-color")
    
            }
            setTimeout(endGame, 1000, winner)
            return winner
        }
    }

    let myArr = myGrid.getFreeCellIndices()
    if(myArr.length === 0){
        winner = 10
        score.ties++;
        endGame(winner)
        return winner
    }
    return winner
}



function announceWinner(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = "block";
    setTimeout(closeModal, 1400, "winAnnounce");
  }
  
  function askUser(text) {
    document.getElementById("questionText").innerHTML = text;
    document.getElementById("userFeedback").style.display = "block";
  }
  
  function showOptions() {
    if (player == o) {
      document.getElementById("rx").checked = false;
      document.getElementById("ro").checked = true;
    } else if (player == x) {
      document.getElementById("rx").checked = true;
      document.getElementById("ro").checked = false;
    }
    if (difficulty === 0) {
      document.getElementById("r0").checked = true;
      document.getElementById("r1").checked = false;
    } else {
      document.getElementById("r0").checked = false;
      document.getElementById("r1").checked = true;
    }
    document.getElementById("optionsDlg").style.display = "block";
  }
  
  function getOptions() {
    let diffs = document.getElementsByName("difficulty");
    for (let i = 0; i < diffs.length; i++) {
      if (diffs[i].checked) {
        difficulty = parseInt(diffs[i].value);
        break;
      }
    }
    if (document.getElementById("rx").checked === true) {
      player = x;
      computer = o;
      whoseTurn = player;
      playerText = xText;
      computerText = oText;
    } else {
      player = o;
      computer = x;
      whoseTurn = computer;
      playerText = oText;
      computerText = xText;
      setTimeout(makeComputerMove, 400);
    }
    document.getElementById("optionsDlg").style.display = "none";
  }
  
  function closeModal(id) {
    document.getElementById(id).style.display = "none";
}



function endGame(who){
    if(who == player){
        announceWinner("you win")
    }else if(who == computer){
        announceWinner("computer win")
    }else{
        announceWinner("its a tie")
    }
    gameOver = true
    whoseTurn = 0
    moves = 0
    winner = 0
    document.getElementById("tie_score").innerHTML = score.ties
    document.getElementById("computer_score").innerHTML = score.computer
    document.getElementById("player_score").innerHTML = score.player

    for (let i = 0; i<=8; i++){
        let id = 'cell' + i.toString()
        document.getElementById(id).style.cursor = "default"
    }
    setTimeout(restartGame, 800);
}