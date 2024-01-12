/// <reference types="p5/global" />

// constants

// locals
let pg, lfo1, lfo2, img;

function preload() {
  img = loadImage('public/assets/ThePinkCloud_HenriEdmondCross.jpg');
}
function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  pixelDensity(1);
  //   background(0);
  lfo1 = createLfo(LfoWaveform.Sine, Timing.frames(300), 100, 100);
  pg = createGraphics(width, height);
  pg.image(img, 0, 0, width, height);
}

function wobbly(r, a, t) {
  const w0 = sin(0.3 * r + 0.04 * t + 2.0 + 1 * sin(0.4 * r + -0.03 * t + 0.0));
  const w1 = sin(0.2 * a + 0.05 * t + 2.8 + 1 * sin(0.5 * a + -0.02 * t + 0.5));
  return w0 + w1;
  // const w0 = sin(0.3 * r + 0.4 * t + 2.0 + 1 * sin(0.4 * a + -0.03 * t + 0.0));
  return w0;
}

function draw() {
  // background(0);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y += 1) {}
  }
  loadPixels();
  // iterate over pixels
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y += 1) {
      // calculate index
      const index = (x + y * width) * 4;

      // // calculate color
      const v = wobbly(x, y, frameCount);
      const c = map(v, -2, 2, 0, 255);
      // // set color
      pixels[index + 0] = c;
      pixels[index + 1] = c;
      pixels[index + 2] = c;
      pixels[index + 3] = 255;
    }
  }

  for (let a = 0; a < TWO_PI; a += TWO_PI / 500) {
    for (let r = 0; r < width / 2; r++) {
      // calculate index
      let { x, y } = polarToCartesian(r, a);
      x = int(x + width / 2);
      y = int(y + height / 2);
      const index = (x + y * width) * 4;

      // // calculate color
      const v = wobbly(r, a, frameCount);
      const c = map(v, -2, 2, 0, 255);
      // // set color
      pixels[index + 0] = c;
      pixels[index + 1] = c;
      pixels[index + 2] = c;
      pixels[index + 3] = 255;
    }
  }
  updatePixels();
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
