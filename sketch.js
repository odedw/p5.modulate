/// <reference types="p5/global" />

// constants
const NUM_PARTICLES = 20;
const PARTICLE_SIZE = 5;
const RADIUS_INCREMENT = 1;
const FRAMES_WAITED = 30;

// locals
let particles = [];
let state = 'compute';
let t;
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
let r = 1;
function computeConnections() {
  // let r = 1;

  // while (true) {
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
  // r += RADIUS_INCREMENT;
  // }
}

function reset() {
  r = 0;
  particles = [];
  for (let i = 0; i < random(NUM_PARTICLES / 2, NUM_PARTICLES); i++) {
    particles.push(new Particle(random(width * 0.0, width * 1), random(height * 0.0, height * 1)));
  }

  while (r < width) {
    // state = 'draw';
    computeConnections();
    r += RADIUS_INCREMENT;
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
  stroke(255);
  rectMode(CENTER);
  reset();
  //   background(0);
  // noLoop();
  background(0);
}

let framesWaited = 0;
let framesFaded = 0;
function draw() {
  fill(255);

  // if (state === 'compute') {
  //   computeConnections();
  //   for (const p of particles) {
  //     // p.x += random(-1, 1);
  //     // p.y += random(-1, 1);
  //     fill(p.attractor ? 'red' : 'white');
  //     ellipse(p.x, p.y, PARTICLE_SIZE);

  //     if (p.attractor) {
  //       line(p.x, p.y, p.attractor.x, p.attractor.y);
  //     }
  //   }
  //   for (const p of particles.filter((p) => !p.attractor)) {
  //     noFill();
  //     ellipse(p.x, p.y, r * 2);
  //   }
  // r += RADIUS_INCREMENT;
  // } else if (state === 'draw') {
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

  if (framesWaited >= FRAMES_WAITED) {
    background(0, 0, 0, 7);
    framesFaded += 1;
  }

  if (framesFaded >= 30) {
    reset();
    framesWaited = 0;
    framesFaded = 0;
  }
  // }

  // if (r > width / 2) {
  //   prepareDrawState();
  //   state = 'draw';
  // }
}

let isLooping = true;
function mouseClicked() {
  // reset();
  // loop();

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
