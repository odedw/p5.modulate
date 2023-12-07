/// <reference types="p5/global" />
/// <reference path="./src/index.ts" />

// constants
const SIZE = 10;
const NUM_PARTICLES = 100;
// locals
const lfos = [];

function setup() {
  createCanvas(600, 600);
  stroke('#F34A7A');
  background(0);
  noFill();
  for (let index = 0; index < NUM_PARTICLES; index++) {
    lfos.push(createLfo(LfoWaveform.Sawtooth, LfoTiming.Frames(3 * getTargetFrameRate() * (index + 1)), 0, TWO_PI));
  }
  rectMode(CENTER);
}

function draw() {
  background(0, 0, 0, 3);
  translate(width / 2, height / 2);
  let size = SIZE;
  for (lfo of lfos) {
    push();
    rotate(lfo.value);
    square(0, 0, size);
    pop();
    size += 2 * Math.sqrt((size ^ 2) + (size ^ 2));
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
