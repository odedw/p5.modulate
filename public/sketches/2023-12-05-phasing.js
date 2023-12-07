/// <reference types="p5/global" />
/// <reference path="./src/index.ts" />

const RADIUS = 400;
const STROKE_WEIGHT = 2;
const NUM_PARTICLES = 15;
const particles = [];

function setup() {
  createCanvas(600, 600);
  stroke(255);
  strokeWeight(STROKE_WEIGHT);
  noFill();
  rectMode(CENTER);
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      sizeLfo: createLfo(LfoWaveform.Sine, LfoTiming.Frames(600), 0, RADIUS, i * 10),
      rotationLfo: createLfo(LfoWaveform.Sine, LfoTiming.Frames(600), 0, TWO_PI, i * 10),
    });
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  for (const p of particles) {
    push();
    rotate(p.rotationLfo.value);
    square(0, 0, p.sizeLfo.value);
    pop();
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
