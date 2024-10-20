/// <reference types="p5/global" />

// constants

// locals
let lfo1;
function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  lfo1 = createLfo(LfoWaveform.Sine, Timing.frames(120), -PI, PI);
  // pixelDensity(1);
  //   background(0);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  rotate(lfo1.value);
  rect(0, 0, 100, 100);
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
