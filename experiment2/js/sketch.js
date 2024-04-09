// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let seed = 0;

const houseColor = "#fa961a";
const treeColor = "#507c01";
const skyColor = "#90b0c9";
const rocksColor = "#698092";
const grassColor = "#2e8100";

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// listener for reimagine button
$("#reimagine").click(function() {
  seed++;
});

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  background(100);

  // grabbing from example code
  noStroke();

  fill(skyColor);
  rect(0, 0, width, height / 2);

  fill(grassColor);
  rect(0, height / 2, width, height / 2);
  
  fill(rocksColor);
  beginShape();
  vertex(0, height / 2);
  const steps = 5;
  
  // adapted from wes's experiment 2 code
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y =
      height / 2 - (random() * height) / 4 - height / 4;
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape(CLOSE);
  
  fill(treeColor);
  const trees = 25*random();
  const scrub = mouseX/width;
  for (let i = 0; i < trees; i++) {
    let z = random();
    let x = width * ((random() + (scrub/50 + millis() / 500000.0) / z) % 1);
    let s = width / 50 / z;
    let y = height / 2 + height / 20 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }

  // freestyling the house? (based off triangles)
  fill(houseColor);
  const house = 1;
  const move = mouseX/width;
  for (let i = 0; i < house; i++) {
    let z = random();
    let x = width * ((random() + (move/50 + millis() / -100000.0) / z) % 1);
    let s = width / 50 / z;
    let y = height / 2 + height / 20 / z;
    rect(x, y - s, x - s / 4, y);
  }
}