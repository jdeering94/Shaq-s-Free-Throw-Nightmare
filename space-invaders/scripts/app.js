const grid = document.querySelector('.gamegrid');

const width = 20;
const gridCellCount = width * width;
const cells = [];

let spaceshipPosition = 389;

function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('data-id', i);
    cells.push(cell);
    grid.appendChild(cell);
  }
}

createGrid();

function addSpaceship() {
  cells[spaceshipPosition].classList.add('spaceship');
}

addSpaceship();
