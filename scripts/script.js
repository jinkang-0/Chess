// setup board
const board = new Board();
board.initalize();

for (let piece of board.pieces) {
  piece.show();
}

// game functions
// TODO: remove check move every time piece is clicked and instead,
// have check move called for all pieces every time enemy side moves a piece or when board is initialized
function checkGrid(id) {
  const row = id.slice(1, 2);
  const col = id.slice(0, 1);
  const piece = board.pieces.find(piece => piece.row == row && piece.col == col);
  piece.checkMoves();
  console.log(piece.moves);
}