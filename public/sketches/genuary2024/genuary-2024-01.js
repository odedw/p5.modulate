/// <reference types="p5/global" />

// constants
const NUM_PARTICLES = 20;
const PARTICLE_SIZE = 5;

// locals
let particles = [];
let t;
let strokeLfo;
let r = 1;

class Particle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
  }

  coord() {
    if (this.attractor) {
      const coord = polarToCartesian(this.lfo.value, this.a);
      const attractorCoord = this.attractor.coord();
      const x = attractorCoord.x + coord.x;
      const y = attractorCoord.y + coord.y;
      return { x, y };
    } else {
      return { x: this.x, y: this.y };
    }
  }
}

function computeConnections() {
  const randomOrderParticlesWithoutAttractor = particles
    .filter((p) => !p.attractor)
    .toSorted(() => (Math.random() < 0.5 ? -1 : 1));

  if (r >= width * 2 || randomOrderParticlesWithoutAttractor.length === 0) {
    return;
  }

  for (const p of randomOrderParticlesWithoutAttractor) {
    for (const p2 of particles) {
      if (p === p2) {
        continue;
      }
      const d = dist(p.x, p.y, p2.x, p2.y);
      if (d < r && !p.attractor && !p2.attractor) {
        p.attractor = p2;
        p2.attractee = p;
        // angle between p and p2
        p.a = atan2(p2.y - p.y, p2.x - p.x);
        break;
      }
    }
  }
}

function reset() {
  r = 0;
  particles = [];
  for (let i = 0; i < random(NUM_PARTICLES / 2, NUM_PARTICLES); i++) {
    particles.push(new Particle(random(width * 0.1, width * 0.9), random(height * 0.1, height * 0.9)));
  }

  while (r < width) {
    computeConnections();
    r += 1;
  }
  prepareDrawState();
}

function prepareDrawState() {
  t = Timing.frames(240, 60);
  for (const p of particles.filter((p) => !!p.attractor)) {
    const d = dist(p.x, p.y, p.attractor.x, p.attractor.y);
    p.lfo = createLfo(LfoWaveform.Sine, t, -d, d);
  }
}

function setup() {
  createCanvas(600, 600);
  strokeWeight(1);
  rectMode(CENTER);
  reset();
  background(0);

  strokeLfo = createLfo(LfoWaveform.Sine, Timing.frames(240), 150, 255);
}

let framesWaited = 0;
let framesFaded = 0;
function draw() {
  stroke(strokeLfo.value);
  if (t.isActive) {
    for (const p of particles) {
      fill(p.attractor ? 'red' : 'white');
      // compute polar coordinates with lfo

      const { x, y } = p.coord();
      if (p.attractor) {
        // ellipse(x, y, PARTICLE_SIZE);
        line(x, y, p.attractor.x, p.attractor.y);
      } else {
        // ellipse(x, y, PARTICLE_SIZE);
      }
    }
  }

  if (t.elapsed >= 0.75) {
    t.deactivate();
  }

  if (!t.isActive) {
    framesWaited += 1;
  }

  if (framesWaited >= 15) {
    background(0, 0, 0, 5);
    framesFaded += 1;
  }

  if (framesFaded >= 45) {
    reset();
    framesWaited = 0;
    framesFaded = 0;
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
