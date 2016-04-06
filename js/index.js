// variables
var board = {
  a1: "",
  a2: "",
  a3: "",
  b1: "",
  b2: "",
  b3: "",
  c1: "",
  c2: "",
  c3: ""
}
var player = "";
var cpu = "";
var counter = 0;
var human = 0;
var computer = 0;

// functions***************

function setComputer(value) {
  cpu = value;
}

function getComputer() {
  return cpu;
}

function setPlayer(value) {
  player = value;
}

function getPlayer() {
  return player;
}

function resetBoard() {
  console.log("board is reset!")

  for (var key in board) {
    $('#move').remove();
    board[key] = "";
  }
  $("#playO").html("play as O");
  $("#playX").html("play as X");
  setPlayer("");
  setComputer("");
  counter = 0;
}

function incScoreBoard(xO) {
  if (getPlayer() == xO) {
    human += 1;
    alert("You Won!")
  } else {
    computer += 1;
    alert("Computer Wins!")
  }
  resetBoard();
  $("#scoreBoard").html("The score is human: " + human + " computer: " + computer)

}



function checkForWin(inc) {
  console.log("checkForWin was fired");
  var pass = true;
  var checkRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
  counter += inc;

  if (counter < 9) {
    for (var i = 0; i < 8; i++) {
      if (board[Object.keys(board)[checkRows[i][0]]] == board[Object.keys(board)[checkRows[i][1]]] && board[Object.keys(board)[checkRows[i][0]]] == board[Object.keys(board)[checkRows[i][2]]]) {
        if (board[Object.keys(board)[checkRows[i][0]]] !== "") {
          if (board[Object.keys(board)[checkRows[i][1]]] !== "") {
            if (board[Object.keys(board)[checkRows[i][2]]] !== "") {
              incScoreBoard(board[Object.keys(board)[checkRows[i][2]]]);
              // alert("Winner!");
              pass = false;
            }
          }
        }
      }
    } //forloop ending
  } //end of top if
  else {
    alert("tie game!")
    resetBoard();
    pass = false;
  }
  return pass;
} //function ending

function checkForEmpty(value) {
  var empty = true;
  if (value != "") {
    empty = false;
  }
  return empty;
}

function playerPicked(value) {
  if (getPlayer() === "") {

    if (value === "#playO") {

      $("#playX").html("Computer is X");
      setComputer("X");
      setPlayer("O");
      $("#playO").html("You are O");

    } else if (value === "#playX") {

      $("#playO").html("Computer is O");
      setComputer("O");
      setPlayer("X");
      $("#playX").html("You are X");

    }
  } else {
    alert('press "reset game" to switch your letter');
  }
}

function playerPickedLetter() {
  var pass = true;
  if (getPlayer() === "") {
    pass = false;
  }
  return pass;
}

function checkForTaken(input){
  var pass = false;
  var key = Object.keys(board)[input];
  var value = board[key];
  if(checkForEmpty(value)){
    pass = true;
  }else{
    alert("This sqaure is taken try another square!")
  }
  return pass; 
}

function playersChoice(input, XorO) {

  var key = Object.keys(board)[input];
  
    board[key] = XorO;
    $('#' + key).append("<p id='move'>" + XorO + " </p>");
  
 
}

//       winOrBlock
function winOrBlock(xO) {
  console.log("winOrBlock was fired!");
  var checkRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
  var found = false;

  if (!found) {
    //look for win or block
    for (var i = 0; i < 8; i++) {
      if (board[Object.keys(board)[checkRows[i][0]]] == board[Object.keys(board)[checkRows[i][1]]]) {
        if (board[Object.keys(board)[checkRows[i][0]]] == xO) {
          if (board[Object.keys(board)[checkRows[i][1]]] == xO) {
            if (board[Object.keys(board)[checkRows[i][2]]] == "") {
              playersChoice(checkRows[i][2], getComputer());
              found = true;
              break;
            }
          }
        }
      } //end of top if                                                       
    } //forloop ending
  }
  if (!found) {

    for (var i = 0; i < 8; i++) {
      if (board[Object.keys(board)[checkRows[i][0]]] == board[Object.keys(board)[checkRows[i][2]]]) {
        if (board[Object.keys(board)[checkRows[i][0]]] == xO) {
          if (board[Object.keys(board)[checkRows[i][2]]] == xO) {
            if (board[Object.keys(board)[checkRows[i][1]]] == "") {
              playersChoice(checkRows[i][1], getComputer());
              found = true;
              break;
            }
          }
        }
      } //end of top if                                                       
    } //forloop ending
  }
  if (!found) {
    for (var i = 0; i < 8; i++) {
      if (board[Object.keys(board)[checkRows[i][1]]] == board[Object.keys(board)[checkRows[i][2]]]) {
        if (board[Object.keys(board)[checkRows[i][2]]] == xO) {
          if (board[Object.keys(board)[checkRows[i][1]]] == xO) {
            if (board[Object.keys(board)[checkRows[i][0]]] == "") {
              playersChoice(checkRows[i][0], getComputer());
              found = true;
              break;
            }
          }
        }
      } //end of top if                                                       
    } //forloop ending
  }
  return found;
} //end of function

function setAdvantage() {
  console.log("setAdvantage was fired!");
  
  if(board.a1 == getPlayer() && board.c3 == getPlayer()){
    
    playersChoice(1, getComputer());
    
  } else if (board.c1 == getPlayer() && board.a3 == getPlayer()) {
    
    playersChoice(7, getComputer());
    
  } else if (checkForEmpty(board.b2)) {

    playersChoice(4, getComputer());

  } else if (checkForEmpty(board.a3)) {

    playersChoice(2, getComputer());

  } else if (checkForEmpty(board.a1)) {

    playersChoice(0, getComputer());

  } else if (checkForEmpty(board.c1)) {

    playersChoice(6, getComputer());

  } else if (checkForEmpty(board.c2)) {

    playersChoice(7, getComputer());

  } else if (checkForEmpty(board.a2)) {

    playersChoice(1, getComputer());

  } else if (checkForEmpty(board.b1)) {

    playersChoice(3, getComputer())

  } else if (checkForEmpty(board.b3)) {

    playersChoice(5, getComputer());

  } else if (checkForEmpty(board.c1)) {

    playersChoice(6, getComputer());

  } else if (checkforEmpty(board.c3)) {

    playersChoice(8, getComputer());

  }

}

function aiMove() {
  console.log("aiMove was fired!")
  var move = false;
  if (!move) {
    var xO = getComputer();
    move = winOrBlock(xO);

  }
  if (!move) {
    var xO = getPlayer();
    move = winOrBlock(xO);
  }
  if (!move) {
    setAdvantage();
  }
}

// actions**************************************

$("#playX").click(function() {
  playerPicked("#playX")
});

$("#playO").click(function() {
  playerPicked("#playO");
});

// $('#reset').click(function() {
//   resetBoard();
// });

$('#a1').click(function() {

  if (playerPickedLetter() && checkForTaken(0)) {   // todo: if(playerPickedLetter() && <<new function here>>()){} --> add a new function that uses the helper function checkForEmpty and remove alert form playerChoice
    playersChoice(0, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }

});

$('#a2').click(function() {

  if (playerPickedLetter() && checkForTaken(1)) {
    playersChoice(1, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }

});

$('#a3').click(function() {

  if (playerPickedLetter() && checkForTaken(2)) {
    playersChoice(2,getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});

$('#b1').click(function() {
  if (playerPickedLetter() && checkForTaken(3)) {
    playersChoice(3, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});

$('#b2').click(function() {
  if (playerPickedLetter() && checkForTaken(4)) {
    playersChoice(4, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});

$('#b3').click(function() {
  if (playerPickedLetter() && checkForTaken(5)) {
    playersChoice(5, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});

$('#c1').click(function() {
  if (playerPickedLetter() && checkForTaken(6)) {
    playersChoice(6, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});

$('#c2').click(function() {
  if (playerPickedLetter() && checkForTaken(7)) {
    playersChoice(7, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});

$('#c3').click(function() {
  if (playerPickedLetter() && checkForTaken(8)) {
    playersChoice(8, getPlayer());
    if(checkForWin(1)){
        aiMove();
        checkForWin(1);
    }
  }
});