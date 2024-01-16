/// <reference types="p5/global" />

// constants

// locals
let particles = [];
let count = 0;
let unsuccesful = 0;
let neighborOrderY, neighborOrderX;

function randomizeNeighborOrder() {
  neighborOrderX = [-1, 0, 1].toSorted(() => Math.random() - 0.5);
  neighborOrderY = [-1, 0, 1].toSorted(() => Math.random() - 0.5);
}
function reset() {
  unsuccesful = 0;
  particles = [];
  randomPalette();
  stroke(255);
  rectMode(CENTER);
  noFill();
  strokeWeight(1);
  background(0);
  pixelDensity(1);
  while (particles.length < 10000) {
    const x = int(random(width));
    const y = int(random(height));
    if (particles.find((p) => p.x === x && p.y === y)) {
      continue;
    }
    const p = { x, y, c: random(PALETTE) };
    stroke(p.c);
    point(p.x, p.y);
    particles.push(p);
  }
  randomizeNeighborOrder();
  background(0);
}

function setup() {
  createCanvas(700, 700);
  reset();
}

function getNeighbors(x, y) {
  const neighbors = [];

  neighborOrderX.forEach((i) => {
    neighborOrderY.forEach((j) => {
      const nx = x + i;
      const ny = y + j;
      if (nx === x && ny === y) {
        return;
      }
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
        return;
      }
      neighbors.push({ x: nx, y: ny });
    });
  });
  return neighbors;
}
function draw() {
  loadPixels();
  const current = particles[int(random(particles.length))];
  for (let i = 0; i < 1000; i++) {
    const { x, y, c } = current;
    let neighbors = getNeighbors(x, y); //.toSorted(() => Math.random() - 0.5);
    for (const n of neighbors) {
      const index = (n.y * width + n.x) * 4;
      let found = false;
      if (
        (pixels[index] === 0 && pixels[index + 1] === 0 && pixels[index + 2] === 0) ||
        (pixels[index] === 255 && pixels[index + 1] === 255 && pixels[index + 2] === 255)
      ) {
        pixels[index] = red(c);
        pixels[index + 1] = green(c);
        pixels[index + 2] = blue(c);
        pixels[index + 3] = 255;
        current.x = n.x;
        current.y = n.y;
        found = true;
        count++;

        break;
      }

      if (!found) {
        const x = int(random(width));
        const y = int(random(height));
        const index = (y * width + x) * 4;
        if (
          (pixels[index] === 0 && pixels[index + 1] === 0 && pixels[index + 2] === 0) ||
          (pixels[index] === 255 && pixels[index + 1] === 255 && pixels[index + 2] === 255)
        ) {
          current.x = x;
          current.y = y;
          // p.c = pg.get(x, y);
          pixels[index] = red(c);
          pixels[index + 1] = green(c);
          pixels[index + 2] = blue(c);
          pixels[index + 3] = 255;
          count++;
        } else {
          unsuccesful++;
        }
      }
    }
  }
  updatePixels();

  if (unsuccesful >= 1200000) {
    reset();
  }
}

P5Capture.setDefaultOptions({
  disableUi: true,
  format: 'mp4',
  quality: 1,
  framerate: 60,
});
