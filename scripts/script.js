/**
 * 
 * This script deals with the main mechanics and
 * determining checks/checkmates
 * 
 */

// setup variables
var selected;
var selectedCell;
var promoPawn;
var inCheck = false;
var moveable = [];

var wScore = 0;
var bScore = 0;

// setup board
const board = new Board();
board.initalize();

for (let piece of board.pieces) {
  piece.show();
}

// when mouse is down, clear all highlights
window.addEventListener('mousedown', (event) => {

  // ignore grids and piece icons
  if (event.originalTarget == undefined) return;
  const parent = event.originalTarget.parentElement.classList;
  if (parent.contains("board") || parent.contains("dark") || parent.contains("silver")) {
    return;
  }
  
  removeHighlights();

});

// main game mechanics, runs when mouse clicks on a grid
function checkGrid(id) {

  // remove selected grid
  if (selectedCell) {
    selectedCell.classList.remove('selected');
    selectedCell = undefined;
  }

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
    const promoting = selected.move(row, col);
    if (promoting) {
      showPromo(selected);
      removeHighlights();
      return;
    }

    moveHandler();
    removeHighlights();
    return;
  }

  // if grid is not highlighted, remove all highlights
  removeHighlights();

  // find if grid contains a piece (that can be played)
  let available = board.pieces.filter(p => p.color == board.turn);
  if (inCheck) available = available.filter(p => moveable.includes(p));
  const piece = available.find(p => p.row == row && p.col == col);

  if (piece) {

    // find opponent pieces and king on the side of this piece
    const oppSide = board.pieces.filter(p => p.color != piece.color && p.type != 'king' && p.type != 'knight' && p.type != 'pawn');
    const king = board.pieces.find(p => p.type == 'king' && p.color == piece.color);

    // stop if moving this piece will cause the king to be in check
    if (king != piece) {
      for (let opp of oppSide) {
        const kingThreat = opp.threats.find(t => t.col == king.col && t.row == king.row && t.level == 2);
        const pieceThreat = opp.threats.find(t => t.col == piece.col && t.row == piece.row && t.level == 0);
        
        if (kingThreat && pieceThreat) {
          // if there are no moves, cut execution early
          if ( !altCheck(piece, opp) ) return;
          break;
        }
      }
    }

    // select this piece
    selected = piece;
    selectedCell = document.getElementById(`${piece.col}${piece.row}`);
    selectedCell.classList.add('selected');
    
    // highlight possible moves
    for (let move of piece.moves) {
      document.getElementById(`${move[0]}${move[1]}`).classList.add('highlight');
    }

  }

}


// finds moves that won't put king in check
// returns true if it can move, false otherwise
function altCheck(piece, opp) {

  // knights cannot move in response to a threat
  if (piece.type == 'knight') return false;

  const king = board.pieces.find(p => p.type == 'king' && p.color == piece.color);

  // check horizontally, vertically, or diagonally
  if (king.row == piece.row) { piece.moves = piece.moves.filter(m => m[1] == piece.row); } 
  else if (king.col == piece.col) { piece.moves = piece.moves.filter(m => m[0] == piece.col); } 
  else {
    // if it is not a straight diagonal, there is no danger
    const dy = king.row - piece.row;
    const dx = toNumber(king.col) - toNumber(piece.col);
    const slope = Math.abs(dy / dx);
    if (slope != 1) return true;

    // rooks cannot respond to a diagonal threat
    if (piece.type == 'rook') return false;

    const pCol = toNumber(piece.col);
    const oCol = toNumber(opp.col);

    // finds safe moves for the piece (in between attack or attacker itself)
    piece.moves = piece.moves.filter(m => {
      if (m[0] == opp.col && m[1] == opp.row) return true;
      const included = opp.moves.includes(m);
      const mCol = toNumber(m[0]);
      const vrDiff = (opp.row > piece.row) ? (m[1] < opp.row && m[1] > piece.row) : (m[1] > opp.row && m[1] < piece.row);
      const hrDiff = (oCol < pCol) ? (mCol < pCol && mCol > oCol) : (mCol > pCol && mCol < oCol);
      return included && hrDiff && vrDiff;
    });
  }

  // if the piece has no moves left, show it cannot move
  if (piece.moves.length > 0) {
    return true;
  } else {
    const grid = document.getElementById(`${opp.col}${opp.row}`);
    if (!grid.classList.contains('danger')) {
      grid.classList.add('danger');
      setTimeout( () => {
        grid.classList.remove('danger');
      }, 1000);
    }
    return;
  }
}

// updates possible moves after a piece moves
function moveHandler() {

  // update pieces' possible moves
  board.refreshMoveSet();   

  // determine if the next turn side will be in check/checkmate
  const oppSide = (selected.color == 'black') ? 'white' : 'black';
  board.nextTurn();
  inCheck = determineCheck(oppSide);

  // if check, log action
  if (inCheck) {
    const king = board.pieces.find(p => p.type == 'king' && p.color == oppSide);
    logAction(selected, king, 'threaten');
  }

  // remove highlights and selected
  selected = undefined;

}

// determines if a side is in check
function determineCheck(side) {

  // remove cells that were in check
  const threatenedCell = document.querySelector('.threatened');
  if (threatenedCell) threatenedCell.classList.remove('threatened');
  
  // declare variables
  const oppColor = (side == "black") ? "white" : "black";
  const king = board.pieces.find(p => p.type == "king" && p.color == side);
  const sidePieces = board.pieces.filter(p => p.color == side && p.type != 'king');
  const oppPieces = board.pieces.filter(p => p.color == oppColor);

  // assume it is not in check and there will be no pieces that can move in check
  let check = false;
  moveable = [];

  // finds any moves that directly threatens the King
  for (let enemy of oppPieces) {
    let threatening = enemy.moves.find(m => m[0] == king.col && m[1] == king.row );
    
    // if there exists such a move, find if this threat can be removed
    if (threatening) {

      // check if the threaten(er) can be captured
      // or if the threat can be blocked
      for (let soldier of sidePieces) {
        const breaker = soldier.moves.find(s => s[0] == enemy.col && s[1] == enemy.row);
        if (breaker) {
          soldier.moves = [breaker];
          moveable.push(soldier);

        // if enemy moves in a line, find if it can be blocked
        } else if (enemy.type == 'rook' || enemy.type == 'bishop' || enemy.type == 'queen') {
          if (enemy.col == king.col) {
            // vertical
            soldier.moves = soldier.moves.filter(m => {
              const included = enemy.moves.includes(m);
              const between = (king.row < enemy.row) ? (m.row < enemy.row && m.row > king.row) : (m.row > enemy.row && m.row < king.row);
              return included && between;
            });
          } else if (enemy.row == king.row) {
            // horizontal
            const kCol = toNumber(king.col);
            const eCol = toNumber(enemy.col);
            soldier.moves = soldier.moves.filter(m => {
              const included = enemy.moves.includes(m);
              const mCol = toNumber(m[0]);
              const between = (kCol < eCol) ? (mCol > kCol && mCol < eCol) : (mCol < kCol && mCol > eCol);
              return included && between;
            });
          } else {
            // diagonal
            const kCol = toNumber(king.col);
            const eCol = toNumber(enemy.col);
            soldier.moves = soldier.moves.filter(m => {
              const included = enemy.moves.includes(m);
              const mCol = toNumber(m[0]);
              const yDiff = (kCol < eCol) ? (mCol > kCol && mCol < eCol) : (mCol < kCol && mCol > eCol);
              const xDiff = (king.row < enemy.row) ? (m[1] < enemy.row && m[1] > king.row) : (m[1] > enemy.row && m[1] < king.row);
              return included && xDiff & yDiff;
            })
          }
          if (soldier.moves.length > 0) moveable.push(soldier);
        }
      }

      // check if the king can escape
      if (king.moves.length > 0) moveable.push(king);

      // if no units can be moved, it's a checkmate!
      if (moveable.length == 0) {
        checkmate(oppColor);
        break;
      }

      // if it reaches this point, the king is in check
      document.getElementById(`${king.col}${king.row}`).classList.add('threatened');
      check = true;
      break;
    }
  }

  return check;
}

// handles pawn promotion
function promote(type) {

  // animation and promotion
  const clone = new Piece(undefined, undefined, promoPawn.type, promoPawn.color);
  promoPawn.type = type;
  animatePromotion();
  logAction(clone, promoPawn, 'promote');

  // update possible moves
  moveHandler();

  // hide promotion screen
  const screen = document.getElementById('pawn-promo');
  screen.className = 'hidden';

}

// restarts the game
function restart() {

  // remove all icons on the board
  const silverGrids = document.getElementsByClassName('silver');
  const darkGrids = document.getElementsByClassName('dark');
  for (let g of silverGrids) {
    const child = g.firstChild;
    if (child) g.removeChild(child);
  }
  for (let g of darkGrids) {
    const child = g.firstChild;
    if (child) g.removeChild(child);
  }

  // remove all logs
  const logs = document.querySelector('.inner-sidebar');
  removeChildren(logs);

  // reset variables
  selected = undefined;
  selectedCell = undefined;
  promoPawn = undefined;
  inCheck = false;
  moveable = [];

  // remove checkmate screen
  document.getElementById('end-screen').className = 'hidden';
  document.getElementById('w-stat').className = 'stats';
  document.getElementById('b-stat').className = 'stats';
  document.getElementById('restart-button').classList.remove('shown');

  // reinitialize board
  board.initalize();
  for (let piece of board.pieces) {
    piece.show();
  }

}