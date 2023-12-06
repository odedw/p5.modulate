/// <reference types="p5/global" />
/// <reference path="./src/index.ts" />

// constants
// const RADIUS = 100;

// locals
const points = [];
let lfo1, lfo2, lfo3;

function setup() {
  createCanvas(600, 600);
  stroke(255);
  //   background(0);
}

function draw() {
  background(random(255));
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
