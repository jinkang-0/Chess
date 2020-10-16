function pawnCheck(piece) {

  // declare variables
  var pos = [];
  const row = piece.row;
  const col = piece.col;
  const numCol = toNumber(piece.col);
  const dir = (piece.color == 'black') ? -1 : 1;

  // pawn marching
  const pathBlocked = blocked(col, row+dir);
  if (!pathBlocked) {
    pos.push(`${col}${row+dir}`);
    if ((dir < 0 && row == 7) || (dir > 0 && row == 2)) {
      if (!blocked(col, row+dir*2)) pos.push(`${col}${row+dir*2}`);
    }
  }

  // pawn capturing
  if (canCapture(piece, toLetter(numCol-1), row+dir)) pos.push(`${toLetter(numCol-1)}${row+dir}`);
  if (canCapture(piece, toLetter(numCol+1), row+dir)) pos.push(`${toLetter(numCol+1)}${row+dir}`);

  piece.moves = pos;

}

function rookCheck(piece) {

  // find moves
  var pos = [];
  
  pos = [...pos, ...rayCheck(piece,  1,  0)];
  pos = [...pos, ...rayCheck(piece, -1,  0)];
  pos = [...pos, ...rayCheck(piece,  0,  1)];
  pos = [...pos, ...rayCheck(piece,  0, -1)];
  
  // assign moves
  piece.moves = pos;

}

function bishopCheck(piece) {

  // find moves
  var pos = [];

  pos = [...pos, ...rayCheck(piece,  1,  1)];
  pos = [...pos, ...rayCheck(piece, -1,  1)];
  pos = [...pos, ...rayCheck(piece,  1, -1)];
  pos = [...pos, ...rayCheck(piece, -1, -1)];

  // assign moves
  piece.moves = pos;

}

function queenCheck(piece) {

  // find moves
  var pos = [];

  // straight
  pos = [...pos, ...rayCheck(piece,  1,  0)];
  pos = [...pos, ...rayCheck(piece, -1,  0)];
  pos = [...pos, ...rayCheck(piece,  0,  1)];
  pos = [...pos, ...rayCheck(piece,  0, -1)];

  // diagonal
  pos = [...pos, ...rayCheck(piece,  1,  1)];
  pos = [...pos, ...rayCheck(piece, -1,  1)];
  pos = [...pos, ...rayCheck(piece,  1, -1)];
  pos = [...pos, ...rayCheck(piece, -1, -1)];

  // assign moves
  piece.moves = pos;

}