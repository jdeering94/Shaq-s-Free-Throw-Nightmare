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
// need to try and convert it to a for loop that has a timeout
let firing = false;
// All below is an attempt to do it without setInterval
// function checkTimeOut(i) {
//   console.log(i);
// }

// function setDelay() {
//   for (let v = 0; v < 19; v++) {
//     setTimeout(checkTimeOut(v), 3000);
//   }
// }

// function fireLaser() {
//   if (firing === false) {
//     setDelay();

//     console.log('firing');
//   }
// }

// function LaserMoving() {
//   console.log('laserMoving is working');
//   let firePosition = spaceshipPosition;
//   let y = Math.floor(firePosition / width);
//   let alienIndex = alienArray.indexOf(firePosition);
//   // case for laser hitting boundary
//   if (y === 0) {
//     cells[firePosition].classList.remove('laser');
//     firing = false;
//     return;
//     // the case for laser hitting alien
//   } else if (cells[firePosition].classList.contains('alien')) {
//     console.log(`hit at ${firePosition}`);
//     score.innerHTML = parseInt(score.innerHTML) + 5;
//     cells[firePosition].classList.remove('laser');
//     cells[firePosition].classList.remove('alien');
//     alienArray.splice(alienIndex, 1);
//     firing = false;
//     return;
//     // case for laser moving
//   } else {
//     cells[firePosition].classList.remove('laser');
//     cells[firePosition - width].classList.add('laser');
//     firePosition -= width;
//   }
// }

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

// this will be used later for aliens
// note: we need to have that defined within the function

// time to build the swarm
// need to set an array that is the inital starting positions of the aliens
// this was done in the grid creation
// what if I do one big setinterval that just does movement
// and then within the movement function I define the direction and cases for change of direction

function alienMovement() {
  if (gameStarted === true) {
    const swarmStart = setInterval(moveAliens, 500);
    function moveAliens() {
      if (
        alienArray.some((element) => Math.floor(element / width) === width - 1)
      ) {
        clearInterval(swarmStart);
      } else if (
        alienArray.some((element) => element % width === width - 1) === true &&
        alienMotion === true
      ) {
        option1();
        alienMotion = false;
      } else if (alienMotion === true) {
        option2();
        console.log('option 2');
      } else if (
        alienArray.some((element) => element % width === 0) === true &&
        alienMotion === false
      ) {
        option3();
        alienMotion = true;
        console.log('option 3');
      } else if (alienMotion === false) {
        option4();
        console.log('option 4');
      }
    }
  }
}

// let alienMotion = true;

// function alienMovementCheck() {
//   alienArray.forEach((element) => alienMovement(element));
// }

// function alienMovement(element) {
//   let alienX = element % width;
//   if (alienMotion === true && alienX === width - 1) {
//     element += width;
//     alienMotion = false;
//     console.log(alienArray);
//   } else if (alienMotion === true) {
//     element++;
//     console.log('move right');
//     alienArray.forEach((element) => element++);
//     console.log(alienArray[0]);
//   } else if (alienX === 0 && alienMotion === false) {
//     element += width;
//     alienMotion = true;
//   } else if (alienMotion === false) {
//     element--;
//     console.log('move left');
//   }
// }

let alienMotion = true;

// main issue at the moment is to be able to loop through the entire array for options 1 and 3
// at the moment it only adjusts for one block, instead of the whole array
// maybe I can write a foreach function to perform on option 1 and 3? then changes the alienMotion to true or false and it keeps going?

function option1() {
  for (let x = 0; x < alienArray.length; x++) {
    removeAlien(x);
    alienArray[x] = alienArray[x] + width;
    console.log('move down');
    addAlien(x);
  }
}
function option2() {
  for (let x = 0; x < alienArray.length; x++) {
    dropBomb();
    removeAlien(x);
    alienArray[x] = alienArray[x] + 1;
    console.log('move right');
    addAlien(x);
  }
}

function option3() {
  for (let x = 0; x < alienArray.length; x++) {
    removeAlien(x);
    alienArray[x] = alienArray[x] + width;
    console.log('move down');
    addAlien(x);
  }
}
function option4() {
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
// need to create a bomb class that moves as the laser does downwards

function dropBomb() {
  let chanceOfBomb = Math.floor(Math.random() * 100);
  let bombSource = Math.floor(Math.random() * alienArray.length + 1);
  let bombPosition = alienArray[bombSource];
  if (chanceOfBomb === 32) {
    const droppingBomb = setInterval(bombDropping, 200);
    function bombDropping() {
      console.log('bomb dropped');
      console.log(bombPosition);
      let y = Math.floor(bombPosition / width);
      // case for bomb hitting boundary
      if (y === 20) {
        cells[bombPosition].classList.remove('bomb');
        clearInterval(droppingBomb);

        // the case for bomb hitting spaceship
      } else if (
        cells[bombPosition].classList.contains('spaceship') &&
        cells[bombPosition].classList.contains('bomb')
      ) {
        clearInterval(droppingBomb);
        console.log(`hit at ${bombPosition}`);
        cells[bombPosition].classList.remove('bomb');
        cells[bombPosition].classList.remove('spaceship');
        // case for bomb moving
      } else {
        cells[bombPosition].classList.remove('bomb');
        cells[bombPosition + width].classList.add('bomb');
        bombPosition += width;
      }
    }
    console.log('dropping bomb');
  }
}

// function findCell(element) {
//   cells[cells.findIndex(element)]
// }

function startGame() {
  gameStarted = true;
  alienMovement();
}

startMovement.addEventListener('click', startGame);

// function removeAlien(element) {
//   alienArray[
//     alienArray.findIndex((element) => element === element)
//   ].classList.remove('alien');
// }

// function addAlien(element) {
//   alienArray[
//     alienArray.findIndex((element) => element === element)
//   ].classList.add('alien');
// }

// function removeAlien() {
//   cells[alienPosition].classList.remove('alien');
// }

// do I need a remove alien function that targest the cells[findindexof the value from alienArray]

function removeAlien(i) {
  cells[alienArray[i]].classList.remove('alien');
}
function addAlien(i) {
  cells[alienArray[i]].classList.add('alien');
}

// need a function that checks through the gamegrid array, and checks for classList alien
// if it does contain alien, needs to perform alienmotion function on it
// alienArray.forEach((element) => element.classList.remove('alien'));
// this command allows us to alter the divs tha the aliens occupy
// need to be able to pass this into the alienMovement function somehow

// above doesn't contribute anything

// console.log(`this is ${alienArray[alienArray.findIndex(42)]}`);

// console.log(alienArray.findIndex((element) => element === element));

// What I need to be able to to
// need to be able to for each cell, remove the classList alien
// then I need to change the position of the cell by an increment
// then I need to re add the classList alien
