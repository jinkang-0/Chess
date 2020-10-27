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
      (nonkings.length == 0) ? stalemate() : hideDraw();
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
    inCheck = determineCheck(this.turn);
    const kings = this.pieces.filter(p => p.type == 'king');
    for (let king of kings) king.checkMoves();
  }

  initalize() {
    this.turn = 'white';
    this.constructDefault();

    // this.pieces = [
    //   new Piece('B8', 'king', 'black'),
    //   new Piece('E1', 'king', 'white'),
    //   new Piece('E2', 'pawn', 'white'),
    //   new Piece('D4', 'pawn', 'black'),
    //   new Piece('F5', 'pawn', 'white'),
    //   new Piece('E7', 'pawn', 'black')
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