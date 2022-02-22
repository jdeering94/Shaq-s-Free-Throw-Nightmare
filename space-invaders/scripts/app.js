const grid = document.querySelector('.gamegrid');

const startMovement = document.querySelector('button');
const score = document.querySelector('.score');

const width = 20;
const gridCellCount = width * width;
const cells = [];
let alienArray = [
  44, 46, 48, 50, 52, 54, 83, 85, 87, 89, 91, 93, 95, 124, 126, 128, 130, 132,
  134,
];

let spaceshipPosition = 389;

let gameStarted = false;

// Grid creation
// this also sets the starting locations of the aliens
function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div');
    if (alienArray.includes(i)) {
      cell.classList.add('alien');
    }
    cell.setAttribute('data-id', i);
    cells.push(cell);
    grid.appendChild(cell);
  }
}

createGrid();

// functions that can govern spaceship movement
function addSpaceship() {
  cells[spaceshipPosition].classList.add('spaceship');
}

function removeSpaceship() {
  cells[spaceshipPosition].classList.remove('spaceship');
}

addSpaceship();
// This function to create spaceship movement

function handleKey(event) {
  let x = spaceshipPosition % width;
  if (gameStarted === true) {
    removeSpaceship();
    switch (event.keyCode) {
      case 39:
        if (x < width - 1) spaceshipPosition++;
        break;
      case 37:
        if (x > 0) spaceshipPosition--;
        break;
      case 90:
        fireLaser();
        break;
      default:
        console.log('invalid input');
    }
    addSpaceship();
  } else {
    console.log('start the game');
  }
}
addEventListener('keyup', handleKey);

// the firing variable is used so that you can only fire one laser at a time
let firing = false;

function fireLaser() {
  let firePosition = spaceshipPosition;
  console.log(firePosition);

  if (firing === false) {
    const firingId = setInterval(LaserMoving, 30);
    function LaserMoving() {
      let y = Math.floor(firePosition / width);
      let alienIndex = alienArray.indexOf(firePosition);
      // case for laser hitting boundary
      if (y === 0) {
        clearInterval(firingId);
        cells[firePosition].classList.remove('laser');
        firing = false;
        // the case for laser hitting alien
      } else if (cells[firePosition].classList.contains('alien')) {
        clearInterval(firingId);
        console.log(`hit at ${firePosition}`);
        score.innerHTML = parseInt(score.innerHTML) + 5;
        cells[firePosition].classList.remove('laser');
        cells[firePosition].classList.remove('alien');
        alienArray.splice(alienIndex, 1);
        firing = false;
        // case for laser moving
      } else {
        cells[firePosition].classList.remove('laser');
        cells[firePosition - width].classList.add('laser');
        firePosition -= width;
      }
    }
    firing = true;
    console.log('firing');
  }
}

// Below is for alien swarm movement
// It still speeds up whenever laser is fired
let swarmStart;

function alienMovement() {
  if (gameStarted === true) {
    swarmStart = setInterval(moveAliens, 500);
  }
}

function moveAliens() {
  if (alienArray.length === 0) {
    clearInterval(swarmStart);
    winScreen();
  } else if (
    alienArray.some((element) => Math.floor(element / width) === width - 1)
  ) {
    clearInterval(swarmStart);
    console.log('Game Over');
  } else if (
    alienArray.some((element) => element % width === width - 1) === true &&
    alienMotion === true
  ) {
    moveDown();
    alienMotion = false;
  } else if (alienMotion === true) {
    moveRight();
  } else if (
    alienArray.some((element) => element % width === 0) === true &&
    alienMotion === false
  ) {
    moveDown();
    alienMotion = true;
  } else if (alienMotion === false) {
    moveLeft();
  }
}

// bug was caused by spacebar interacting with the button ater it is clicked

let alienMotion = true;

// main issue at the moment is to be able to loop through the entire array for options 1 and 3
// at the moment it only adjusts for one block, instead of the whole array
// maybe I can write a foreach function to perform on option 1 and 3? then changes the alienMotion to true or false and it keeps going?

function moveDown() {
  for (let x = 0; x < alienArray.length; x++) {
    removeAlien(x);
    alienArray[x] = alienArray[x] + width;
    console.log('move down');
    addAlien(x);
  }
}
function moveRight() {
  for (let x = 0; x < alienArray.length; x++) {
    dropBomb();
    removeAlien(x);
    alienArray[x] = alienArray[x] + 1;
    console.log('move right');
    addAlien(x);
  }
}

function moveLeft() {
  for (let x = 0; x < alienArray.length; x++) {
    dropBomb();
    removeAlien(x);
    alienArray[x] = alienArray[x] - 1;
    console.log('move left');
    addAlien(x);
  }
}

// Need to run a bomb function on each enemey
// I guess I can add on for each option
// need to create a bomb class that moves as the laser goes downwards

let droppingBomb;

function dropBomb() {
  let chanceOfBomb = Math.floor(Math.random() * 100);
  let bombSource = Math.floor(Math.random() * alienArray.length + 1);
  let bombPosition = alienArray[bombSource];
  if (chanceOfBomb === 32) {
    droppingBomb = setInterval(bombDropping, 200);
    function bombDropping() {
      console.log(`bomb dropped at ${bombPosition}`);
      let y = Math.floor(bombPosition / width);
      if (
        cells[bombPosition].classList.contains('spaceship') &&
        cells[bombPosition].classList.contains('bomb')
      ) {
        clearInterval(droppingBomb);
        console.log(`hit at ${bombPosition}`);
        cells[bombPosition].classList.remove('bomb');
        cells[bombPosition].classList.remove('spaceship');
        gameOver();
        // case for bomb moving
      } else if (y === width - 1) {
        cells[bombPosition].classList.remove('bomb');
      } else {
        cells[bombPosition].classList.remove('bomb');
        cells[bombPosition + width].classList.add('bomb');
        bombPosition += width;
      }
    }
    console.log('dropping bomb');
  }
}

function startGame() {
  gameStarted = true;
  alienMovement();
}

startMovement.addEventListener('click', startGame);

function removeAlien(i) {
  cells[alienArray[i]].classList.remove('alien');
}
function addAlien(i) {
  cells[alienArray[i]].classList.add('alien');
}

function winScreen() {
  console.log('WINNER');
  clearInterval(swarmStart);
  gameStarted = false;
}

function gameOver() {
  console.log('LOSER');
  clearInterval(swarmStart);
  gameStarted = false;
  grid.classList.add('hidden');
}
