/// <reference types="p5/global" />

// constants
const RADIUS = 230;
const SIZE = 5;
const GAP = SIZE * 4;
const DELTA = 30;
const FRAMES = 30;

// locals
const particles = [];
let env, clickCoord;

// let prev = { x: 0, y: 0 };
// let lfo1, lfo2, lfo3, env, t;

function setup() {
  createCanvas(600, 600);
  stroke(255);
  strokeWeight(4);
  rectMode(CENTER);
  // create grid of particles
  for (let x = 0; x < width; x += GAP) {
    for (let y = 0; y < height; y += GAP) {
      // only create particles within the circle
      if (dist(x, y, width / 2, height / 2) > RADIUS) continue;
      particles.push({
        x,
        y,
        a: random(0, TWO_PI),
        lfo: createLfo(LfoWaveform.Noise, Timing.frames(FRAMES), -DELTA, DELTA, int(random(FRAMES))),
      });
    }
  }
  env = createEnvelope({ a: Timing.frames(2), d: Timing.frames(120), s: 0.5, r: Timing.frames(120) });
}

function draw() {
  background(0);
  for (const p of particles) {
    // polar to cartesian
    // const ratio = clickCoord ? 1 - dist(p.x, p.y, clickCoord.x, clickCoord.y) / 100 : 1;
    const value = p.lfo.value * env.value; // * ratio;
    const x = p.x + value * cos(p.a);
    const y = p.y + value * sin(p.a);
    ellipse(y, x, SIZE, SIZE);
  }
}

let isLooping = true;
function mouseClicked() {
  clickCoord = { x: mouseX, y: mouseY };
  env.pulse();
  // env.gate(Timing.frames(env.adsr.a.value + env.adsr.d.value + 60));
  // if (isLooping) {
  //   noLoop();
  // } else {
  //   loop();
  // }
  // isLooping = !isLooping;
}

P5Capture.setDefaultOptions({
  disableUi: true,
});
