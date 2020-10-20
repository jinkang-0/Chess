// setup variables
var selected;
var inCheck = false;
var moveable = [];
var turn = 'white';

// setup board
const board = new Board();
board.initalize();

for (let piece of board.pieces) {
  piece.checkMoves();
  piece.show();
}

// when mouse is down, clear all highlights
window.addEventListener('mousedown', (event) => {

  // ignore grids and piece icons
  const parent = event.originalTarget.parentElement.classList;
  if (parent.contains("board") || parent.contains("dark") || parent.contains("silver")) {
    return;
  }
  
  removeHighlights();

});

// game functions
function checkGrid(id) {

  // get grid row and column
  const row = id.slice(1, 2);
  const col = id.slice(0, 1);

  // determine if grid is highlighted
  const grid = document.getElementById(id);
  const marked = document.querySelectorAll('.highlight');
  let target;
  for (let mark of marked) {
    if (mark === grid) {
      target = mark;
      break;
    }
  }
  
  // if it is, move the piece to current grid,
  // remove all highlights, switch sides, then update moves
  if (target) {
    selected.move(row, col);

    // update pieces' possible moves
    for (let piece of board.pieces) {
      piece.checkMoves();
    }
    
    // update king moves again to prevent mistakes in checking dangers
    const kings = board.pieces.filter(p => p.type == 'king');
    for (let king of kings) {
      king.checkMoves();
    }      

    // determine if the next turn side will be in check/checkmate
    const oppSide = (selected.color == 'black') ? 'white' : 'black';
    determineCheck(oppSide);

    // remove highlights and selected
    selected = undefined;
    removeHighlights();
    return;
  }

  // if grid is not highlighted, remove all highlights
  removeHighlights();

  // find if grid contains a piece (that can be played)
  let available = board.pieces.filter(p => p.color == turn);
  if (inCheck) available = available.filter(p => moveable.includes(p));
  const piece = available.find(p => p.row == row && p.col == col);

  if (piece) {

    // find opponent pieces and king on the side of this piece
    const oppSide = board.pieces.filter(p => p.color != piece.color);
    const king = board.pieces.find(p => p.type == 'king' && p.color == piece.color);

    // stop if moving this piece will cause the king to be in check
    if (king != piece) {
      for (let opp of oppSide) {
        const kingThreat = opp.threats.find(t => t.col == king.col && t.row == king.row && t.level == 2);
        const pieceThreat = opp.threats.find(t => t.col == piece.col && t.row == piece.row && t.level == 0);
        if (kingThreat != undefined && pieceThreat != undefined) return;
      }
    }

    // select this piece
    selected = piece;
  
    // highlight possible moves
    for (let move of piece.moves) {
      document.getElementById(`${move[0]}${move[1]}`).classList.add('highlight');
    }

  }

}

// determines if a side is in check
function determineCheck(side) {
  
  // decalre variables
  const oppColor = (side == "black") ? "white" : "black";
  const king = board.pieces.find(p => p.type == "king" && p.color == side);
  const sidePieces = board.pieces.filter(p => p.color == side && p.type != 'king');
  const oppPieces = board.pieces.filter(p => p.color == oppColor);

  // assume it is not in check and there will be no pieces that can move in check
  let check = false;
  moveable = [];

  // finds any moves that threatens the King
  for (let enemy of oppPieces) {
    let threatening = enemy.moves.find(e => e[0] == king.col && e == king.row );

    // if there exists such a move, find if this threat can be removed
    if (threatening) {

      // check if the threaten(er) can be captured
      for (let soldier of sidePieces) {
        const breaker = soldier.moves.find(s => s[0] == enemy.col && s[1] == enemy.row);
        if (breaker) {
          opponent.moves = [breaker];
          moveable.push(soldier);
        }
      }

      // check if the king can escape
      if (oppKing.moves.length > 0) moveable.push(oppKing);

      // if no units can be moved, it's a checkmate!
      if (moveable.length == 0) {
        console.log('checkmate!');
      }

      check = true;
      break;
    }
  }

  return check;
}