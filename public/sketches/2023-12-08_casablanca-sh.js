/// <reference types="p5/global" />

// constants
const COUNT = 15;
const SIZE = 15;
const MAX_NOISE = 70;

// locals
const points = [];
let lfo1, lfo2, lfo3;
let mySound, amplitude;

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('public/assets/casablanca.mp3');
}
function setup() {
  createCanvas(600, 600);
  stroke(255);
  rectMode(CENTER);
  noFill();
  amplitude = new p5.Amplitude();
  lfo1 = createLfo(LfoWaveform.Noise, LfoTiming.Manual(1), -MAX_NOISE, MAX_NOISE);
  lfo2 = createLfo(LfoWaveform.Noise, LfoTiming.Manual(1), -PI, PI);

  // saveGif('', getTargetFrameRate() * 60, { units: 'frames' });
}

function draw() {
  background(0);
  let level = amplitude.getLevel();
  let rotation = map(level, 0, 1, 0, TWO_PI);
  let startX = (width - 2 * COUNT * (SIZE - 1)) / 2;
  let y = (height - 2 * COUNT * (SIZE - 1)) / 2;

  for (let i = 0; i < COUNT; i++) {
    let x = startX;
    for (let j = 0; j < COUNT; j++) {
      push();
      const distance = dist(x, y, width / 2, height / 2);
      const factor = map(distance, 0, width, 1, 0);
      translate(x + lfo1.step() * level * factor, y + lfo1.step() * level * factor);
      rotate(lfo2.step() * rotation * factor);
      square(0, 0, SIZE);

      pop();
      x += 2 * SIZE;
    }
    y += 2 * SIZE;
  }
}

let isLooping = true;
function mouseClicked() {
  mySound.play();

  // if (isLooping) {
  //   noLoop();
  // } else {
  //   loop();
  // }

  isLooping = !isLooping;
}
