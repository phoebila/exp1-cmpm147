"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
let img;
let c;

let creatureX = 0; // Initial x-coordinate of the creature
let creatureY = 0; // Initial y-coordinate of the creature
let wormOpacity = 255; // Initial opacity of the worm

function p3_preload() {  
}

function p3_setup() {
}

let worldSeed;
let captureLocations;
let ego;

function p3_worldKeyChanged(key) {
  // Calculate the xxhash of the input string
  let hash = XXH.h32(key, 0xCAFEBABE); // from chatgpt
  worldSeed = hash;
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  
  // from wes's example
  captureLocations = {};
  ego = { i: 0, j: 0, altitude: 0 };
  captureLocations[[ego.i, ego.j]] = true; // start location should be clear

  camera_offset.x = -width / 2 + 4 * tw;
  camera_offset.y = height / 2 - 2 * th;
}

function p3_tileWidth() {
  return 64;
}
function p3_tileHeight() {
  // return 20;
  let height = Math.sin(6 * 0.1) * Math.cos(4 * 0.1) * 20;
  return height;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  // clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
  background(255, 235, 205); 
}

let windSpeed = 0.01; // Base speed of the wind effect

function drawCreature(x, y, size) {
  // Set worm color with opacity
  fill(255, 192, 203, wormOpacity); // Light pink color for the worm with opacity

  // Draw the worm body segments
  let numSegments = 10; // Number of segments in the worm
  let segmentWidth = size / numSegments; // Width of each segment
  let segmentHeight = size / 4; // Height of each segment
  let gap = 1.5; // Gap between segments

  for (let i = 0; i < numSegments; i++) {
    let segmentX = x + i * (segmentWidth + gap);
    let segmentY = y - segmentHeight / 2 + noise(segmentX * 0.01, y * 0.01) * 10; // Add some randomness to the y-coordinate
    
    // Draw the segment
    ellipse(segmentX, segmentY, segmentWidth, segmentHeight);
  }

}

function moveCreatureRandomly() {

  // Fade in and out effect
  let fadeDuration = 100; // Duration of fade effect in milliseconds
  let fadeOutDuration = 20000; // Duration of fade out effect in milliseconds
  let fadeInTime = millis(); // Time when the fade in effect started

  // Define a function to update the worm's opacity based on the current time
  function updateOpacity() {
    let currentTime = millis();
    let elapsed = currentTime - fadeInTime;

    // Check if the fade in or fade out effect should be applied
    if (elapsed < fadeDuration) {
      // Fade in effect
      wormOpacity = map(elapsed, 0, fadeDuration, 0, 255); // Map elapsed time to opacity
    } else if (elapsed < fadeDuration + fadeOutDuration) {
      // Fade out effect
      let fadeOutElapsed = currentTime - (fadeInTime + fadeDuration);
      wormOpacity = map(fadeOutElapsed, 0, fadeOutDuration, 255, 0); // Map elapsed time to opacity
    } else {
      // Ensure opacity remains 0 after fade out effect
      wormOpacity = 0;
    }
  }

  // Call the updateOpacity function continuously using p5.js' loop
  loop();
  let opacityInterval = setInterval(updateOpacity, 30); // Call updateOpacity every 30 milliseconds

  // Stop calling updateOpacity after the fadeDuration + fadeOutDuration has elapsed
  setTimeout(() => {
    clearInterval(opacityInterval);
    noLoop(); // Stop the loop after the fade effect is complete
  }, fadeDuration + fadeOutDuration);
}

function p3_drawTile(i, j) {
  noStroke();
  
  // Use noise and millis to create dynamic effects (thanks ChatGPT!)
  let time = millis() * .001;
  // let noiseVal = noise(i * 0.1, j * 0.1, time);
  let noiseVal1 = noise(i * 0.1, j * 0.1, time);
  let noiseVal2 = noise(i * .001, j * .001, time);
  
  // Modify the wind effect based on mouseX
  let windEffect = windSpeed * (mouseX + width*1.5);  
  // console.log(windEffect)
  // Calculate the tile color based on noise and wind effect
  let r = 237 + noiseVal1 * 50;
  let g = 201 + noiseVal1 * 50;
  let b = 175 - windEffect + noiseVal2 * 50;
  let tileColor = color(r, g, b);

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(tileColor);
  } else {
    fill(tileColor);
  }
  
  push();

  // Calculate the y-offset for shifting the tile
  let yOffset = map(noiseVal1, 0, 1, -10, 10); // Adjust the range of offset as needed
  
  // Define vertices for the front face of the tile with shifted y-coordinates
  let frontX1 = -tw;
  let frontY1 = yOffset;
  let frontX2 = 0;
  let frontY2 = th + yOffset;
  let frontX3 = tw;
  let frontY3 = yOffset;
  let frontX4 = 0;
  let frontY4 = -th + yOffset;
  
  // Define vertices for the back face of the tile (extruded)
  let backX1 = frontX1;
  let backY1 = frontY1 - -1;
  let backX2 = frontX2;
  let backY2 = frontY2 - -1;
  let backX3 = frontX3;
  let backY3 = frontY3 - -1;
  let backX4 = frontX4;
  let backY4 = frontY4 - -2;

  beginShape();
  vertex(frontX1, frontY1);
  vertex(frontX2, frontY2);
  vertex(frontX3, frontY3);
  vertex(frontX4, frontY4);
  endShape(CLOSE);

  // Draw the sides of the tile
  beginShape();
  vertex(frontX1, frontY1);
  vertex(frontX2, frontY2);
  vertex(backX2, backY2);
  vertex(backX1, backY1);
  endShape(CLOSE);

  beginShape();
  vertex(frontX2, frontY2);
  vertex(frontX3, frontY3);
  vertex(backX3, backY3);
  vertex(backX2, backY2);
  endShape(CLOSE);

  beginShape();
  vertex(frontX3, frontY3);
  vertex(frontX4, frontY4);
  vertex(backX4, backY4);
  vertex(backX3, backY3);
  endShape(CLOSE);

  beginShape();
  vertex(frontX4, frontY4);
  vertex(frontX1, frontY1);
  vertex(backX1, backY1);
  vertex(backX4, backY4);
  endShape(CLOSE);
  
  // Check if the current tile matches the creature's coordinates
  if (i === creatureX && j === creatureY) {
    // Calculate the coordinates of the tile's center
    let centerX = i * tw;
    let centerY = j * th;

    // Set the size of the creature (adjust as needed)
    let creatureSize = min(tw, th) * 10;

    // Draw the creature atop the tile
    drawCreature(centerX, centerY, creatureSize);
  }
  
  moveCreatureRandomly()
  
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
    
  }

  pop();
}



function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 102, 0, 51);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  
  // text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  
}


