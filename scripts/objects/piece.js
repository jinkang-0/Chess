class Piece {

  constructor(row, col, type, color) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.color = color;
    this.moves = [];
    this.threats = [];
  }

  show() {

    // create icon
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(`fa-chess-${this.type}`);
    icon.classList.add(this.color)
    
    // remove other icon and replace with current icon
    const grid = document.getElementById(`${this.col}${this.row}`);
    if (grid.firstChild) grid.removeChild(grid.firstChild);
    grid.appendChild(icon);

  }

  checkMoves() {

    this.threats = [];

    switch (this.type) {
      case 'pawn':
        return pawnCheck(this);
      case 'rook':
        return rookCheck(this);
      case 'knight':
        return knightCheck(this);
      case 'bishop':
        return bishopCheck(this);
      case 'queen':
        return queenCheck(this);
      case 'king':
        return kingCheck(this);
    }

  }

  move(row, col) {

    // prepare to report action
    let action = 'walk';
    let piece = [`${this.col}${this.row}`, `${col}${row}`];

    // remove current grid icon
    const old = document.getElementById(`${this.col}${this.row}`);
    if (old.firstChild) old.removeChild(old.firstChild);
    
    // find new grid
    const moveTo = document.getElementById(`${col}${row}`);
    
    // if another piece exists, capture it
    if (moveTo.firstChild) {
      const opp = board.pieces.find(p => p.col == col && p.row == row);
      const index = board.pieces.indexOf(opp);
      board.pieces.splice(index, 1);
      moveTo.removeChild(moveTo.firstChild);
      action = 'capture';
      piece = opp;
    }

    // update position
    this.row = parseInt(row);
    this.col = col;

    // create and place icon in grid
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(`fa-chess-${this.type}`);
    icon.classList.add(this.color);

    moveTo.appendChild(icon);
    
    // log action
    logAction(this, piece, action);

    // check for pawn promotion
    if (this.type == 'pawn') {
      const reachedGoal = (this.color == 'black') ? this.row == 1 : this.row == 8;
      if (reachedGoal) return true;
    }

    return false;

  }

}