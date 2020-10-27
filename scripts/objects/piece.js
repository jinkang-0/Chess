class Piece {

  constructor(id, type, color) {
    this.id = id;
    this.row = parseInt(id[1]);
    this.col = toNumber(id[0]);
    this.type = type;
    this.color = color;
    this.previous;
    this.moveset = [];
    this.threats = [];
    this.specials = [];
  }

  show() {

    // create icon
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(`fa-chess-${this.type}`);
    icon.classList.add(this.color)
    
    // remove other icon and replace with current icon
    const grid = document.getElementById(this.id);
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

  capture(piece) {
    const index = board.pieces.indexOf(piece);
    const cell = document.getElementById(piece.id);
    board.pieces.splice(index, 1);
    cell.removeChild(cell.firstChild);
    logAction(this, piece, 'capture');
  }

  move(cell) {

    // change previous
    this.previous = {
      id: this.id,
      time: 0
    };

    // log action
    logAction(this, [this.id, cell], 'walk');

    // remove current grid icon
    const old = document.getElementById(this.id);
    if (old.firstChild) old.removeChild(old.firstChild);
    
    // find new grid
    const moveTo = document.getElementById(cell);
    
    // if another piece exists, capture it
    if (moveTo.firstChild) {
      const opp = board.pieces.find(p => p.id == cell);
      this.capture(opp);
    }

    // update position
    this.id = cell;
    this.row = parseInt(cell[1]);
    this.col = toNumber(cell[0]);

    // create and place icon in grid
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(`fa-chess-${this.type}`);
    icon.classList.add(this.color);

    moveTo.appendChild(icon);

    // check for pawn promotion
    if (this.type == 'pawn') {
      const reachedGoal = (this.color == 'black') ? this.id[1] == 1 : this.id[1] == 8;
      if (reachedGoal) return true;
    }

    return false;

  }

}