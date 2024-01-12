/// <reference types="p5/global" />

const NUM_BLOBS = 7;
const SIZE = 5;
const SCALE = 1;
const MAX_SQUARES = 100;

let cols, rows;
let grid = [];
let blobs = [];
let squares = [];
let lfo1, lfo2;

class Blob {
  constructor() {
    this.r = random(40, 80);
    this.x = random(this.r, width - this.r);
    this.y = random(this.r, height - this.r);
    this.dx = random(-2, 2);
    this.dy = random(-2, 2);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x >= width || this.x < 0) {
      this.dx *= -1;
    }
    if (this.y >= height || this.y < 0) {
      this.dy *= -1;
    }
  }
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  noFill();
  ellipseMode(RADIUS);
  rectMode(CENTER);
  pixelDensity(1);
  cols = width / SIZE + 1;
  rows = height / SIZE + 1;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }

  for (let i = 0; i < NUM_BLOBS; i++) {
    blobs.push(new Blob());
  }
}

function draw() {
  for (const b of blobs) {
    b.update();
  }

  background(0, 0, 0);

  loadPixels();
  // iterate over pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // calculate index
      const index = (x + y * width) * 4;

      // // calculate color
      const v = sin(0.03 * x + 0.04 * frameCount + 2.0 + 1 * sin(0.04 * y + -0.03 * frameCount + 0.0));
      const c = map(v, -1, 1, 50, 200);
      // // set color
      pixels[index + 0] = c;
      pixels[index + 1] = c;
      pixels[index + 2] = c;
      pixels[index + 3] = 255;
    }
  }

  updatePixels();

  filter(BLUR, 20);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let val = 0;
      for (let k = 0; k < NUM_BLOBS; k++) {
        val +=
          (blobs[k].r * blobs[k].r) /
          ((i * SIZE - blobs[k].x) * (i * SIZE - blobs[k].x) + (j * SIZE - blobs[k].y) * (j * SIZE - blobs[k].y));
      }
      grid[i][j] = val;
      noStroke();
      if (val > 1) {
        fill(random(255), random(255), random(255));

        rect(i * SIZE, j * SIZE, SIZE);
      }
    }
  }
}

let isLooping = true;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }

  isLooping = !isLooping;
}

P5Capture.setDefaultOptions({
  disableUi: true,
});
