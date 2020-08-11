var whiteScore = 0;
var blackScore = 0;

var selected = "";
var inCheck = "";
var turn = "white";

function checkSquare(id) {
  let square = document.getElementById(id);

  // manages different click events
  if (square.classList.contains("pos")) {
    moveTo(id);
  } else if (inCheck == "" && square.innerHTML && square.firstChild.classList.contains(turn)) {
    checkMove(id, true);
  } else if (inCheck != "end" && square.firstChild && square.firstChild.classList.contains("fa-chess-king")) {
    checkMove(id, true);
  } else {
    hideMoves();
  }
}

function checkMove(id, show) {

  let classes = document.getElementById(id).firstChild.classList;
  let moves = [];

  if (classes.contains("fa-chess-pawn")) {
    posPawn(id, moves, !show);
  } else if (classes.contains("fa-chess-rook")) {
    posRook(id, moves, !show);
  } else if (classes.contains("fa-chess-knight")) {
    posKnight(id, moves, !show);
  } else if (classes.contains("fa-chess-bishop")) {
    posBishop(id, moves, !show);
  } else if (classes.contains("fa-chess-queen")) {
    posQueen(id, moves, !show);
  } else if (classes.contains("fa-chess-king")) {
    moves = posKing(id, moves);
  }

  if (show) {
    showMoves(id, moves);
  } else {
    return moves;
  }

}

// add new text to action log
function addAction(str, type) {

  let box = document.getElementById("actions");

  let action = document.createElement(type);
  action.innerHTML = str;

  box.insertAdjacentElement("beforeend", action);
  box.scrollTop = box.scrollHeight;

}

// promote pawn
function promotion(id) {

  let side = document.getElementById(id).firstChild.classList[2];
  turn = `paused:${turn}`;
  selected = id;

  document.getElementById("turn").innerHTML = "Promotion";

  document.getElementById("promote").style.display = "flex";
  document.getElementById("promote").classList.add(side);

}

function promote(type) {

  let replacing = document.getElementById(selected).firstChild.classList;
  let promote = document.getElementById("promote");

  addAction(`${replacing[1].slice(9,10).toUpperCase()}${replacing[1].slice(10)} (${promote.classList[0].slice(0,1).toUpperCase()}) => ${type.slice(0,1).toUpperCase()}${type.slice(1)}`, "p");

  replacing.replace("fa-chess-pawn", `fa-chess-${type}`);

  promote.style.display = "none";
  promote.classList.remove("black");
  promote.classList.remove("white");

  selected = "";
  turn = turn.slice(7);

  document.getElementById("turn").innerHTML = `${turn.slice(0,1).toUpperCase()}${turn.slice(1)}'s Turn`;

}

// end the game
function checkmate(side, position) {

  document.getElementById("turn").innerHTML = `Checkmate!<br>${side.slice(0,1).toUpperCase()}${side.slice(1)} Won!`;
  position.classList.remove("threatened");

  if (side == "black") {
    blackScore++;
  } else if (side == "white") {
    whiteScore++;
  }

  document.getElementById("white-score").innerHTML = whiteScore;
  document.getElementById("black-score").innerHTML = blackScore;

}

// restart
function restart() {

  selected = "";
  inCheck = "";
  turn = "white";

  // set turn message
  document.getElementById("turn").innerHTML = `${turn.slice(0,1).toUpperCase()}${turn.slice(1)}'s Turn`;

  // clear action log
  document.getElementById("actions").innerHTML = "";

  // clear rows 3-6
  for (i = 3; i < 7; i++) {
    for (x = 1; x < 9; x++) {
      document.getElementById(`${alphabet(x)}${i}`).innerHTML = "";
    }
  }

  // row 8
  document.getElementById("A8").innerHTML = '<i class="fas fa-chess-rook black"></i>';
  document.getElementById("B8").innerHTML = '<i class="fas fa-chess-knight black"></i>';
  document.getElementById("C8").innerHTML = '<i class="fas fa-chess-bishop black"></i>';
  document.getElementById("D8").innerHTML = '<i class="fas fa-chess-queen black"></i>';
  document.getElementById("E8").innerHTML = '<i class="fas fa-chess-king black"></i>';
  document.getElementById("F8").innerHTML = '<i class="fas fa-chess-bishop black"></i>';
  document.getElementById("G8").innerHTML = '<i class="fas fa-chess-knight black"></i>';
  document.getElementById("H8").innerHTML = '<i class="fas fa-chess-rook black"></i>';

  // row 7
  document.getElementById("A7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("B7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("C7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("D7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("E7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("F7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("G7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'
  document.getElementById("H7").innerHTML = '<i class="fas fa-chess-pawn black"></i>'

  // row 2
  document.getElementById("A2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("B2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("C2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("D2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("E2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("F2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("G2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'
  document.getElementById("H2").innerHTML = '<i class="fas fa-chess-pawn white"></i>'

  // row 1
  document.getElementById("A1").innerHTML = '<i class="fas fa-chess-rook white"></i>';
  document.getElementById("B1").innerHTML = '<i class="fas fa-chess-knight white"></i>';
  document.getElementById("C1").innerHTML = '<i class="fas fa-chess-bishop white"></i>';
  document.getElementById("D1").innerHTML = '<i class="fas fa-chess-queen white"></i>';
  document.getElementById("E1").innerHTML = '<i class="fas fa-chess-king white"></i>';
  document.getElementById("F1").innerHTML = '<i class="fas fa-chess-bishop white"></i>';
  document.getElementById("G1").innerHTML = '<i class="fas fa-chess-knight white"></i>';
  document.getElementById("H1").innerHTML = '<i class="fas fa-chess-rook white"></i>';

}