// converts column letters to numbers for comparison
function toNumber(letter) {
  return letter.charCodeAt(0) - 65;
}

// converts numbers to column letters for comparison
function toLetter(number) {
  return String.fromCharCode(number + 65);
}

// check if piece can move to destination
function blocked(col, row) {
  // check boundaries
  if (toNumber(col) < 0 || toNumber(col) >= 8 || row <= 0 || row > 8) return true;

  // determine if target has a piece
  const dest = board.pieces.find(p => p.col == col && p.row == row);
  return (dest != undefined);
}

// check if piece can capture at destination
function canCapture(piece, col, row) {
  // check boundaries
  if (toNumber(col) < 0 || toNumber(col) >= 8 || row <= 0 || row > 8) return false;

  // determine if target is from opposing side
  const dest = board.pieces.find(p => p.col == col && p.row == row);
  if (dest == undefined) return false;
  return (dest.color != piece.color);
}

// for rook, bishop, and queen
function rayCheck(piece, colDir, rowDir) {
  // declare variables
  const colInc = colDir;
  const rowInc = rowDir;
  var pos = [];

  // check in a line (diagonal or straight)
  for (let i = 0; i < 8; i++) {
    let newCol = toLetter(toNumber(piece.col) + colDir);
    let newRow = piece.row + rowDir;

    // check for empty space or other pieces
    if ( !blocked(newCol, newRow) ) {
      pos.push(`${newCol}${newRow}`);
    } else if ( canCapture(piece, newCol, newRow) ) {
      pos.push(`${newCol}${newRow}`);
      break;
    } else {
      break;
    }

    // keep moving
    colDir += colInc;
    rowDir += rowInc;
  }

  return pos;

}