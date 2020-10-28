/**
 * 
 * This script handles animations or displays
 * and updates them accordingly
 * 
 */

// remove all highlighted grids
function removeHighlights() {
  
  // remove highlighted grids
  const marked = document.querySelectorAll('.highlight');
  for (let mark of marked) mark.classList.remove('highlight');
  
  // remove special highlight grids
  const specials = document.querySelectorAll('.special');
  for (let sp of specials) {
    if (sp.classList.contains('dark')) {
      sp.className = 'dark';
    } else if (sp.classList.contains('silver')) {
      sp.className = 'silver';
    }
  }

  // remove selected grids
  if (selectedCell) {
    selectedCell.classList.remove('selected');
    selectedCell = undefined;
  }

}

// creates a log
function logAction(left, right, action) {

  // creates the icon and the left icon
  const icon = document.createElement('div');
  const leftIcon = document.createElement('i');
  leftIcon.className = `fas fa-chess-${left.type} ${left.color}`;

  // determines whether to make an icon or a string for the right side
  let rightSide;
  if (right.length) {
    rightSide = document.createElement('div');
    const from = document.createElement('p');
    const pointTo = document.createElement('div');
    const to = document.createElement('p');
    from.className = 'from-grid';
    to.className = 'to-grid';
    from.innerHTML = right[0];
    to.innerHTML = right[1];
    rightSide.appendChild(from);
    rightSide.appendChild(pointTo);
    rightSide.appendChild(to);
  } else {
    rightSide = document.createElement('i');
    rightSide.className = `fas fa-chess-${right.type} ${right.color}`;
  }

  // creates the toast itself
  const toast = document.createElement('div');

  // moves all other logs down
  const logs = document.querySelector('.inner-sidebar');
  logs.scrollTop = 0;
  const allToasts = logs.children;
  if (allToasts.length > 0) {
    allToasts[0].classList.replace('new-toast', 'old-toast');
    for (let i = 1; i < Math.min(12, allToasts.length); i++) {
      const clone = allToasts[i].cloneNode(true);
      allToasts[i].replaceWith(clone);
    }
  }

  // adds the toast to the log
  logs.prepend(toast);
  
  // add components to the toast
  toast.className = 'toast new-toast';
  toast.appendChild(leftIcon);
  toast.appendChild(icon);
  toast.appendChild(rightSide);
  icon.outerHTML = getSVG(action);
  if (right.length) {
    const arrow = rightSide.children[1];
    arrow.outerHTML = getSVG('to');
  }

}

// shows pawn promotion screen
function showPromo(pawn) {
  
  // show promo screen and show correct pawn color
  const screen = document.getElementById('pawn-promo');
  const promoBox = document.getElementById('promo-box');
  screen.className = '';  
  promoBox.className = pawn.color;
  promoPawn = pawn;

}

// animates pawn undergoing promotion
function animatePromotion() {

  // play animation
  const cell = document.getElementById(promoPawn.id);
  cell.classList.add('promoting');
  setTimeout(() => {
    cell.classList.remove('promoting');
  }, 1000);

  // set pawn type to that piece
  setTimeout(() => {
    promoPawn.show();
    promoPawn = undefined;
  }, 500);

}

// show checkmate screen
function checkmate(winners) {

  if (winners == undefined) winners = 'white';

  // get score
  let winScore, otherScore;
  if (winners[0] == 'b') {
    bScore++;
    winScore = bScore;
    otherScore = wScore;
  } else {
    wScore++;
    winScore = wScore;
    otherScore = bScore;
  }

  // set winner color
  const other = (winners[0] == 'b') ? 'white' : 'black';
  const stats = document.getElementsByClassName('stats');
  const winner = stats.namedItem(`${winners[0]}-stat`);
  winner.className = 'stats winner';

  // set end text
  document.getElementById('end-text').innerHTML = 'Checkmate!';
  
  // start animation
  const screen = document.getElementById('end-screen');
  screen.classList.remove('hidden');
  
  // update score
  setTimeout(() => {
    if (winner.classList.contains('winner')) {
      winner.children.item(1).innerHTML = winScore;
    }
  }, 2850);

  // show all scores
  setTimeout(() => {
    if (winner.classList.contains('winner')) {
      const otherStat = stats.namedItem(`${other[0]}-stat`);
      otherStat.classList.add('shown');
      otherStat.children.item(1).innerHTML = otherScore;
      document.getElementById('restart-button').className = 'shown';
    }
  }, 3900);

}

// display stalemate screen
function stalemate() {

  // hide stalemate option
  hideDraw();

  // set end text and box color
  document.getElementById('end-text').innerHTML = 'Stalemate!';
  document.querySelector('.end-box').classList.add('stale');

  // start animation
  const screen = document.getElementById('end-screen');
  screen.classList.remove('hidden');

  // show all scores
  setTimeout(() => {
    const stats = document.getElementsByClassName('stats');
    stats.item(0).classList.add('shown');
    stats.item(1).classList.add('shown');
    document.getElementById('restart-button').className = 'shown';
  }, 2200);

}

// show stalemate option
function showDraw() {
  document.getElementById('stalemate-option').className = '';
}

// hide stalemate option
function hideDraw() {
  document.getElementById('stalemate-option').className = 'hidden';
}