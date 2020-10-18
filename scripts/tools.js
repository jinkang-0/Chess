// converts column letters to numbers for comparison
function toNumber(letter) {
  return letter.charCodeAt(0) - 65;
}

// converts numbers to column letters for comparison
function toLetter(number) {
  return String.fromCharCode(number + 65);
}

// check boundaries for column or row
function outOfBounds(any) {
  if (typeof any == 'string') {
    return (toNumber(any) < 0 || toNumber(any) >= 8);
  } else if (typeof any == 'number') {
    return (any <= 0 || any > 8);
  } else {
    console.log('something went wrong');
  }
}

// check if piece can move to destination
function blocked(col, row) {
  // check boundaries
  if (outOfBounds(col) || outOfBounds(row)) return true;

  // determine if target has a piece
  const dest = board.pieces.find(p => p.col == col && p.row == row);
  return (dest != undefined);
}

// check if piece can capture at destination
function canCapture(piece, col, row) {
  // check boundaries
  if (outOfBounds(col) || outOfBounds(row)) return false;

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
  var checkThreats = false;

  // check in a line (diagonal or straight)
  for (let i = 0; i < 8; i++) {
    let newCol = toLetter(toNumber(piece.col) + colDir);
    let newRow = piece.row + rowDir;

    // check for empty space or other pieces
    if ( !blocked(newCol, newRow) ) {

      if (checkThreats) {
        piece.threats.push({
          id: `${newCol}${newRow}`,
          row: newRow,
          col: newCol,
          level: 1
        });
      } else {
        pos.push(`${newCol}${newRow}`);
      }

    } else if ( canCapture(piece, newCol, newRow) && !checkThreats ) {

      pos.push(`${newCol}${newRow}`);
      piece.threats.push({
        id: `${newCol}${newRow}`,
        row: newRow,
        col: newCol,
        level: 0
      });
      checkThreats = true;

    } else {
      
      let l = 0;

      if (checkThreats) l = 2;

      if (!outOfBounds(newCol) && !outOfBounds(newRow)) {
        piece.threats.push({
          id: `${newCol}${newRow}`,
          row: newRow,
          col: newCol,
          level: l
        });
      }
      
      if (checkThreats) break;
      checkThreats = true;

    }

    // keep moving
    colDir += colInc;
    rowDir += rowInc;
  }

  return pos;

}

// remove all highlighted grids
function removeHighlights() {
  const marked = document.querySelectorAll('.highlight');
  for (let mark of marked) {
    mark.classList.remove('highlight');
  }
}