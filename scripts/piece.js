class Piece {

  constructor(row, col, type, color) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.color = color;
    this.moves = [];
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

    switch (this.type) {
      case 'pawn':
        return pawnCheck(this);
      case 'rook':
        return rookCheck(this);
      case 'bishop':
        return bishopCheck(this);
      case 'queen':
        return queenCheck(this);
    }

  }

  move(row, col) {

    // remove current grid icon
    const old = document.getElementById(`${this.col}${this.row}`);
    if (old.firstChild) old.removeChild(old.firstChild);

    // update position
    this.row = row;
    this.col = col;

    // find grid
    const moveTo = document.getElementById(`${this.col}${this.row}`);
    if (moveTo.firstChild) moveTo.removeChild(moveTo.firstChild);

    // create and display icon
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(`fa-chess-${this.type}`);
    icon.classList.add(this.color);

    moveTo.appendChild(icon);

  }

}