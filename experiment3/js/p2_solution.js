/* exported generateGrid, drawGrid */
/* global placeTile */

// generates the grid 
// Define constants for tile types
const TILE_EMPTY = "_";
const TILE_SOLID = "X";
const TILE_CORNER = "C";
const TILE_TRANSITION = "T";

// overworld generator
// Define the grid generation function with corners and transitions
function generateGrid_ow(numCols, numRows) {
  let grid = [];

  // Generate the grid with empty tiles
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push(TILE_EMPTY);
    }
    grid.push(row);
  }

  // Place solid tiles
  // For example, randomly place solid tiles in the grid
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (Math.random() < 0.3) {
        grid[i][j] = TILE_SOLID;
      }
    }
  }

  // Place corners and transitions
  for (let i = 1; i < numRows - 1; i++) {
    for (let j = 1; j < numCols - 1; j++) {
      let tile = grid[i][j];
      if (tile === TILE_SOLID) {
        // Check the neighbors for corner or transition placement
        let neighborCodes = [
          gridCode(grid, i - 1, j, TILE_SOLID), // North
          gridCode(grid, i + 1, j, TILE_SOLID), // South
          gridCode(grid, i, j + 1, TILE_SOLID), // East
          gridCode(grid, i, j - 1, TILE_SOLID)  // West
        ];
        let hasCorner = neighborCodes[0] && neighborCodes[1] && neighborCodes[2] && neighborCodes[3];
        let hasTransition = neighborCodes.filter(code => code).length === 1;

        if (hasCorner) {
          grid[i][j] = TILE_CORNER;
        } else if (hasTransition) {
          grid[i][j] = TILE_TRANSITION;
        }
      }
    }
  }


  return grid;
}

function drawGrid_ow(grid) {
  background(128);
  
  // Calculate the middle section of the grid
  let middleStartX = floor(grid.length / 4); // Start from one-fourth from the left
  let middleEndX = floor(grid.length * 3 / 4); // End three-fourths from the left
  let middleStartY = floor(grid[0].length / 4); // Start from one-fourth from the top
  let middleEndY = floor(grid[0].length * 3 / 4); // End three-fourths from the top
  
  for(let i = middleStartX; i < middleEndX; i++) {
    for(let j = middleStartY; j < middleEndY; j++) {
      if (gridCheck(grid, i, j, "_")) {
        placeTile(i, j, (floor(random(4))), 0);
      } else {
        drawContext(grid, i, j, "_", (floor(random(15))), 0);
      }
    }
  }
}


// // Town generator 
  function generateGrid_town(numCols, numRows) {
    let grid = [];

    // Calculate the center of the grid
    let centerX = Math.floor(numCols / 2);
    let centerY = Math.floor(numRows / 2);

    // Generate the grid with empty tiles
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(TILE_EMPTY);
      }
      grid.push(row);
    }

    // Place solid tiles in a circular pattern
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let distanceToCenter = Math.sqrt(Math.pow(j - centerX, 2) + Math.pow(i - centerY, 2));
        if (distanceToCenter <= Math.min(centerX, centerY) * 0.7) { // Adjust the factor to control the circle size
          grid[i][j] = TILE_SOLID;
        }
      }
    }

    return grid;
  }

  function drawGrid_town(grid) {
    background(128);
  
    // Loop through the entire grid
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (!gridCheck(grid, i, j, "_")) {
          placeTile(i, j, (floor(random(27))), 3);
        } else {
          drawContext(grid, i, j, "_", 27, 3);
        }
      }
    }
  }

// Step 4 autotiling logic (thanks ChatGPT)
function gridCheck(grid,i,j,target){// Check if the location is within the grid boundaries
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    // Check if the value at the location matches the target
    return grid[i][j] === target;
  } else {
    // Location is out of bounds, return false
    return false;
  }
}

function gridCode(grid,i,j,target){
  // Perform gridCheck on the north, south, east, and west neighbors of i, j
  let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;

  // Form a 4-bit code using the north/south/east/west bits
  let code = (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);

  return code;
}

function drawContext(grid, i, j, target, ti, tj) {
// Get the code for the location and target
  let code = gridCode(grid, i, j, target);
  // console.log(code);

  // Use the code as an array index to get the pair of tile offset numbers
  const [tiOffset, tjOffset] = lookup[code];

  // Place the tile at the specified offset from the current location
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}


const lookup = [
  [0, 0], // If all neighbors are not the target
  [0, 1], // If only the west neighbor is the target
  [0, -1], // If only the east neighbor is the target
  [-1, 0], // If only the north neighbor is the target
  [1, 0], // If only the south neighbor is the target
  [1, 1], // If west and south neighbors are the target
  [1, -1], // If east and south neighbors are the target
  [-1, 1], // If west and north neighbors are the target
  [-1, -1], // If east and north neighbors are the target
  [0, 2], // If two tiles to the west are the target
  [0, -2], // If two tiles to the east are the target
  [-2, 0], // If two tiles to the north are the target
  [2, 0], // If two tiles to the south are the target
  [2, 1], // If two tiles to the south and one tile to the west are the target
  [2, -1], // If two tiles to the south and one tile to the east are the target
  [-2, 1] // If two tiles to the north and one tile to the west are the target
];