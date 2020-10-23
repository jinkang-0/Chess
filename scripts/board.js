class Board {

  constructor() {
    this.dom = document.querySelector('.board').children;
    this.pieces = [];
    this.turn = 'white';
  }

  initalize() {
    this.pieces = [
      new Piece(8, 'A', 'rook'  , 'black'),
      new Piece(8, 'B', 'knight', 'black'),
      new Piece(8, 'C', 'bishop', 'black'),
      new Piece(8, 'D', 'queen' , 'black'),
      new Piece(8, 'E', 'king'  , 'black'),
      new Piece(8, 'F', 'bishop', 'black'),
      new Piece(8, 'G', 'knight', 'black'),
      new Piece(8, 'H', 'rook'  , 'black'),
    
      new Piece(7, 'A', 'pawn', 'black'),
      new Piece(7, 'B', 'pawn', 'black'),
      new Piece(7, 'C', 'pawn', 'black'),
      new Piece(7, 'D', 'pawn', 'black'),
      new Piece(7, 'E', 'pawn', 'black'),
      new Piece(7, 'F', 'pawn', 'black'),
      new Piece(7, 'G', 'pawn', 'black'),
      new Piece(7, 'H', 'pawn', 'black'),
    
      new Piece(2, 'A', 'pawn', 'white'),
      new Piece(2, 'B', 'pawn', 'white'),
      new Piece(2, 'C', 'pawn', 'white'),
      new Piece(2, 'D', 'pawn', 'white'),
      new Piece(2, 'E', 'pawn', 'white'),
      new Piece(2, 'F', 'pawn', 'white'),
      new Piece(2, 'G', 'pawn', 'white'),
      new Piece(2, 'H', 'pawn', 'white'),
    
      new Piece(1, 'A', 'rook'  , 'white'),
      new Piece(1, 'B', 'knight', 'white'),
      new Piece(1, 'C', 'bishop', 'white'),
      new Piece(1, 'D', 'queen' , 'white'),
      new Piece(1, 'E', 'king'  , 'white'),
      new Piece(1, 'F', 'bishop', 'white'),
      new Piece(1, 'G', 'knight', 'white'),
      new Piece(1, 'H', 'rook'  , 'white')
    ];
  }

}