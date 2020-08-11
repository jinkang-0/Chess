// check one specific square
function checkPos(id, side, xOff, yOff, moves, always, moveOnly) {

  // checking opposite side
  let opp = getOpp(side);

  // checking square
  let nCol = alphabet( alphabet( id.slice(0, 1) ) + xOff );
  let nRow = parseInt( id.slice(1, 2) ) + yOff;

  // if out of bounds
  if (nRow > 8 || nRow < 1 || nCol == undefined) {
    return "out";
  }

  let pos = document.getElementById(`${nCol}${nRow}`);

  // add to possible move list
  if ( always || pos.innerHTML == "" || !moveOnly && ( pos.firstChild && pos.firstChild.classList.contains(opp) ) ) {
    moves.push(pos);
  }

}

// checks in one continuous direction of the board
function ray(id, xOff, yOff, moves, side, force) {

  let col = id.slice(0, 1);
  let row = parseInt( id.slice(1, 2) );
  let opp = getOpp(side);

  let nCol = col;
  let nRow = row;
  let pos;

  // check in x-axis
  if (xOff < 0) {
    switch(col) {
      case "A":
        return moves;
      default:
        nCol = alphabet( alphabet(col) - 1);
    }
  } else if (xOff > 0) {
    switch(col) {
      case "H":
        return moves;
      default:
        nCol = alphabet( alphabet(col) + 1);
    }
  }

  // check in y-axis
  if (yOff > 0) {
    switch(row) {
      case 8:
        return moves;
      default:
        nRow = row + 1;
    }
  } else if (yOff < 0) {
    switch(row) {
      case 1:
        return moves;
      default:
        nRow = row - 1;
    }
  }

  // check new position
  pos = document.getElementById(`${nCol}${nRow}`);

  // if forced, 
  if (force) {
    
    let current = document.getElementById(id);

    // stop at first friendly unit
    if ( pos.firstChild && pos.firstChild.classList[2] == side  ) {
      moves.push(pos);
      return moves;
    }
    
    // stop at first enemy unit and continue one more if it is the king
    if ( pos.firstChild && pos.firstChild.classList[2] == opp ) {
      moves.push(pos);
      if (pos.firstChild.classList[1] == "fa-chess-king") checkPos(pos.id, side, xOff, yOff, moves, true);
      return moves;
    }
  
  }

  // if possible capture, add to list and stop ray
  if (pos.firstChild && pos.firstChild.classList.contains(opp)) {
    moves.push(pos);
    return moves;
  }

  // if empty, continue
  if (pos.innerHTML == "") {
    moves.push(pos);
    if (nCol != "A" || nCol != "H" || nRow != 1 || nRow != 8) {
      ray(`${nCol}${nRow}`, xOff, yOff, moves, side, force);
    }
  }

}

// counting columns
function alphabet(input) {
  let letters = {
    "A": 1,
    "B": 2,
    "C": 3,
    "D": 4,
    "E": 5,
    "F": 6,
    "G": 7,
    "H": 8
  }

  let numbers = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H"
  }

  if (typeof input == "number") {
    return numbers[input];
  } else if (typeof input == "string") {
    return letters[input];
  }
}

// manages displaying possible moves
function showMoves(id, moves) {
  selected = id;

  // remove shown moves
  let pos = document.getElementsByClassName("pos");
  let len = pos.length;
  
  for (i = 0; i < len; i++) {
    pos[0].classList.remove("pos");
  }

  // show possible moves
  for (var x = 0; x < moves.length; x++) {
    moves[x].classList.add("pos");
  }

}

function hideMoves() {
  
  selected = "";

  let pos = document.getElementsByClassName("pos");
  let len = pos.length;
  
  for (i = 0; i < len; i++) {
    pos[0].classList.remove("pos");
  }
  
}

function outOfBoard() {

  let target = event.target;

  if (target.classList.contains("main")) {
    hideMoves();
  }

}

// get opposite side

function getOpp(side) {

  if (side == "black") {
    return "white";
  } else if (side == "white") {
    return "black";
  } else {
    return null;
  }

}