class Board {

  constructor() {
    this.pieces = [];
    this.turn;
    this.stales = 0;
  }

  nextTurn() {
    this.turn = (this.turn == 'black') ? 'white' : 'black';
    document.getElementById('turn-icon').className = `fas fa-chess-king ${this.turn}`;

    // check if stale counts are enough to be a stalemate
    if (this.stales > 75) {
      stalemate();
    } else if (this.stales > 50) {
      showDraw();
    } else {
      const nonkings = this.pieces.filter(p => p.type != 'king');

      // if there are other units left (besides kings)
      if (nonkings.length > 0) {
        // it's a stale if there's only 1 bishop or 1 knight
        if (nonkings.length == 1) {
          if (nonkings[0].type == 'bishop' || nonkings[0].type == 'knight') {
            stalemate();
            return;
          }
        // also a stale if there's 2 opposing bishops on the same color
        } else if (nonkings.length == 2) {
          if (nonkings[0].type == 'bishop' && nonkings[1].type == 'bishop') {
            const color0 = document.getElementById(nonkings[0].id).classList.item(0);
            const color1 = document.getElementById(nonkings[1].id).classList.item(0);
            if (color0 == color1) {
              stalemate();
              return;
            }
          }
        }
        
        hideDraw();

      // it's a stalemate if there's only 2 kings left
      } else {
        stalemate();
      }
    }

    this.stales++;
  }

  // check moves for all pieces, then kings
  refreshMoveset() {
    // update times
    this.pieces.forEach(piece => {
      if (piece.previous) piece.previous.time++;
    });
    
    // refresh moveset of all pieces
    for (let piece of this.pieces) {
      piece.checkMoves();
    }
    
    // determine potential check and refresh king moveset
    const kings = this.pieces.filter(p => p.type == 'king');
    for (let king of kings) king.checkMoves();
    inCheck = determineCheck(this.turn);
  }

  initalize() {
    this.turn = 'white';
    this.constructDefault();

    // this.pieces = [
    //   new Piece('C7', 'king', 'black'),
    //   new Piece('E1', 'king', 'white'),
    //   new Piece('G6', 'queen', 'white'),
    //   new Piece('C6', 'rook', 'black'),
    //   new Piece('F6', 'bishop', 'black'),
    //   new Piece('H2', 'pawn', 'white')
    // ];

    this.refreshMoveset();
  }

  constructDefault() {
    this.pieces = [
      new Piece('A8', 'rook'  , 'black'),
      new Piece('B8', 'knight', 'black'),
      new Piece('C8', 'bishop', 'black'),
      new Piece('D8', 'queen' , 'black'),
      new Piece('E8', 'king'  , 'black'),
      new Piece('F8', 'bishop', 'black'),
      new Piece('G8', 'knight', 'black'),
      new Piece('H8', 'rook'  , 'black'),
    
      new Piece('A7', 'pawn', 'black'),
      new Piece('B7', 'pawn', 'black'),
      new Piece('C7', 'pawn', 'black'),
      new Piece('D7', 'pawn', 'black'),
      new Piece('E7', 'pawn', 'black'),
      new Piece('F7', 'pawn', 'black'),
      new Piece('G7', 'pawn', 'black'),
      new Piece('H7', 'pawn', 'black'),
    
      new Piece('A2', 'pawn', 'white'),
      new Piece('B2', 'pawn', 'white'),
      new Piece('C2', 'pawn', 'white'),
      new Piece('D2', 'pawn', 'white'),
      new Piece('E2', 'pawn', 'white'),
      new Piece('F2', 'pawn', 'white'),
      new Piece('G2', 'pawn', 'white'),
      new Piece('H2', 'pawn', 'white'),
    
      new Piece('A1', 'rook'  , 'white'),
      new Piece('B1', 'knight', 'white'),
      new Piece('C1', 'bishop', 'white'),
      new Piece('D1', 'queen' , 'white'),
      new Piece('E1', 'king'  , 'white'),
      new Piece('F1', 'bishop', 'white'),
      new Piece('G1', 'knight', 'white'),
      new Piece('H1', 'rook'  , 'white')
    ];
  }

}