// setup variables
var selected;
var inCheck = false;
var moveable = [];

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
    board.turn = oppSide;
    inCheck = determineCheck(oppSide);

    // if check, log action
    if (inCheck) {
      const king = kings.find(p => p.color == oppSide);
      logAction(selected, king, 'threaten');
    }

    // remove highlights and selected
    selected = undefined;
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

          // no exceptions for knights :(
          if (piece.type == 'knight') return;

          // check horizontally
          if (king.row == piece.row) {
            piece.moves = piece.moves.filter(m => m[1] == piece.row);

          // check vertically
          } else if (king.col == piece.col) {
            piece.moves = piece.moves.filter(m => m[0] == piece.col);

          // check diagonally
          } else {
            // rooks won't have exceptions to potential diagonal checks
            if (piece.type == 'rook') return;

            const pCol = toNumber(piece.col);
            const oCol = toNumber(opp.col);
            // leaves moves that makes the piece go between the king and the threatener,
            // or better, captures the threatener
            piece.moves = piece.moves.filter(m => {
              if (m[0] == opp.col && m[1] == opp.row) return true;
              const included = opp.moves.includes(m);
              const mCol = toNumber(m[0]);
              const vrDiff = (opp.row > piece.row) ? (m[1] < opp.row && m[1] > piece.row) : (m[1] > opp.row && m[1] < piece.row);
              const hrDiff = (oCol < pCol) ? (mCol < pCol && mCol > oCol) : (mCol > pCol && mCol < oCol);
              return included && hrDiff && vrDiff;
            });
          }

          break;
        }
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

// creates a log
function logAction(left, right, action) {

  // creates the icon and the left icon
  const icon = document.createElement('div');
  const leftIcon = document.createElement('i');
  leftIcon.className = `fas fa-chess-${left.type} ${left.color}`;

  // determines whether to make an icon or a string for the right side
  let rightSide;
  if (right.length) {
    rightSide = document.createElement('div');
    const from = document.createElement('p');
    const pointTo = document.createElement('div');
    const to = document.createElement('p');
    from.className = 'from-grid';
    to.className = 'to-grid';
    from.innerHTML = right[0];
    to.innerHTML = right[1];
    rightSide.appendChild(from);
    rightSide.appendChild(pointTo);
    rightSide.appendChild(to);
  } else {
    rightSide = document.createElement('i');
    rightSide.className = `fas fa-chess-${right.type} ${right.color}`;
  }

  // creates the toast itself
  const toast = document.createElement('div');

  // moves all other logs down
  const logs = document.querySelector('.inner-sidebar');
  logs.scrollTop = 0;
  const allToasts = logs.children;
  if (allToasts.length > 0) {
    allToasts[0].classList.replace('new-toast', 'old-toast');
    for (let i = 1; i < Math.min(12, allToasts.length); i++) {
      const clone = allToasts[i].cloneNode(true);
      allToasts[i].replaceWith(clone);
    }
  }

  // adds the toast to the log
  logs.prepend(toast);
  
  // add components to the toast
  toast.className = 'toast new-toast';
  toast.appendChild(leftIcon);
  toast.appendChild(icon);
  toast.appendChild(rightSide);
  icon.outerHTML = getSVG(action);
  if (right.length) {
    const arrow = rightSide.children[1];
    arrow.outerHTML = getSVG('to');
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
    let threatening = enemy.moves.find(e => e[0] == king.col && e[1] == king.row );
    
    // if there exists such a move, find if this threat can be removed
    if (threatening) {

      // check if the threaten(er) can be captured
      for (let soldier of sidePieces) {
        const breaker = soldier.moves.find(s => s[0] == enemy.col && s[1] == enemy.row);
        if (breaker) {
          soldier.moves = [breaker];
          moveable.push(soldier);
        }
      }

      // check if the king can escape
      if (king.moves.length > 0) moveable.push(king);

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