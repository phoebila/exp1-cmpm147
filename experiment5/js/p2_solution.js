/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function p4_inspirations() {
  let inspirations = [
    {
      name: "Palm-Tree",
      assetUrl: "https://cdn.glitch.global/aa0b5776-30ae-4a77-80db-a1037a33188b/pexels-ollivves-1122409.jpg?v=1714748443233",
      credit: "https://www.pexels.com/photo/coconut-tree-under-gray-sky-1122409/",
    },
    {
      name: "Desert",
      assetUrl: "https://cdn.glitch.global/aa0b5776-30ae-4a77-80db-a1037a33188b/pexels-jeremy-bishop-1260133-2923591.jpg?v=1714748446283",
      credit: "https://www.pexels.com/photo/black-and-white-photo-of-sand-dunes-2923591/",
    },
    {
      name: "Zebra",
      assetUrl: "https://cdn.glitch.global/aa0b5776-30ae-4a77-80db-a1037a33188b/pexels-pixabay-39245.jpg?v=1714748450441",
      credit: "https://www.pexels.com/photo/grayscale-photography-of-zebra-39245/",
    }
  ];

  return inspirations;
}

function p4_initialize(inspiration) {

  resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 8);
  
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < 100; i++) {
    design.fg.push({x: random(width),
      y: random(height),
      w: random(width/2),
      h: random(height/2),
      fill: random(255)})
  }
  return design;
}

function p4_render(design, inspiration) {
  background(design.bg);
  noStroke();
  for(let box of design.fg) {
    fill(box.fill, 128);
    ellipse(box.x, box.y, box.w, box.h);
  }
} 

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}

function p4_mutate(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}
