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

  // unless it's in the grid, remove highlights
  const parent = event.target.parentElement.classList;
  if (parent.contains("board") || parent.contains("dark") || parent.contains("silver")) {
    return;
  }
  
  removeHighlights();

});

// main game mechanics, runs when mouse clicks on a grid
function checkGrid(id) {

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
  
  // if it is, move the piece to current grid
  if (target) {
    const promoting = selected.move(id);
    (promoting) ? showPromo(selected) : moveHandler();
    
    removeHighlights();
    return;
  // if not, find if it is a special move
  } else {
    const specials = document.querySelectorAll('.special');
    if (specials) {
      for (let sp of specials) {
        target = (sp === grid) ? sp : undefined;
        if (target) {
          const type = (sp.classList.contains('castling')) ? 'castling' : 'enpassant';
          const specialMove = selected.specials.find(s => s.type == type && s.to == sp.id);
          const link = board.pieces.find(p => p.id == specialMove.link);
          
          if (specialMove.effect == 'move') {
            link.move(specialMove.linkto);
          } else if (specialMove.effect == 'capture') {
            selected.capture(link);
          }
          
          selected.move(id);

          moveHandler();
          removeHighlights();
          return;
        }
      }
    }
  }

  // if grid is not highlighted, remove all highlights
  removeHighlights();

  // find if the selected grid contains a piece (that can be played)
  let available = board.pieces.filter(p => p.color == board.turn);
  if (inCheck) available = available.filter(p => moveable.includes(p));
  const piece = available.find(p => p.id == id);

  // if it exists:
  if (piece) {

    // find opponent pieces and king on the side of this piece
    const oppSide = board.pieces.filter(p => p.color != piece.color && p.type != 'king' && p.type != 'knight' && p.type != 'pawn');
    const king = board.pieces.find(p => p.type == 'king' && p.color == piece.color);

    // investigate if moving this piece will cause the king to be in check
    if (king != piece) {
      for (let opp of oppSide) {
        const kingThreat = opp.threats.find(t => t.id == king.id && t.level == 2);
        const pieceThreat = opp.threats.find(t => t.id == piece.id && t.level == 0);
        // if it will, reduce its moves s.t. they won't cause the king to be in check
        // if it has no safe moves, stop execution early
        if (kingThreat && pieceThreat) {
          if ( !altCheck(piece, opp) ) return;
          break;
        }
      }
    }

    // select this piece
    selected = piece;
    selectedCell = document.getElementById(piece.id);
    selectedCell.classList.add('selected');
    
    // highlight possible moves
    for (let move of piece.moveset) {
      document.getElementById(move).classList.add('highlight');
    }

    // show specials
    for (let sp of piece.specials) {
      const spEffect = document.getElementById(sp.to).classList;
      spEffect.add('special');
      spEffect.add(sp.type);
      spEffect.add(piece.color);
      spEffect.add(sp.linkdir);
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
  if (king.row == piece.row) { piece.moveset = piece.moveset.filter(m => m[1] == piece.id[1]); } 
  else if (king.col == piece.col) { piece.moveset = piece.moveset.filter(m => m[0] == piece.id[0]); } 
  else {
    // if it is not a straight diagonal, there is no danger
    const dy = king.row - piece.row;
    const dx = king.col - piece.col;
    const slope = Math.abs(dy / dx);
    if (slope != 1) return true;

    // rooks cannot respond to a diagonal threat
    if (piece.type == 'rook') return false;

    // finds safe moves for the piece (in between attack or attacker itself)
    const pCol = piece.col;
    const oCol = opp.col;
    piece.moveset = piece.moveset.filter(m => {
      if (m == opp.id) return true;
      const included = opp.moveset.includes(m);
      const mCol = toNumber(m[0]);
      const vrDiff = (opp.row > piece.row) ? (m[1] < opp.row && m[1] > piece.row) : (m[1] > opp.row && m[1] < piece.row);
      const hrDiff = (oCol < pCol) ? (mCol < pCol && mCol > oCol) : (mCol > pCol && mCol < oCol);
      return included && hrDiff && vrDiff;
    });
  }

  // if the piece has no moves left, show it cannot move
  if (piece.moveset.length > 0) {
    return true;
  } else {
    const grid = document.getElementById(opp.id);
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
  board.nextTurn();
  board.refreshMoveset();

  // determine if the next turn side will be in check/checkmate
  const oppSide = (selected.color == 'black') ? 'white' : 'black';

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
    let threatening = enemy.moveset.find(m => m == king.id);
    if (threatening == undefined) continue;

    // if threat exists, find if it can be intervened
    for (let soldier of sidePieces) {

      let reduced = [];

      // find if enemy can be captured
      const breaker = soldier.moveset.find(s => s[0] == enemy.col && s[1] == enemy.row);
      if (breaker) reduced = [breaker];

      // if enemy moves in a line, find any moves 
      if (enemy.type == 'rook' || enemy.type == 'bishop' || enemy.type == 'queen') {
        if (enemy.col == king.col) {
          // vertical
          reduced = [...reduced, ...soldier.moveset.filter(m => {
            const included = enemy.moveset.includes(m);
            const between = (king.row < enemy.row) ? (m.row < enemy.row && m.row > king.row) : (m.row > enemy.row && m.row < king.row);
            return included && between;
          })];
        } else if (enemy.row == king.row) {
          // horizontal
          const kCol = king.col;
          const eCol = enemy.col;
          reduced = [...reduced, ...soldier.moveset.filter(m => {
            const included = enemy.moveset.includes(m);
            const mCol = toNumber(m[0]);
            const between = (kCol < eCol) ? (mCol > kCol && mCol < eCol) : (mCol < kCol && mCol > eCol);
            return included && between;
          })];
        } else {
          // diagonal
          const kCol = king.col;
          const eCol = enemy.col;
          reduced = [...reduced, ...soldier.moveset.filter(m => {
            const included = enemy.moveset.includes(m);
            const mCol = toNumber(m[0]);
            const yDiff = (kCol < eCol) ? (mCol > kCol && mCol < eCol) : (mCol < kCol && mCol > eCol);
            const xDiff = (king.row < enemy.row) ? (m[1] < enemy.row && m[1] > king.row) : (m[1] > enemy.row && m[1] < king.row);
            return included && xDiff & yDiff;
          })];
        }
      }
      
      // if moves exist after reducing, declare that piece can move
      if (reduced.length > 0) {
        soldier.moveset = reduced;
        moveable.push(soldier);
      }

    }

    // check if the king can escape
    if (king.moveset.length > 0) moveable.push(king);

    // if no units can be moved, it's a checkmate!
    if (moveable.length == 0) {
      checkmate(oppColor);
      break;
    }

    // if it reaches this point, the king is in check
    document.getElementById(king.id).classList.add('threatened');
    check = true;
    break;
  }

  return check;
}

// handles pawn promotion
function promote(type) {

  // animation and promotion
  const clone = {type: promoPawn.type, color: promoPawn.color};
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