/// <reference types="p5/global" />

// constants
const NUM_PARTICLES = 4000;
const SIZE = 10;
const MAX_STEP_SIZE = 3;
const MANUAL_FREQUENCY = 3 * 60;
const NUM_LFOS = 100;
const FREQUENCY = 30;
const DELTA = 50;

// locals
const points = [];
let lfo1, lfo2, lfo3;
let circleLfo;
let angleLfo;
let radius = 0;
let size = 1;
const lfos = [];
const particles = [];
function setup() {
  createCanvas(600, 600);
  stroke(255);
  noStroke();
  fill(255);
  frameRate(60);
  angleLfo = createLfo(LfoWaveform.Noise, LfoTiming.Manual(), 0.25 * PI, 0.75 * PI);
  let startLfo = createLfo(LfoWaveform.Noise, LfoTiming.Manual(), -0.1 * width, 1.1 * width);

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const d = int(random(1, DELTA));
    particles.push({
      x: startLfo.step(),
      y: 0,
      a: angleLfo.step(),
      xLfo: createLfo(LfoWaveform.Noise, LfoTiming.Frames(2 * 60), -d, d),
      l: createLfo(LfoWaveform.Sine, LfoTiming.Frames(int(random(1 * 60, 10 * 60)))),
      s: createLfo(LfoWaveform.Sine, LfoTiming.Frames(int(random(1 * 60, 10 * 60)))),
      h: createLfo(LfoWaveform.Sine, LfoTiming.Frames(int(random(100 * 60, 200 * 60)))),
      stepSize: random(1, MAX_STEP_SIZE),
    });
  }

  // rectMode(CENTER);
  // textAlign(CENTER, CENTER);
  // for (let i = 0; i < NUM_LFOS; i++) {
  //   const phase = (i * FREQUENCY) / NUM_LFOS;
  //   lfos.push(createLfo(LfoWaveform.Sawtooth, LfoTiming.Frames(60), 0, TWO_PI, phase));
  // }
  // circleLfo = createLfo(LfoWaveform.Sawtooth, LfoTiming.Frames(60), 0, TWO_PI);
  background(0);
  // lfo1 = createLfo(LfoWaveform.Sine, LfoTiming.Manual(MANUAL_FREQUENCY));
  // lfo2 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(MANUAL_FREQUENCY / 2));

  lfo1 = createLfo(LfoWaveform.Noise, LfoTiming.Manual());
  // lfo2 = createLfo(LfoWaveform.Sine, LfoTiming.Seconds(int(random(1, 10))));
  // lfo3 = createLfo(LfoWaveform.Sine, LfoTiming.Seconds(int(random(1, 10))));
  // filter(DILATE);

  saveGif('2023-12-14_color-rain-noise', getTargetFrameRate() * 10, { units: 'frames' });
}

function draw() {
  // background(0);

  // const l = map(lfo1.value, -1, 1, 0, 1);
  // const a = map(lfo2.value, -1, 1, -0.4, 0.4);
  // const b = map(lfo3.value, -1, 1, -0.4, 0.4);

  // let color = new Color('oklab', [l, a, b]);
  // fill(color.srgb.r * 255, color.srgb.g * 255, color.srgb.b * 255);

  // const r = map(lfo1.value, -1, 1, 50, 255);
  // const g = map(lfo2.value, -1, 1, 50, 255);
  // const b = map(lfo3.value, -1, 1, 50, 255);
  // fill(r, g, b);

  for (const p of particles) {
    const { x, y, a, xLfo } = p;
    if (y > height) {
      continue;
    }
    const h = map(p.h.value, -1, 1, 0, 360);
    const s = map(p.s.value, -1, 1, 20, 100);
    const l = map(p.l.value, -1, 1, 30, 70);

    let color = new Color('hsl', [h, s, l]);
    fill(color.srgb.r * 255, color.srgb.g * 255, color.srgb.b * 255);
    // const { x: dx, y: dy } = polarToCartesian(STEP_SIZE, a);
    // p.x += dx;
    // p.y += dy;
    p.y += p.stepSize;

    if (p.x >= 0 && p.x <= width) {
      ellipse(x + xLfo.value, y, SIZE, SIZE);
      ellipse(x - xLfo.value, y, SIZE, SIZE);
    }
    // if (p.y > height) {
    // p.y = random(-100, -10);
    // }
  }

  // translate(width / 2, height / 2);

  // for (const lfo of lfos) {
  //   const { x, y } = polarToCartesian(radius, lfo.value);
  //   ellipse(x, y, size, size);
  //   lfo.frequency.value += 0.01;
  // }

  // radius += 1;
  // size += 0.1;
  // filter(BLUR, 0.001);
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
