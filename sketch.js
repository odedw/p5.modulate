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
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  //   background(0);
  lfo1 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(12 * 60));
  lfo2 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(6 * 60));
  lfo3 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(4 * 60));
  // saveGif('colors', getTargetFrameRate() * 12, { units: 'frames' });
}

function draw() {
  // background(0);
  noStroke();
  const l = map(lfo1.value, -1, 1, 0, 1);
  const a = map(lfo2.value, -1, 1, -0.4, 0.4);
  const b = map(lfo3.value, -1, 1, -0.4, 0.4);
  let color = new Color('oklab', [l, a, b]);

  background(color.srgb.r * 255, color.srgb.g * 255, color.srgb.b * 255);
  const x1 = 0.3 * width;
  const y1 = map(lfo1.value, -1, 1, 0.7 * height, 0.3 * height);
  const x2 = 0.5 * width;
  const y2 = map(lfo2.value, -1, 1, 0.7 * height, 0.3 * height);
  const x3 = 0.7 * width;
  const y3 = map(lfo3.value, -1, 1, 0.7 * height, 0.3 * height);

  fill(0);
  rect(x1, width / 2, 20, 0.4 * height);
  rect(x2, width / 2, 20, 0.4 * height);
  rect(x3, width / 2, 20, 0.4 * height);
  fill(100);
  stroke(0);
  strokeWeight(1);
  rect(x1, y1, 50, 20);
  rect(x2, y2, 50, 20);
  rect(x3, y3, 50, 20);

  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(13);
  // text(int(r.toString()), x1, y1);
  // text(int(g.toString()), x2, y2);
  // text(int(b.toString()), x3, y3);
  textSize(30);
  text('Red', x1, 0.75 * height);
  text('Green', x2, 0.75 * height);
  text('Blue', x3, 0.75 * height);
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
