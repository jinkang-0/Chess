/**
 * 
 * This script contains functions for checking
 * possible moves, for each type of chess piece
 * 
 */

function pawnCheck(piece) {

  // declare variables
  var pos = [];
  const col = piece.id[0];
  const row = piece.row;
  const dir = (piece.color == 'black') ? -1 : 1;
  const dRow = row+dir;

  // pawn marching
  if ( !blocked(`${col}${dRow}`) ) {
    pos.push(`${col}${dRow}`);
    if ((dir < 0 && row == 7) || (dir > 0 && row == 2)) {
      if (!blocked(`${col}${row+dir*2}`)) pos.push(`${col}${row+dir*2}`);
    }
  }

  // pawn capturing
  let newCell = `${toLetter(piece.col-1)}${dRow}`;
  if (canCapture(piece, newCell)) { pos.push(newCell); } 
  else { piece.threats.push({ id: newCell, row: dRow, col: newCell[0], level: 1 }); }
  
  newCell = `${toLetter(piece.col+1)}${dRow}`;
  if (canCapture(piece, newCell)) { pos.push(newCell); } 
  else { piece.threats.push({ id: newCell, row: dRow, col: newCell[0], level: 1 }); }

  // check for en passant
  let specials = [];
  if ((piece.color == 'black') ? piece.row == 4 : piece.row == 5) {
    const trespassers = board.pieces.filter(p => p.color != piece.color && p.type == 'pawn' && p.previous && p.previous.time == 1 && p.row == piece.row);
    for (let pawn of trespassers) {
      if (pawn.col < piece.col-1 || pawn.col > piece.col+1) continue;
      const capDir = (dir > 0) ? 'down' : 'up';
      specials.push({
        type: 'enpassant',
        to: `${pawn.id[0]}${dRow}`,
        link: pawn.id,
        effect: 'capture',
        linkdir: capDir
      });
    }
  }

  // update possible moves
  piece.moveset = pos;
  piece.specials = specials;

}

function knightCheck(piece) {

  // get piece location
  const row = piece.row;
  let newCol;
  var pos = [];

  // check far left
  newCol = toLetter( piece.col - 2 );
  if (!blocked(`${newCol}${row+1}`) || canCapture(piece, `${newCol}${row+1}`)) pos.push(`${newCol}${row+1}`);
  if (!blocked(`${newCol}${row-1}`) || canCapture(piece, `${newCol}${row-1}`)) pos.push(`${newCol}${row-1}`);

  // check far right
  newCol = toLetter( piece.col + 2 );
  if (!blocked(`${newCol}${row+1}`) || canCapture(piece, `${newCol}${row+1}`)) pos.push(`${newCol}${row+1}`);
  if (!blocked(`${newCol}${row-1}`) || canCapture(piece, `${newCol}${row-1}`)) pos.push(`${newCol}${row-1}`);
  
  // check close left
  newCol = toLetter( piece.col - 1 );
  if (!blocked(`${newCol}${row+2}`) || canCapture(piece, `${newCol}${row+2}`)) pos.push(`${newCol}${row+2}`);
  if (!blocked(`${newCol}${row-2}`) || canCapture(piece, `${newCol}${row-2}`)) pos.push(`${newCol}${row-2}`);

  // check close right
  newCol = toLetter( piece.col + 1 );
  if (!blocked(`${newCol}${row+2}`) || canCapture(piece, `${newCol}${row+2}`)) pos.push(`${newCol}${row+2}`);
  if (!blocked(`${newCol}${row-2}`) || canCapture(piece, `${newCol}${row-2}`)) pos.push(`${newCol}${row-2}`);

  // update possible moves
  piece.moveset = pos;

}

function rookCheck(piece) {

  // find moves
  var pos = [];
  
  pos = [...pos, ...rayCheck(piece,  1,  0)];
  pos = [...pos, ...rayCheck(piece, -1,  0)];
  pos = [...pos, ...rayCheck(piece,  0,  1)];
  pos = [...pos, ...rayCheck(piece,  0, -1)];
  
  // assign moves
  piece.moveset = pos;

}

function bishopCheck(piece) {

  // find moves
  var pos = [];

  pos = [...pos, ...rayCheck(piece,  1,  1)];
  pos = [...pos, ...rayCheck(piece, -1,  1)];
  pos = [...pos, ...rayCheck(piece,  1, -1)];
  pos = [...pos, ...rayCheck(piece, -1, -1)];

  // assign moves
  piece.moveset = pos;

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
  piece.moveset = pos;

}

function kingCheck(piece) {

  // get position
  const row = piece.row;
  const col = piece.id[0];
  var newCol;
  var pos = [];
  var specials = [];
  piece.threats = [];

  // check west
  newCol = toLetter( piece.col - 1 );
  for (let i = -1; i < 2; i++) {
    const newCell = `${newCol}${row+i}`;
    if (!blocked(newCell) || canCapture(piece, newCell)) pos.push(newCell);
    piece.threats.push({id: newCell, col: newCol, row: row+i, level: 0});
  }

  // check east
  newCol = toLetter( piece.col + 1 );
  for (let i = 1; i > -2; i--) {
    const newCell = `${newCol}${row+i}`;
    if (!blocked(newCell) || canCapture(piece, newCell)) pos.push(newCell);
    piece.threats.push({id: newCell, col: newCol, row: row+i, level: 0});
  }

  // check top and bottom
  const upperCell = `${col}${row-1}`;
  const lowerCell = `${col}${row+1}`;
  if (!blocked(upperCell) || canCapture(piece, upperCell)) pos.push(upperCell);
  if (!blocked(lowerCell) || canCapture(piece, lowerCell)) pos.push(lowerCell);
  piece.threats.push({id: upperCell, col: col, row: row-1, level: 0});
  piece.threats.push({id: lowerCell, col: col, row: row+1, level: 0});

  const oppSide = board.pieces.filter(p => p.color != piece.color);

  // check for castling if king has not moved and is not in check
  if (piece.previous == undefined && !inCheck) {
    const rooks = board.pieces.filter(p => p.type == 'rook' && p.color == piece.color);
    const nonpawns = oppSide.filter(p => p.type != 'pawn');
    for (let rook of rooks) {
      if (rook.moves != undefined) continue;
      // find a rook that has clear sight of king and has not moved
      if (rook.threats.find(t => t.level == 0 && t.id == piece.id)) {
        const rCol = rook.col;
        const kCol = piece.col;
        let dangerQ;
        
        // find moves between king and rook
        if (rCol < kCol) { dangerQ = rook.moveset.filter(m => toNumber(m[0]) < kCol && toNumber(m[0]) > rCol + 1); } 
        else { dangerQ = rook.moveset.filter(m => toNumber(m[0]) > kCol && toNumber(m[0]) < rCol); }
        // filter out dangerous moves
        for (let enemy of nonpawns) dangerQ = dangerQ.filter(m => !enemy.moveset.includes(m));
        
        // if moveset is not compromised, castling is possible
        if (dangerQ.length == 2) {
          const rDir = (rCol < kCol) ? 'right' : 'left';
          const destCol = (rCol < kCol) ? 'C' : 'G';
          const efftCol = (rCol < kCol) ? 'D' : 'F';
          specials.push({
            type: 'castling',
            link: rook.id,
            linkto: `${efftCol}${piece.row}`,
            linkdir: rDir,
            effect: 'move',
            to: `${destCol}${piece.row}`
          });
        }
      }
    }
  }

  // remove moves that puts king in danger
  let threatened = oppSide.filter(opp => opp.moveset.find(m => m == piece.id) );

  for (let opp of oppSide) {
    if (opp.type == 'pawn' || opp.type == 'king') {
      pos = pos.filter(m => opp.threats.find(t => t.id == m) == undefined);
    } else {
      pos = pos.filter(m => opp.moveset.find(t => t == m) == undefined);
      if (threatened) for (let capturer of threatened) pos = pos.filter(m => capturer.threats.find(t => t.id == m && t.level == 1) == undefined);
      pos = pos.filter(m => opp.threats.find(t => t.id == m && t.level == 0) == undefined);
    }
  }

  // update possible moves
  piece.moveset = pos;
  piece.specials = specials;

}