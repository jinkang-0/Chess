// possible pawn moves
function posPawn(id, moves, always) {

  let side = document.getElementById(id).firstChild.classList[2];

  // possible move and capture
  let col = alphabet( id.slice(0, 1) );
  let row = parseInt( id.slice(1, 2) );

  if (side == "white") {

    // possible capture
    let pos1 = document.getElementById(`${alphabet(col-1)}${row+1}`);
    let pos2 = document.getElementById(`${alphabet(col+1)}${row+1}`);
    if ((pos1 && pos1.innerHTML) || always) checkPos(id, side, -1, 1, moves, always);
    if ((pos2 && pos2.innerHTML) || always) checkPos(id, side, 1, 1, moves, always);

    if (!always) checkPos(id, side, 0, 1, moves, false, true);

  } else if (side == "black") {

    // possible capture
    let pos1 = document.getElementById(`${alphabet(col-1)}${row-1}`);
    let pos2 = document.getElementById(`${alphabet(col+1)}${row-1}`);
    if ((pos1 && pos1.innerHTML) || always) checkPos(id, side, -1, -1, moves, always);
    if ((pos2 && pos2.innerHTML) || always) checkPos(id, side, 1, -1, moves, always);
    
    if (!always) checkPos(id, side, 0, -1, moves, false, true);

  }

  // possible jump if unmoved

  if (!always) {
    if (row == 2 && side == "white") {
      checkPos(id, side, 0, 2, moves, false, true);
    } else if (row == 7 && side == "black") {
      checkPos(id, side, 0, -2, moves, false, true);
    }
  }

}

// shows possible rook moves
function posRook(id, moves, force) {

  let side = document.getElementById(id).firstChild.classList[2];

  ray(id, -1, 0, moves, side, force);
  ray(id, 1, 0, moves, side, force);
  ray(id, 0, 1, moves, side, force);
  ray(id, 0, -1, moves, side, force);

}

// shows possible bishop moves
function posBishop(id, moves, force) {

  let side = document.getElementById(id).firstChild.classList[2];

  ray(id, 1, 1, moves, side, force);
  ray(id, 1, -1, moves, side, force);
  ray(id, -1, 1, moves, side, force);
  ray(id, -1, -1, moves, side, force);

}

// shows possible knight moves
function posKnight(id, moves, always) {

  let side = document.getElementById(id).firstChild.classList[2];

  checkPos(id, side, 1, 2, moves, always);
  checkPos(id, side, -1, 2, moves, always);
  checkPos(id, side, 1, -2, moves, always);
  checkPos(id, side, -1, -2, moves, always);
  checkPos(id, side, 2, 1, moves, always);
  checkPos(id, side, 2, -1, moves, always);
  checkPos(id, side, -2, 1, moves, always);
  checkPos(id, side, -2, -1, moves, always);

}

// shows possible queen moves
function posQueen(id, moves, force) {

  let side = document.getElementById(id).firstChild.classList[2];

  // straight lines
  ray(id, -1, 0, moves, side, force);
  ray(id, 1, 0, moves, side, force);
  ray(id, 0, 1, moves, side, force);
  ray(id, 0, -1, moves, side, force);

  // diagonals
  ray(id, 1, 1, moves, side, force);
  ray(id, 1, -1, moves, side, force);
  ray(id, -1, 1, moves, side, force);
  ray(id, -1, -1, moves, side, force);

}

function posKing(id, moves, posThreat) {
  
  let side = document.getElementById(id).firstChild.classList[2];

  // get king's moves
  checkPos(id, side, 1, 0, moves);
  checkPos(id, side, -1, 0, moves);
  checkPos(id, side, 0, 1, moves);
  checkPos(id, side, 0, -1, moves);
  checkPos(id, side, 1, 1, moves);
  checkPos(id, side, 1, -1, moves);
  checkPos(id, side, -1, 1, moves);
  checkPos(id, side, -1, -1, moves);

  if (posThreat) {

    // remove dangerous moves
    moves = moves.filter(function(val) {
      return posThreat.indexOf(val) == -1;
    });

  }

  return moves;

}



function checkThreat(side) {

  let opponents;
  let posThreat = [];

  if (side == "white") {
    opponents = document.getElementsByClassName("black");
  } else if (side == "black") {
    opponents = document.getElementsByClassName("white");
  }

  for (var i = 0; i < opponents.length; i++) {
    posThreat = Array.prototype.concat.apply( posThreat, checkMove( opponents[i].parentElement.id, false ) );
  }

  for (var x = 0; x < posThreat.length; x++) {
    if (posThreat[x].firstChild && posThreat[x].firstChild.classList.contains("fa-chess-king") && posThreat[x].firstChild.classList.contains(side)) {
      
      inCheck = side;
      let moves = [];

      // mark King as threatened
      posThreat[x].classList.add("threatened");

      // check for escape routes
      posKing(posThreat[x].id, moves, posThreat);

      // if there is no escape, return undefined to checkmate
      if (moves.length == 0) {
        return undefined;
      }
    }
  }

  return posThreat;

}



// manages moving the pieces
function moveTo(id) {

  let start = document.getElementById(selected);
  let destination = document.getElementById(id);
  let capture;

  // if destination has a piece, capture it
  if (destination.innerHTML) {
    let captive = destination.firstChild.classList;
    let cSide = captive[2].slice(0,1).toUpperCase();
    let cType = `${captive[1].slice(9,10).toUpperCase()}${captive[1].slice(10)}`;

    captive.remove(captive[2]);
    captive.remove(captive[1]);

    capture = `${cType} (${cSide})`;

  } else {
    // else, create a blank to clone
    destination.innerHTML = '<i class="fas"></i>';
  }

  let piece = start.firstChild.classList;
  let clone = destination.firstChild.classList;
  let sType = `${piece[1].slice(9,10).toUpperCase()}${piece[1].slice(10)}`;
  let sSide = piece[2].slice(0,1).toUpperCase();

  clone.add(piece[1]);
  clone.add(piece[2]);

  // remove threatened highlight
  if (piece[1] == "fa-chess-king" && inCheck != "") {
    start.classList.remove("threatened");
    inCheck = "";
  }

  // display new action
  addAction(`${sType} (${sSide}): ${selected} -> ${id}`, "p");
  if (capture) addAction(` - Captured ${capture}`, "span");

  // hide possible moves
  hideMoves();

  // promote if pawn reaches end
  if (piece[1] == "fa-chess-pawn" && ( (sSide == "B" && id.slice(1,2) == "1") || (sSide == "W" && id.slice(1,2) == "8") )) {
    promotion(id);
  }

  // remove start piece
  start.innerHTML = "";

  // next turn
  if (turn == "white") {
    turn = "black";
  } else if (turn == "black") {
    turn = "white";
  }

  if (turn.slice(0,1) != "p") { 

    document.getElementById("turn").innerHTML = `${turn.slice(0,1).toUpperCase()}${turn.slice(1)}'s Turn`;

    // if king is in check and there is no escape, checkmate
    let posThreat = checkThreat(turn);

    if ( posThreat == undefined ) {
      inCheck = "end";
      checkmate(turn, posThreat);
    }

  }

}