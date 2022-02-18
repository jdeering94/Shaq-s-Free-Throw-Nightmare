const grid = document.querySelector('.gamegrid');

const width = 20;
const gridCellCount = width * width;
const cells = [];

let spaceshipPosition = 389;

// Grid creation
function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div');
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

  removeSpaceship();
  switch (event.keyCode) {
    case 39:
      if (x < width - 1) spaceshipPosition++;
      break;
    case 37:
      if (x > 0) spaceshipPosition--;
      break;
    case 32:
      console.log('firin ma lasar');
      fireLaser();
      break;
    default:
      console.log('invalid input');
  }
  addSpaceship();
}
addEventListener('keyup', handleKey);

let firing = false;

function fireLaser() {
  let firePosition = spaceshipPosition;
  if (firing === false) {
    const firingId = setInterval(LaserMoving, 30);
    function LaserMoving() {
      let y = Math.floor(firePosition / width);
      if (y === 0) {
        clearInterval(firingId);
        cells[firePosition].classList.remove('laser');
        firing = false;
      } else {
        cells[firePosition].classList.remove('laser');
        cells[firePosition - width].classList.add('laser');
        firePosition -= width;
      }
    }
    // the firing variable is used so that you can only fire one laser at a time
    firing = true;
    console.log('firing');
  }
}

// need to add laser firing capability
// likley need a function that adds a class to the cell spaceshipPostition - width

// let y = Math.floor(spaceshipPosition / width);
// this will be used later for aliens
// note: we need to have that defined within the function ok
