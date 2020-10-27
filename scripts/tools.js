/**
 * 
 * This script adds tools to help with
 * implementing mechanics
 * 
 */

// converts column letters to numbers for comparison
function toNumber(letter) {
  return letter.charCodeAt(0) - 65;
}

// converts numbers to column letters for comparison
function toLetter(number) {
  return String.fromCharCode(number + 65);
}

// check boundaries for a cell
function outOfBounds(cell) {
  const col = toNumber(cell[0]);
  const row = parseInt(cell.slice(1));
  if (col < 0 || col > 7) return true;
  if (row < 1 || row > 8) return true;
  return false;
}

// check if piece can move to destination
function blocked(cell) {
  // check boundaries
  if (outOfBounds(cell)) return true;

  // determine if target has a piece
  const dest = board.pieces.find(p => p.id == cell);
  return (dest != undefined);
}

// check if piece can capture at destination
function canCapture(piece, cell) {
  // check boundaries
  if (outOfBounds(cell)) return false;

  // determine if target is from opposing side
  const dest = board.pieces.find(p => p.id == cell);
  if (dest == undefined) return false;
  return (dest.color != piece.color);
}

// for rook, bishop, and queen
function rayCheck(piece, hrDir, vrDir) {
  // declare variables
  let colInc = hrDir;
  let rowInc = vrDir;
  var pos = [];
  var checkThreats = false;

  // check in a line (diagonal or straight)
  for (let i = 0; i < 8; i++) {
    const newCol = toLetter(piece.col + colInc);
    const newRow = piece.row + rowInc;
    const newCell = `${newCol}${newRow}`

    // check for empty space or other pieces
    if ( !blocked(newCell) ) {

      if (checkThreats) {
        piece.threats.push({
          id: newCell,
          row: newRow,
          col: newCol,
          level: 1
        });
      } else {
        pos.push(newCell);
      }

    } else if ( canCapture(piece, newCell) && !checkThreats ) {

      pos.push(newCell);
      piece.threats.push({
        id: newCell,
        row: newRow,
        col: newCol,
        level: 0
      });
      checkThreats = true;

    } else {
      
      let lv = 0;

      if (checkThreats) lv = 2;

      if (!outOfBounds(newCell)) {
        piece.threats.push({
          id: newCell,
          row: newRow,
          col: newCol,
          level: lv
        });
      }
      
      if (checkThreats) break;
      checkThreats = true;

    }

    // keep moving
    colInc += hrDir;
    rowInc += vrDir;
  }

  return pos;

}

// returns svgs in string format
function getSVG(type) {
  switch (type) {
    case 'walk':
      return '<svg width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.01011 17.5921H30.0101C27.5101 31.5921 18.5101 51.0921 18.5101 51.0921H5.51001C5.51001 51.0921 6.06402 49.8111 7.01011 39.0921C7.9562 28.3731 7.01011 17.5921 7.01011 17.5921Z" fill="#D0B56E"/><path d="M6.01001 45.5921H22.01L18.51 51.1304C26.01 54.1304 45.51 46.6304 51.01 54.6304C51.01 54.6304 53.51 63.1304 49.51 67.1304H4C4 67.1304 4.51001 54.6304 6.01001 45.5921Z" fill="#303C2B"/><path d="M4.93646 19.7431L25.5794 9.6007C29.5093 23.2684 30.0306 44.7388 30.0306 44.7388L18.3628 50.4715C18.3628 50.4715 18.2951 49.0775 14.4174 39.0398C10.5397 29.0021 4.93646 19.7431 4.93646 19.7431Z" fill="#F9D781"/><path d="M16.3861 45.3147L30.7464 38.2591L30.0474 44.7733C38.1017 44.1585 52.296 28.8281 60.7602 33.5829C60.7602 33.5829 66.7523 40.1094 64.9261 45.4633L21.8452 66.6302C21.8452 66.6302 19.0255 54.0882 16.3861 45.3147Z" fill="#415135"/></svg>';
    case 'capture':
      return '<svg width="103" height="68" viewBox="0 0 103 68" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.3446 56.8304C19.3446 56.8304 28.3813 58.0021 32.3094 55.9706C36.2375 53.9391 39.4005 45.0829 39.4005 45.0829L43.3759 46.1214C43.3759 46.1214 39.5158 57.013 34.5018 59.9499C29.4878 62.8867 18.3061 60.8059 18.3061 60.8059L19.3446 56.8304Z" fill="#595959"/><path d="M38.2075 44.7713C38.2075 44.7713 39.9909 36.3191 34.0457 33.0673C28.8436 30.2219 26.6603 28.8258 18.9212 30.8149C14.1451 32.0424 11.2964 35.6177 10.2221 42.9812C8.91716 51.9259 19.8636 54.8427 19.8636 54.8427L17.9942 61.9985C17.9942 61.9985 8.38513 56.5155 5.15456 51.0001C1.89439 45.4343 5.43028 35.8157 7.33887 32.8852C10.8844 27.4413 14.7807 25.5314 20.479 24.8517C21.6652 24.7103 22.4225 25.1117 22.9417 23.124C23.461 21.1363 23.6687 20.3412 24.2918 17.956C26.5051 15.9861 32.3644 17.9415 33.0378 20.2408C32.4146 22.626 32.4146 22.626 31.8954 24.6137C32.161 26.3242 34.3815 26.9175 35.4996 27.5017C40.2336 29.9751 42.7589 32.3672 44.3639 37.4615C45.3845 40.7008 44.5682 46.433 44.5682 46.433L38.2075 44.7713Z" fill="#BDBDBD"/><path d="M26.6593 20.2731C26.8887 19.3949 27.7866 18.8689 28.6649 19.0984C29.5431 19.3278 30.0473 20.3089 29.8396 21.1039C29.5281 22.2966 28.6291 22.4864 28.6291 22.4864L27.784 25.7215L26.1938 25.306L27.039 22.071C27.039 22.071 26.3477 21.4657 26.6593 20.2731Z" fill="black"/><path d="M83.2497 53.9873C83.2497 53.9873 74.2626 54.138 70.6481 51.7546C67.0336 49.3713 64.9528 40.4931 64.9528 40.4931L60.9391 41.0635C60.9391 41.0635 63.469 51.9789 68.0432 55.3524C72.6174 58.726 83.8102 57.9313 83.8102 57.9313L83.2497 53.9873Z" fill="#595959"/><path d="M66.1569 40.3219C66.1569 40.3219 65.3812 31.9825 71.5788 29.4922C77.0018 27.3132 79.301 26.2041 86.6537 28.9592C91.1913 30.6595 93.5711 34.414 93.7773 41.6272C94.0278 50.3896 82.9694 52.0153 82.9694 52.0153L83.9783 59.1145C83.9783 59.1145 94.0215 54.8706 97.82 49.9047C101.653 44.8934 99.2948 35.24 97.7619 32.2089C94.9143 26.5781 91.3169 24.3154 85.8129 23.0432C84.6672 22.7784 83.8792 23.0833 83.5989 21.1113C83.3187 19.1393 83.2066 18.3505 82.8702 15.9841C80.9284 13.8459 74.964 15.0959 74.0401 17.2391C74.3764 19.6055 74.3764 19.6055 74.6567 21.5775C74.1999 23.1973 71.9565 23.5287 70.7941 23.9706C65.8725 25.8419 63.1238 27.8739 60.9661 32.61C59.5941 35.6215 59.735 41.2346 59.735 41.2346L66.1569 40.3219Z" fill="#BDBDBD"/><path d="M80.285 17.961C80.1612 17.0898 79.342 16.4856 78.4553 16.6116C77.5686 16.7376 76.9619 17.6286 77.0741 18.4174C77.2422 19.6006 78.101 19.8809 78.101 19.8809L78.5571 23.0904L80.1626 22.8622L79.7065 19.6527C79.7065 19.6527 80.4532 19.1442 80.285 17.961Z" fill="black"/><path d="M26.5273 17.5C26.5273 17.5 30.9962 10.4647 35.5273 6.50001C39.5273 3 43.5273 -3.27826e-07 49.5273 0C56.1038 3.59323e-07 63.0273 8.82149e-06 69.0273 3C74.6842 5.82842 80.0273 15 80.0273 15L75.5273 16C75.5273 16 70.1468 8.33088 66.0273 6.50001C61.9079 4.66914 56.2131 4.21615 50.5273 4.49999C45.9746 4.72728 43.5273 5.49998 38.5273 9.49998C34.2909 12.8892 31.0273 18.5 31.0273 18.5L26.5273 17.5Z" fill="#C4C4C4"/></svg>';
    case 'threaten':
      return '<svg width="76" height="40" viewBox="0 0 76 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M66.4163 12.4238L75.6721 18.0709L66.4163 23.7181L21.4593 20.8945V15.2473L66.4163 12.4238Z" fill="#F3F3F3"/><rect x="23.0367" width="34.9041" height="3.49041" transform="rotate(90 23.0367 0)" fill="#495F3C"/><rect x="19.5463" y="14.6597" width="5.58465" height="19.5463" transform="rotate(90 19.5463 14.6597)" fill="#37482C"/></svg>';
    case 'promote':
      return '<svg width="64" height="49" viewBox="0 0 64 49" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M63.5 24.5L43.1774 48.5V34.1L0.500002 34.1V14.3L43.1774 14.3V0.5L63.5 24.5Z" fill="#FFC700"/></svg>';
    case 'to':
      return '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H4.35556V4.52525L8.55556 7.27273V4.0404L14 9.85859L8.55556 16V12.4444L0 7.27273V0Z" fill="#C4C4C4"/></svg>';
  }
}

// remove all child elements of a DOM element
function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild( elem.firstChild );
  }
}