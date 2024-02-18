/// <reference types="p5/global" />

// constants
const SIZE = 64;
const DIFF_THRESHOLD = 0.1;

// locals
let capture;
let pg, previousFrame;
let ratio;
let brickW;
let brickH;
let matrix = new Matrix(SIZE, SIZE);
let firstFrameRendered = false;
function setup() {
  createCanvas(700, 700);
  noStroke();
  rectMode(CENTER);
  randomPalette();
  setPalette('Arcade');
  pg = createGraphics(SIZE, SIZE);
  previousFrame = createGraphics(SIZE, SIZE);
  capture = createCapture(VIDEO);
  capture.hide();
  pg.scale(-1, 1);
  brickW = width / SIZE;
  brickH = height / SIZE;
}

function draw() {
  background(0);
  const w = pg.height * (capture.width / capture.height);
  const x = -w - (pg.width - w) / 2;
  if (!firstFrameRendered) {
    previousFrame.image(capture, x, 0, w, pg.height);
  } else {
    previousFrame.image(pg, 0, 0, pg.width, pg.height);
  }
  pg.image(capture, x, 0, w, pg.height);
  firstFrameRendered = true;
  for (let x = 0; x < pg.width; x++) {
    for (let y = 0; y < pg.height; y++) {
      const c = pg.get(x, y);
      const prevC = previousFrame.get(x, y);
      const diff = dist(red(c), green(c), blue(c), red(prevC), green(prevC), blue(prevC)) / 255;
      if (diff > DIFF_THRESHOLD) {
        const current = matrix.get(x, y);
        matrix.set(x, y, (current + 1) % PALETTE.length);
        push();
        translate(x * brickW + brickW / 2, y * brickH + brickH / 2);
        fill(PALETTE[matrix.get(x, y)]);
        noStroke();
        ellipse(0, 0, brickW, brickH);
        pop();
      }
    }
  }
}
