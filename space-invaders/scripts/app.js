const grid = document.querySelector('.gamegrid');
const soundEffect = document.querySelector('.soundeffect');
const startMovement = document.querySelector('button');
const score = document.querySelector('.score');
const livesLeft = document.querySelector('#livesleft');
const width = 20;
const gridCellCount = width * width;
const cells = [];
let lifeArray = [1, 2, 3];
let alienArray = [
  44, 46, 48, 50, 52, 54, 83, 85, 87, 89, 91, 93, 95, 124, 126, 128, 130, 132,
  134,
];

livesLeft.innerHTML = lifeArray.length;

let spaceshipPosition = 369;

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
    soundEffect.src = '../sounds/catching-basketball.wav';
    soundEffect.play();
    const firingId = setInterval(LaserMoving, 50);
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
        soundEffect.src =
          '../sounds/mixkit-basketball-ball-hitting-the-net-2084.wav';
        soundEffect.play();
        cells[firePosition].classList.remove('laser');
        cells[firePosition].classList.remove('alien');
        alienArray.splice(alienIndex, 1);
        firing = false;
        // case for laser moving
      } else if (
        cells[firePosition].classList.contains('mothership') &&
        cells[firePosition].classList.contains('laser')
      ) {
        clearInterval(firingId);
        console.log(`hit at ${firePosition}`);
        score.innerHTML = parseInt(score.innerHTML) + 50;
        soundEffect.src =
          '../sounds/mixkit-basketball-ball-hitting-the-net-2084.wav';
        soundEffect.play();
        cells[firePosition].classList.remove('laser');
        cells[firePosition].classList.remove('mothership');
        clearInterval(motherShipLoop);
        mothershipPresent = false;
        firing = false;
      } else if (cells[firePosition].classList.contains('bomb')) {
        cells[firePosition].classList.remove('laser');
        cells[firePosition].classList.remove('bomb');
        clearInterval(droppingBomb);
        clearInterval(firingId);
        firing = false;
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
    addMothership();
    removeAlien(x);
    alienArray[x] = alienArray[x] + 1;
    console.log('move right');
    addAlien(x);
  }
}

function moveLeft() {
  for (let x = 0; x < alienArray.length; x++) {
    dropBomb();
    addMothership();
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
  let chanceOfBomb = Math.floor(Math.random() * 50);
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
        cells[bombPosition].classList.remove('bomb');
        gameOver();
        // case for bomb moving
      } else if (
        cells[bombPosition].classList.contains('laser') &&
        cells[bombPosition].classList.contains('bomb')
      ) {
        clearInterval(droppingBomb);
        cells[bombPosition].classList.remove('bomb');
      } else if (y === width) {
        cells[bombPosition].classList.remove('bomb');
        clearInterval(droppingBomb);
      } else {
        cells[bombPosition].classList.remove('bomb');
        bombPosition += width;
        cells[bombPosition].classList.add('bomb');
      }
    }
    console.log('dropping bomb');
  }
}

function startGame() {
  if (gameStarted === false) {
    gameStarted = true;
    alienMovement();
  } else {
    console.log('game is running');
  }
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
  grid.classList.add('hidden');
  grid.classList.add('winscreen');
  gameStarted = false;
}

function gameOver() {
  if (lifeArray.length === 0) {
    console.log('LOSER');
    clearInterval(swarmStart);
    gameStarted = false;
    grid.classList.add('hidden');
    grid.classList.add('lossscreen');
  } else {
    loseLife();
  }
}

// want to try and add a mothership

let motherShipLoop;
let mothershipPresent = false;
let motherPosition;

function addMothership() {
  let mothershipCheck = Math.floor(Math.random() * 5);
  if (mothershipCheck === 3 && mothershipPresent === false) {
    mothershipPresent = true;
    motherPosition = width;
    motherShipLoop = setInterval(mothershipTravel, 1000);
  }
}
function mothershipTravel() {
  if (motherPosition === 2 * width - 1) {
    cells[motherPosition].classList.remove('mothership');
    mothershipPresent = false;
    console.log(mothershipPresent);
    clearInterval(motherShipLoop);
  } else {
    cells[motherPosition].classList.remove('mothership');
    motherPosition += 1;
    cells[motherPosition].classList.add('mothership');
  }
}

// need to implement lives now- 3 lives, everytime you get hit you lose one
// 0 lives left it means game over

function loseLife() {
  console.log('shaq got hit');
  lifeArray.splice(0, 1);
  livesLeft.innerHTML = lifeArray.length;
}
