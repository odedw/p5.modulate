/// <reference types="p5/global" />

// constants
const NUM_COLS = 5;
const NUM_ROWS = 5;

// locals
const rects = [];
let img, pg;

let segment;
function generateParameters() {
  return {
    a: random(0.03, 0.5) * (Math.random() < 0.5 ? -1 : 1),
    b: random(0.05, 0.5) * (Math.random() < 0.5 ? -1 : 1),
    c: random(0.03, 0.5) * (Math.random() < 0.5 ? -1 : 1),
    d: random(0.05, 0.5) * (Math.random() < 0.5 ? -1 : 1),
    m: random(1.5, 3),
    chance: random(),
  };
}
function preload() {
  img = loadImage('public/assets/ThePinkCloud_HenriEdmondCross.jpg');
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  pixelDensity(1);
  // divide into rects
  const w = width / NUM_COLS;
  const h = height / NUM_ROWS;
  for (let x = 0; x < width; x += w) {
    for (let y = 0; y < height; y += h) {
      const numParameters = int(random(1, 4));
      const parameters = [];
      for (let i = 0; i < numParameters; i++) {
        parameters.push(generateParameters());
      }
      rects.push({ x, y, w, h, parameters });
    }
  }

  pg = createGraphics(width, height);
  pg.image(img, 0, 0, width, height);
}

function wobbly(parameters, x, y) {
  let sum = 0;
  const { r, a } = cartesianToPolar(x - width / 2, y - height / 2);
  for (const p of parameters) {
    sum += sin(
      p.a * (p.chance < 0.6 ? x : r) + p.b * frameCount + p.m * sin(p.c * (p.chance < 0.6 ? y : a) + p.d * frameCount)
    );
  }

  const col = map(sum, -1, 1, -2, 2);
  return col;
}
function draw() {
  image(img, 0, 0, width, height);

  loadPixels();
  pg.loadPixels();
  let rectIndex = 0;
  for (const r of rects) {
    rectIndex++;

    const { x, y, w, h, parameters } = r;
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j += 1) {
        // calculate index
        const index = (i + j * width) * 4;
        const mValue = int(wobbly(parameters, i, j));
        const newIndex = index + mValue;
        const col = map(mValue, -1, 1, 0.5, 1);
        // // set color
        pixels[index + 0] = pg.pixels[newIndex + 0] * col;
        pixels[index + 1] = pg.pixels[newIndex + 1] * col;
        pixels[index + 2] = pg.pixels[newIndex + 2] * col;
        pixels[index + 3] = 255;
      }
    }
  }
  updatePixels();
}

P5Capture.setDefaultOptions({
  disableUi: true,
  // format: 'png',
  // quality: 1,
  // framerate: 60,
});
