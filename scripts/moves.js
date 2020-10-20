function pawnCheck(piece) {

  // declare variables
  var pos = [];
  const row = piece.row;
  const col = piece.col;
  const numCol = toNumber(piece.col);
  const dir = (piece.color == 'black') ? -1 : 1;
  const dRow = row+dir;

  // pawn marching
  if ( !blocked(col, dRow) ) {
    pos.push(`${col}${dRow}`);
    if ((dir < 0 && row == 7) || (dir > 0 && row == 2)) {
      if (!blocked(col, row+dir*2)) pos.push(`${col}${row+dir*2}`);
    }
  }

  // pawn capturing
  let newCol = toLetter(numCol-1);
  if (canCapture(piece, newCol, dRow)) {
    pos.push(`${newCol}${dRow}`);
  } else {
    piece.threats.push({
      id: `${newCol}${dRow}`,
      row: dRow,
      col: newCol,
      level: 1
    });
  }
  
  newCol = toLetter(numCol+1);
  if (canCapture(piece, newCol, dRow)) {
    pos.push(`${newCol}${dRow}`);
  } else {
    piece.threats.push({
      id: `${newCol}${dRow}`,
      row: dRow,
      col: newCol,
      level: 1
    });
  }

  // update possible moves
  piece.moves = pos;

}

function knightCheck(piece) {

  // get piece location
  const row = piece.row;
  const col = piece.col;
  let newCol;
  var pos = [];

  // check far left
  newCol = toLetter( toNumber(col) - 2 );
  if (!blocked(newCol, row+1) || canCapture(piece, newCol, row+1)) pos.push(`${newCol}${row+1}`);
  if (!blocked(newCol, row-1) || canCapture(piece, newCol, row-1)) pos.push(`${newCol}${row-1}`);

  // check far right
  newCol = toLetter( toNumber(col) + 2 );
  if (!blocked(newCol, row+1) || canCapture(piece, newCol, row+1)) pos.push(`${newCol}${row+1}`);
  if (!blocked(newCol, row-1) || canCapture(piece, newCol, row-1)) pos.push(`${newCol}${row-1}`);
  
  // check close left
  newCol = toLetter( toNumber(col) - 1 );
  if (!blocked(newCol, row+2) || canCapture(piece, newCol, row+2)) pos.push(`${newCol}${row+2}`);
  if (!blocked(newCol, row-2) || canCapture(piece, newCol, row-2)) pos.push(`${newCol}${row-2}`);

  // check close right
  newCol = toLetter( toNumber(col) + 1 );
  if (!blocked(newCol, row+2) || canCapture(piece, newCol, row+2)) pos.push(`${newCol}${row+2}`);
  if (!blocked(newCol, row-2) || canCapture(piece, newCol, row-2)) pos.push(`${newCol}${row-2}`);

  // update possible moves
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

function kingCheck(piece) {

  // get position
  const row = piece.row;
  const col = piece.col;
  let newCol;
  var pos = [];

  // check west
  newCol = toLetter( toNumber(col) - 1 );
  for (let i = -1; i < 2; i++) {
    if (!blocked(newCol, row+i) || canCapture(piece, newCol, row+i)) pos.push(`${newCol}${row+i}`);
  }

  // check east
  newCol = toLetter( toNumber(col) + 1 );
  for (let i = 1; i > -2; i--) {
    if (!blocked(newCol, row+i) || canCapture(piece, newCol, row+i)) pos.push(`${newCol}${row+i}`);
  }

  // check top and bottom
  if (!blocked(col, row-1) || canCapture(piece, col, row-1)) pos.push(`${col}${row-1}`);
  if (!blocked(col, row+1) || canCapture(piece, col, row+1)) pos.push(`${col}${row+1}`);

  // remove moves that puts king in danger
  const oppSide = board.pieces.filter(p => p.color != piece.color);
  let threatened = oppSide.filter(opp => opp.moves.find(m => m[0] == piece.col && m[1] == piece.row) );
  
  for (let move of pos) {

    // checks for dangers in the king's moves
    let danger;
    for (let opp of oppSide) {
      if (opp.type == 'pawn') {
        danger = opp.threats.find(t => t.id == move);
        if (danger) break;
      } else {
        danger = opp.moves.find(t => t == move);
        if (danger) break;
        if (threatened) {
          for (let capturer of threatened) {
            danger = capturer.threats.find(t => t.id == move && t.level == 1);
            if (danger) break;
          }
        }
        if (danger) break;
        danger = opp.threats.find(t => t.id == move && t.level == 0);
        if (danger) break;
      }
    }

    // if the current move is dangerous, remove this move
    if (danger) {
      pos = pos.filter(m => m != move);
    }
    
  }

  // update possible moves
  piece.moves = pos;

}