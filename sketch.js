/// <reference types="p5/global" />

// constants
const SIZE = 128;
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

  // pixelDensity(1);
  //   background(0);
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
      // distance between the colors
      const diff = dist(red(c), green(c), blue(c), red(prevC), green(prevC), blue(prevC)) / 255;
      // console.log(x, y);
      if (diff > DIFF_THRESHOLD) {
        const current = matrix.get(x, y);
        matrix.set(x, y, (current + 1) % PALETTE.length);
      }

      push();
      translate(x * brickW + brickW / 2, y * brickH + brickH / 2);
      fill(PALETTE[matrix.get(x, y)]);
      noStroke();

      rect(0, 0, brickW, brickH);
      // ellipse((x * width) / SIZE, (y * height) / SIZE, (b * width) / SIZE, (b * height) / SIZE);

      pop();
    }
  }
  // drawBrick(width / 2, height / 2, 100, 100, color(255, 0, 0));
}

function drawBrick(x, y, w, h, c, highlight) {}

let isLooping = true;
let row, col;
function mouseClicked() {
  // get the square
  // const x = mouseX;
  // const y = mouseY;
  // row = Math.floor(y / brickH);
  // col = Math.floor(x / brickW);
  randomPalette();
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      matrix.set(x, y, 0);
    }
  }

  // if (isLooping) {
  //   noLoop();
  // } else {
  //   loop();
  // }

  // isLooping = !isLooping;
}

// P5Capture.setDefaultOptions({
//   disableUi: true,
//   format: 'mp4',
//   quality: 1,
//   framerate: 60,
// });
