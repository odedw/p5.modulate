/// <reference types="p5/global" />

// constants
// const RADIUS = 100;

// locals
const points = [];
let img;
let lfo1, lfo2, lfo3;

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  //   background(0);
}

function draw() {
  background(0);
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
