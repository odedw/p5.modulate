/// <reference types="p5/global" />
/// <reference path="./src/index.ts" />

// constants
const MANUAL_FREQUENCY = 3 * 60;
const NUM_LFOS = 100;
const FREQUENCY = 60;

// locals
const points = [];
let lfo1, lfo2, lfo3;
let circleLfo;
let radius = 0;
let size = 1;
const lfos = [];

function setup() {
  createCanvas(600, 600);
  // stroke(255);
  noStroke();
  fill(255);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < NUM_LFOS; i++) {
    const phase = (i * FREQUENCY) / NUM_LFOS;
    lfos.push(createLfo(LfoWaveform.Sawtooth, LfoTiming.Frames(60), 0, TWO_PI, phase));
  }
  // circleLfo = createLfo(LfoWaveform.Sawtooth, LfoTiming.Frames(60), 0, TWO_PI);
  background(0);
  // lfo1 = createLfo(LfoWaveform.Sine, LfoTiming.Manual(MANUAL_FREQUENCY));
  // lfo2 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(MANUAL_FREQUENCY / 2));

  lfo1 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(12 * 60));
  lfo2 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(6 * 60));
  lfo3 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(4 * 60));
  // saveGif('colors', getTargetFrameRate() * 12, { units: 'frames' });
}

function draw() {
  // background(0);

  const l = map(lfo1.value, -1, 1, 0, 1);
  const a = map(lfo2.value, -1, 1, -0.4, 0.4);
  const b = map(lfo3.value, -1, 1, -0.4, 0.4);

  let color = new Color('oklab', [l, a, b]);
  fill(color.srgb.r * 255, color.srgb.g * 255, color.srgb.b * 255);

  // const r = map(lfo1.value, -1, 1, 0, 255);
  // const g = map(lfo2.value, -1, 1, 0, 255);
  // const b = map(lfo3.value, -1, 1, 0, 255);
  // fill(r, g, b);
  translate(width / 2, height / 2);

  for (const lfo of lfos) {
    const { x, y } = polarToCartesian(radius, lfo.value);
    ellipse(x, y, size, size);
    lfo.frequency.value += 0.01;
  }

  radius += 1;
  size += 0.1;
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
