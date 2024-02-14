/// <reference types="p5/global" />

// constants

// locals
let capture;
let pg, previousFrame;
let ratio;
let brickW;
let brickH;
let SIZE = 128;
let firstFrameRendered = false;
function setup() {
  createCanvas(700, 700);
  noStroke();
  rectMode(CENTER);
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
      // if (x == col && y == row) {
      //   console.log(diff);
      // }
      const chosenC = diff < 0.05 ? color(0) : c;
      // const b = (red(c) + green(c) + blue(c)) / (255 * 3);
      // fill(c);
      drawBrick(x * brickW + brickW / 2, y * brickH + brickH / 2, brickW, brickH, chosenC, x === col && y === row); //chosenC);

      // ellipse((x * width) / SIZE, (y * height) / SIZE, (b * width) / SIZE, (b * height) / SIZE);
    }
  }
  // drawBrick(width / 2, height / 2, 100, 100, color(255, 0, 0));
}

function drawBrick(x, y, w, h, c, highlight) {
  const ratio = 0.3;
  const dark = color(red(c) * ratio, green(c) * ratio, blue(c) * ratio);
  push();
  translate(x, y);
  fill(c);
  noStroke();
  if (highlight) {
    stroke('yellow');
    strokeWeight(4);
  }
  rect(0, 0, w, h);
  noStroke();
  fill(dark);
  ellipse(-w / 14, w / 14, w / 2 + w / 14, h / 2 + w / 14);

  fill(c);
  stroke(dark);
  strokeWeight(2);
  ellipse(0, 0, w / 2, h / 2);
  pop();
}

let isLooping = true;
let row, col;
function mouseClicked() {
  // get the square
  const x = mouseX;
  const y = mouseY;
  row = Math.floor(y / brickH);
  col = Math.floor(x / brickW);

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
