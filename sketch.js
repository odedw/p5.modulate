/// <reference types="p5/global" />

// constants
const NUM_STARS = 10000;
const NUM_BUILDINGS = 10;
const BUILDING_LIGHT_COLOR = '#fff663';
const STAR_COLOR = '#ffffff';

// locals
const particles = [];

class Particle {
  constructor(x, y, size, c) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = c;
    const lfoFreq = int(random(600, 6000));
    this.lfo = createLfo(LfoWaveform.Square, Timing.frames(lfoFreq), 0, 1);
  }

  draw() {
    fill(red(this.c), green(this.c), blue(this.c), alpha(this.c) * this.lfo.value);
    push();
    translate(this.x, this.y);
    square(0, 0, this.size);
    pop();
  }
}

class Building {
  constructor(x, w, h) {
    this.x = x;
    this.y = height - h;
    this.w = w;
    this.h = h;
    const xGap = random(2, 10);
    const yGap = random(2, 10);
    this.points = generateGrid(int(w / xGap), int(h / yGap), w, h);
    const c = color(
      red(BUILDING_LIGHT_COLOR),
      green(BUILDING_LIGHT_COLOR),
      blue(BUILDING_LIGHT_COLOR),
      random(100, 160)
    );
    this.lights = this.points
      .map((point) => (Math.random() < 0.7 ? new Particle(this.x + point.x, this.y + point.y, random(1, 3), c) : null))
      .filter((p) => !!p);
  }

  draw() {
    fill(0);
    rect(this.x, height - this.h, this.w, this.h);
    for (let i = 0; i < this.lights.length; i++) {
      const l = this.lights[i];
      l.draw();
    }
  }
}

function setup() {
  createCanvas(700, 700);
  noStroke();
  // rectMode(CENTER);
  //   background(0);

  for (let i = 0; i < NUM_STARS; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(0.05, 1.5);
    const c = color(255, 255, 255, random(255));
    particles.push(new Particle(x, y, size, c, STAR_COLOR));
  }

  for (let i = 0; i < NUM_BUILDINGS; i++) {
    const x = random(width);
    const w = random(width * 0.05, width * 0.2);
    const h = random(height * 0.1, height * 0.5);
    const c = color(255, 255, 255, random(255));
    particles.push(new Building(x, w, h, c));
  }
}

function draw() {
  background(0);

  for (const particle of particles) {
    particle.draw();
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

P5Capture.setDefaultOptions({
  disableUi: true,
});
