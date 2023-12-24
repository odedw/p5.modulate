/// <reference types="p5/global" />

// constants
const NUM_PARTICLES = 2000;
const SIZE = 5;
const MAX_STEP_SIZE = 3;
const DELTA = 50;

// locals
let particles = [];

function setup() {
  createCanvas(600, 600);
  stroke(255);
  noStroke();
  fill(255);
  frameRate(60);
  reset();
  background(0);

  // saveGif('2023-12-18_vistas', getTargetFrameRate() * 120, { units: 'frames' });
}

function generateParticles(hFrequency, hPhase) {
  const arr = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const d = int(random(DELTA / 2, DELTA));
    arr.push({
      secondaryAxisPosition: random(-0.1 * width, 1.1 * width),
      secondaryAxisLfo: createLfo(LfoWaveform.Noise, LfoTiming.Frames(2 * 60), -d, d),
      mainAxisPosition: 0,
      l: createLfo(LfoWaveform.Sine, LfoTiming.Frames(int(random(1 * 60, 10 * 60)))),
      s: createLfo(LfoWaveform.Sine, LfoTiming.Frames(int(random(1 * 60, 10 * 60)))),
      h: createLfo(LfoWaveform.Sine, LfoTiming.Frames(int(hFrequency)), -1, 1, hPhase),
      stepSize: random(1, MAX_STEP_SIZE),
    });
  }
  return arr;
}

function reset() {
  const singleDirection = random() > 0.5;
  for (let i = 0; i < 4; i++) {
    particles[i] = [];
  }

  const hFrequency = 100 * 60;
  const hPhase = random(hFrequency);

  if (singleDirection) {
    particles[int(random(4))] = generateParticles(hFrequency, hPhase);
  } else {
    for (let i = 0; i < 4; i++) {
      if (random() > 0.5) {
        continue;
      }
      particles[i] = generateParticles(hFrequency, hPhase);
    }
  }
}

let imageIndex = 0;
function draw() {
  for (let j = 0; j < 4; j++) {
    const arr = particles[j];
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      const { secondaryAxisPosition, mainAxisPosition, secondaryAxisLfo } = p;

      if (mainAxisPosition > height) {
        continue;
      }

      const h = map(p.h.value, -1, 1, 0, 360);
      const s = map(p.s.value, -1, 1, 20, 100);
      const l = map(p.l.value, -1, 1, 30, 70);

      let x, y;
      switch (j) {
        case 0:
          x = secondaryAxisPosition + secondaryAxisLfo.value;
          y = mainAxisPosition;
          break;
        case 1:
          x = width - mainAxisPosition;
          y = secondaryAxisPosition + secondaryAxisLfo.value;
          break;
        case 2:
          x = secondaryAxisPosition + secondaryAxisLfo.value;
          y = height - mainAxisPosition;
          break;
        case 3:
          x = mainAxisPosition;
          y = secondaryAxisPosition + secondaryAxisLfo.value;
          break;
      }
      let color = new Color('hsl', [h, s, l]);
      fill(color.srgb.r * 255, color.srgb.g * 255, color.srgb.b * 255);
      ellipse(x, y, SIZE, SIZE);
      p.mainAxisPosition += p.stepSize;
      if (p.mainAxisPosition > (j === 0 || j === 2 ? width : height)) {
        arr.splice(i, 1);
      }
    }

    if (particles.every((arr) => arr.length === 0)) {
      // saveCanvas(`2023-12-22_vistas-${imageIndex++}`, 'png');
      reset();
    }
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
