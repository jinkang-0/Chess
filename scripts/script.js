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
  
  for (let mark of marked) {
    // if it is, move the piece to current grid,
    // remove all highlights, switch sides, then update moves
    if (grid === mark) {
      selected.move(row, col);

      // update pieces' possible moves
      // update kings' possible moves last
      const kings = board.pieces.filter(p => p.type == 'king');

      for (let piece of board.pieces) {
        if (!kings.includes(piece)) piece.checkMoves();
      }

      for (let king of kings) {
        king.checkMoves();
      }

      // find opponent (of selected) King
      const oppColor = (selected.color == "black") ? "white" : "black";
      const oppKing = board.pieces.find(p => p.type == "king" && p.color == oppColor);
      turn = oppColor;

      // determine if opponent (of selected) King is in check
      const selectSide = board.pieces.filter(p => p.color == selected.color);
      const oppSide = board.pieces.filter(p => p.color == oppColor);

      inCheck = false;

      // finds any moves that threatens opponent (of selected) King
      for (let soldier of selectSide) {
        let threatening = soldier.moves.find(t => t[0] == oppKing.col && t[1] == oppKing.row );

        // if there exists such a move, find if this threat can be removed
        if (threatening) {

          // check if threatening soldier can be captured
          for (let opponent of oppSide) {
            if (opponent.type == 'king') continue;
            const breaker = opponent.moves.find(b => b[0] == soldier.col && b[1] == soldier.row);
            if (breaker) {
              opponent.moves = [breaker];
              moveable.push(opponent);
            }
          }

          // check if the king can escape
          if (oppKing.moves.length > 0) moveable.push(oppKing);

          if (moveable.length == 0) {
            console.log('checkmate!');
          }

          inCheck = true;
          break;
        }
      }

      // remove highlights and selected
      selected = undefined;
      removeHighlights();
      return;
    }
  }

  // if grid is not highlighted, remove all highlights
  removeHighlights();

  // find if grid contains a piece (that can be played)
  let available = board.pieces.filter(p => p.color == turn);
  if (inCheck) available = available.filter(p => moveable.includes(p) && p.color == turn);
  const piece = available.find(p => p.row == row && p.col == col);

  if (piece) {

    // find opponent pieces and king on the side of this piece
    const oppSide = board.pieces.filter(p => p.color != piece.color);
    const king = board.pieces.find(p => p.type == 'king' && p.color == piece.color);

    // stops if moving this piece will cause the king to be in check
    if (king != piece) {
      for (let opp of oppSide) {
        const kingThreat = opp.threats.find(t => t.col == king.col && t.row == king.row);
        const pieceThreat = opp.threats.find(t => t.col == piece.col && t.row == piece.row);
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