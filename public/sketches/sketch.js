/// <reference types="p5/global" />

// constants

// locals

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
