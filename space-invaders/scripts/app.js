const grid = document.querySelector('.gamegrid');

const startMovement = document.querySelector('button');

const width = 20;
const gridCellCount = width * width;
const cells = [];
const alienArray = [
  42, 44, 46, 48, 50, 52, 54, 56, 81, 83, 85, 87, 89, 91, 93, 95, 97, 122, 124,
  126, 128, 130, 132, 134, 136,
];

let spaceshipPosition = 389;

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

const aliens = document.querySelectorAll('.alien');
let alienPosition = 50;

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

  removeSpaceship();
  switch (event.keyCode) {
    case 39:
      if (x < width - 1) spaceshipPosition++;
      break;
    case 37:
      if (x > 0) spaceshipPosition--;
      break;
    case 32:
      fireLaser();
      break;
    default:
      console.log('invalid input');
  }
  addSpaceship();
}
addEventListener('keyup', handleKey);

// the firing variable is used so that you can only fire one laser at a time
let firing = false;

function fireLaser() {
  let firePosition = spaceshipPosition;
  if (firing === false) {
    const firingId = setInterval(LaserMoving, 30);
    function LaserMoving() {
      let y = Math.floor(firePosition / width);
      // case for laser hitting boundary
      if (y === 0) {
        clearInterval(firingId);
        cells[firePosition].classList.remove('laser');
        firing = false;
        // the case for laser hitting alien
      } else if (cells[firePosition].classList.contains('alien')) {
        clearInterval(firingId);
        cells[firePosition].classList.remove('laser');
        cells[firePosition].classList.remove('alien');
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

// this will be used later for aliens
// note: we need to have that defined within the function

// time to build the swarm
// need to set an array that is the inital starting positions of the aliens
// this was done in the grid creation
// what if I do one big setinterval that just does movement
// and then within the movement function I define the direction and cases for change of direction

console.log(aliens);
// I guess I can try writing the function for one movement to make sure it works and then adapt
// maybe I can write one interval for it moving to the right, and one interval for it to move to the left
function moveAliens() {
  setInterval(alienMovement, 500);
}

let alienMotion = true;

function alienMovement() {
  let alienX = alienPosition % width;
  if (alienMotion === true && alienX === width - 1) {
    removeAlien();
    alienPosition += width;
    addAlien();
    alienMotion = false;
  } else if (alienMotion === true) {
    removeAlien();
    alienPosition++;
    addAlien();
    console.log('move right');
  } else if (alienX === 0 && alienMotion === false) {
    removeAlien();
    alienPosition += width;
    addAlien();
    alienMotion = true;
  } else if (alienMotion === false) {
    removeAlien();
    alienPosition--;
    addAlien();
    console.log('move left');
  }
}

// can select the id of the square from the gamegrid array, I guess I need to pass through, and for each div
// with a class of alien, perform the alienmovement function

startMovement.addEventListener('click', moveAliens);

function removeAlien() {
  cells[alienPosition].classList.remove('alien');
}

function addAlien() {
  cells[alienPosition].classList.add('alien');
}
