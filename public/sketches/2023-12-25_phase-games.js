/// <reference types="p5/global" />
/// <reference path="./src/index.ts" />
P5Capture.setDefaultOptions({
  disableUi: true,
});
// constants
const SIZE = 12;

// locals
const points = [];
let lfos = [];
let numPoints, phaseDelta;
const presets = [
  [8, 0],
  [22, 11],
  [168, 17],
  [42, 15],
  [43, 7],
  [78, 1],
  [27, 16],
  [24, 7],
  [195, 6],
  [112, 3],
];
let presetIndex = 0;
function reset() {
  numPoints = presets[presetIndex][0]; //int(random(10, 200));
  phaseDelta = presets[presetIndex][1]; //int(random(1, 20));
  lfos = [];
  for (let i = 0; i < numPoints; i++) {
    lfos.push(createLfo(LfoWaveform.Sine, LfoTiming.Frames(240, i * phaseDelta), -0.4 * width, 0.4 * width));
  }
}

function setup() {
  createCanvas(600, 600);
  stroke(255);
  noStroke();
  fill(255);
  textSize(16);
  rectMode(CENTER);
  reset();

  // saveGif('2023-12-25_phase-games', 60 * 60, {
  //   units: 'frames',
  // });
}

function draw() {
  // if (frameCount === 1) {
  // const capture = P5Capture.getInstance();
  // capture.start({
  //   format: 'png',
  //   framerate: 60,
  //   quality: 1,
  // });
  // }
  background(0, 0, 0, 100);
  text('num particles: ' + numPoints, 10, 20);
  text('phase delta: ' + phaseDelta, 10, 40);
  translate(0.5 * width, 0.5 * height);
  let a = 0;
  for (const lfo of lfos) {
    const x = lfo.value * cos(a);
    const y = lfo.value * sin(a);
    ellipse(x, y, SIZE, SIZE);
    a += TWO_PI / lfos.length;
  }

  if (frameCount % 360 === 0 && frameCount > 0) {
    presetIndex = (presetIndex + 1) % presets.length;
    reset();
  }

  // const frameName = `2023-12-25_phase-games-${padWithZeros(frameCount, 4)}`;
  // saveCanvas(frameName, 'png');
  if (frameCount >= 61 * 60) {
    noLoop();
    // const capture = P5Capture.getInstance();
    // capture.stop();
  }
}

function padWithZeros(num, length) {
  return String(num).padStart(length, '0');
}

function mouseClicked() {
  presetIndex = (presetIndex + 1) % presets.length;
  reset();
}
