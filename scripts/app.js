// DOM elements
const grid = document.querySelector('.gamegrid');
const soundEffect = document.querySelector('.soundeffect');
const startMovement = document.querySelector('button');
const reset = document.querySelector('#reset');
const score = document.querySelector('.score');
const livesLeft = document.querySelector('#livesleft');
const finalscreen = document.querySelector('.finalscreen');
const soundtrack = document.querySelector('.soundtrack');
const bombsound = document.querySelector('.bombsound');
const mothershipsound = document.querySelector('.mothershipsound');
const endscreen = document.querySelector('.endscreen');
const wavesLeft = document.querySelector('#wavesleft');

// variables and arrays
const width = 20;
const gridCellCount = width * width;
const cells = [];
let lifeArray = [1, 2, 3];
let alienArray = [
  44, 46, 48, 50, 52, 54, 83, 85, 87, 89, 91, 93, 95, 124, 126, 128, 130, 132,
  134,
];
let wavesArray = [1, 2];
let logoArray = [342, 343, 344, 346, 347, 348, 351, 352, 353, 355, 356, 357];
let sideHoopArray = [39];
let alienSpeed = 750;
let spaceshipPosition = 369;
let gameStarted = false;
let canMove = false;
let alienWin = false;

finalscreen.classList.add('hidden');
livesLeft.innerHTML = lifeArray.length;
wavesLeft.innerHTML = wavesArray.length + 1;

// Grid creation
// this also sets the starting locations of the aliens
function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div');
    if (alienArray.includes(i)) {
      cell.classList.add('alien');
    } else if (logoArray.includes(i)) {
      cell.classList.add('barrier');
    } else if (sideHoopArray.includes(i)) {
      cell.classList.add('sidehoop');
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
  if (canMove === true) {
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
let firingId;

// the improvement to this function is to make it work using arrays
// crate a laser array-then a for loop that evaluates each position of the array
function fireLaser() {
  let firePosition = spaceshipPosition;

  if (firing === false) {
    soundEffect.src = './sounds/catching-basketball.wav';
    soundEffect.play();
    firingId = setInterval(LaserMoving, 100);
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
        score.innerHTML = parseInt(score.innerHTML) + 20;
        soundEffect.src =
          './sounds/mixkit-basketball-ball-hitting-the-net-2084.wav';
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
        score.innerHTML = parseInt(score.innerHTML) + 300;
        soundEffect.src =
          './sounds/mixkit-basketball-ball-hitting-the-net-2084.wav';
        soundEffect.play();
        cells[firePosition].classList.remove('laser');
        cells[firePosition].classList.remove('mothership');
        clearInterval(motherShipLoop);
        mothershipsound.pause();
        mothershipPresent = false;
        firing = false;
      } else if (
        cells[firePosition].classList.contains('bomb') &&
        cells[firePosition].classList.contains('laser')
      ) {
        clearInterval(firingId);
        firing = false;
      } else {
        cells[firePosition].classList.remove('laser');
        cells[firePosition - width].classList.add('laser');
        firePosition -= width;
      }
    }
    firing = true;
  }
}

// Below is for alien swarm movement
let swarmStart;

function alienMovement() {
  if (gameStarted === true) {
    swarmStart = setInterval(moveAliens, alienSpeed);
  }
}

function moveAliens() {
  if (alienArray.length === 0) {
    winScreen();
  } else if (
    alienArray.some((element) => Math.floor(element / width) === width - 2)
  ) {
    alienWin = true;
    gameOver();
  } else if (
    alienArray.some((element) => element % width === width - 1) === true &&
    alienMotion === true
  ) {
    moveDown();
    alienMotion = false;
  } else if (alienMotion === true) {
    moveRight();
    dropBomb();
  } else if (
    alienArray.some((element) => element % width === 0) === true &&
    alienMotion === false
  ) {
    moveDown();
    alienMotion = true;
  } else if (alienMotion === false) {
    moveLeft();
    dropBomb();
  }
}

let alienMotion = true;

function moveDown() {
  for (let x = 0; x < alienArray.length; x++) {
    removeAlien(x);
    alienArray[x] = alienArray[x] + width;
    addAlien(x);
  }
}
function moveRight() {
  for (let x = 0; x < alienArray.length; x++) {
    addMothership();
    removeAlien(x);
    alienArray[x] = alienArray[x] + 1;
    addAlien(x);
  }
}

function moveLeft() {
  for (let x = 0; x < alienArray.length; x++) {
    addMothership();
    removeAlien(x);
    alienArray[x] = alienArray[x] - 1;
    addAlien(x);
  }
}

function removeAlien(i) {
  cells[alienArray[i]].classList.remove('alien');
}
function addAlien(i) {
  cells[alienArray[i]].classList.add('alien');
}

// section governs the bomb functionality
let bombArray = [];

function dropBomb() {
  let chanceOfBomb = Math.floor(Math.random() * 4);
  let bombSource = Math.floor(Math.random() * alienArray.length);
  let bombPosition = alienArray[bombSource];

  if (chanceOfBomb === 3) {
    bombsound.src = './sounds/barkley-turrible.mp3';
    bombsound.play();
    bombArray.push(bombPosition);
    cells[bombPosition].classList.add('alien');
  }
}
setInterval(bombDropping, 350);

function bombDropping() {
  for (let i = 0; i < bombArray.length; i++) {
    if (
      cells[bombArray[i]].classList.contains('spaceship') &&
      cells[bombArray[i]].classList.contains('bomb')
    ) {
      cells[bombArray[i]].classList.remove('bomb');
      bombArray.splice(i, 1);
      gameOver();
    } else if (
      cells[bombArray[i]].classList.contains('laser') &&
      cells[bombArray[i]].classList.contains('bomb')
    ) {
      cells[bombArray[i]].classList.remove('bomb');
      cells[bombArray[i]].classList.remove('laser');
      bombArray.splice(i, 1);
    } else if (Math.floor(bombArray[i] / width) === width - 1) {
      cells[bombArray[i]].classList.remove('bomb');
      bombArray.splice(i, 1);
    } else if (
      cells[bombArray[i]].classList.contains('barrier') &&
      cells[bombArray[i]].classList.contains('bomb')
    ) {
      cells[bombArray[i]].classList.remove('barrier');
      cells[bombArray[i]].classList.remove('bomb');
      bombArray.splice(i, 1);
    } else {
      cells[bombArray[i]].classList.remove('bomb');
      bombArray[i] += width;
      cells[bombArray[i]].classList.add('bomb');
    }
  }
}

// this is to start game on the button click
function startGame() {
  if (gameStarted === false) {
    gameStarted = true;
    alienMovement();
    canMove = true;
    soundtrack.play();
  } else {
    console.log('game is running');
  }
}

startMovement.addEventListener('click', startGame);

function resetGame() {
  location.reload();
}

reset.addEventListener('click', resetGame);

// game win/loss evaluations
function winScreen() {
  if (wavesArray.length === 0) {
    wavesLeft.innerHTML = wavesArray.length;
    clearInterval(swarmStart);
    grid.classList.add('hidden');
    finalscreen.classList.remove('hidden');
    endscreen.classList.add('winscreen');
    gameStarted = false;
    mothershipsound.pause();
    let finalScore = parseInt(score.innerHTML) + lifeArray.length * 100;
    finalscreen.innerHTML = `The Nightmare is over! \n Your Final Score is: ${finalScore}`;
  } else {
    wavesArray.splice(0, 1);
    newWave();
    wavesLeft.innerHTML = wavesArray.length + 1;
  }
}

function gameOver() {
  if (lifeArray.length === 0) {
    gameIsLost();
  } else if (alienWin === true) {
    gameIsLost();
  } else {
    loseLife();
  }
}

function gameIsLost() {
  clearInterval(swarmStart);
  gameStarted = false;
  grid.classList.add('hidden');
  finalscreen.classList.remove('hidden');
  endscreen.classList.add('lossscreen');
  finalscreen.innerHTML = `The Nightmare continues...\nYour Final Score is: ${score.innerHTML}`;
  soundtrack.pause();
  mothershipsound.pause();
  soundEffect.src = './sounds/mixkit-basketball-buzzer-1647.wav';
  soundEffect.play();
}

// mothership function

let motherShipLoop;
let mothershipPresent = false;
let motherPosition;

function addMothership() {
  let mothershipCheck = Math.floor(Math.random() * 300);
  if (mothershipCheck === 3 && mothershipPresent === false) {
    mothershipPresent = true;
    motherPosition = width;
    mothershipsound.play();
    motherShipLoop = setInterval(mothershipTravel, 275);
  }
}
function mothershipTravel() {
  if (motherPosition === 2 * width - 2) {
    soundEffect.src =
      './sounds/mixkit-basketball-ball-hitting-the-net-2084.wav';
    soundEffect.play();
    cells[motherPosition].classList.remove('mothership');
    mothershipPresent = false;
    clearInterval(motherShipLoop);
    mothershipsound.pause();
  } else {
    cells[motherPosition].classList.remove('mothership');
    motherPosition += 1;
    cells[motherPosition].classList.add('mothership');
  }
}

// life points functions
function loseLife() {
  lifeArray.splice(0, 1);
  canMove = false;
  cells[spaceshipPosition].classList.add('shaqhit');
  bombsound.src = './sounds/shaq-why2.aiff';
  bombsound.play();
  setTimeout(hitShaq, 500);
  livesLeft.innerHTML = lifeArray.length;
}

function hitShaq() {
  cells[spaceshipPosition].classList.remove('shaqhit');
  canMove = true;
}

// function to refresh the wave
function newWave() {
  alienArray = [
    44, 46, 48, 50, 52, 54, 83, 85, 87, 89, 91, 93, 95, 124, 126, 128, 130, 132,
    134,
  ];
  alienSpeed -= 250;
  console.log(alienSpeed);
}
