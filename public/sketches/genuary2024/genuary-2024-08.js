/// <reference types="p5/global" />

// constants
const NUM_TARGETS = 10;
const NUM_BLASTS = 10;
const NUM_PARTICLES_IN_BLAST = 10;
const TRAVEL_TIME = 80;
const PARTICLE_SIZE = 10;

// locals
let particles = [];
let timerTillTheNextRound;
let particleSize;
class Particle {
  trail = [];

  constructor(x, y, vx, vy, c) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.c = c || color(random(0, 255), random(0, 255), random(0, 255));
  }

  update() {
    this.prev = { x: this.x, y: this.y };

    this.x += this.vx;
    this.y += this.vy;

    if (this.x >= 0 && this.x <= width && this.y >= 0 && this.y <= height) {
      this.trail.push({ x: this.x, y: this.y });
    }
  }

  collision(p) {
    let normalX = p.x - this.x;
    let normalY = p.y - this.y;
    let magnitude = sqrt(normalX * normalX + normalY * normalY);
    normalX /= magnitude;
    normalY /= magnitude;

    // Tangential vector is perpendicular to the normal
    let tangentX = -normalY;
    let tangentY = normalX;

    // Decompose velocities into normal and tangential components
    let dotProductTangent1 = this.vx * tangentX + this.vy * tangentY;
    let dotProductNormal1 = this.vx * normalX + this.vy * normalY;
    let dotProductTangent2 = p.vx * tangentX + p.vy * tangentY;
    let dotProductNormal2 = p.vx * normalX + p.vy * normalY;

    // Swap normal components for elastic collision
    this.vx = tangentX * dotProductTangent1 + normalX * dotProductNormal2;
    this.vy = tangentY * dotProductTangent1 + normalY * dotProductNormal2;
    p.vx = tangentX * dotProductTangent2 + normalX * dotProductNormal1;
    p.vy = tangentY * dotProductTangent2 + normalY * dotProductNormal1;
  }

  draw() {
    strokeWeight(particleSize);
    stroke(this.c);
    line(this.prev.x, this.prev.y, this.x, this.y);
  }
}

function computeTrajectories() {
  randomPalette();
  timerTillTheNextRound = null;
  particles = [];
  let trajectoryOrigins = [];
  let targetCoords = [];
  particleSize = random(PARTICLE_SIZE / 3, PARTICLE_SIZE);
  const numTargets = int(random(2, NUM_TARGETS));
  for (let i = 0; i < numTargets; i++) {
    targetCoords.push({
      x: random(0.2 * width, 0.8 * width),
      y: random(0.2 * height, 0.8 * height),
    });
  }

  const numBlasts = int(random(2, NUM_BLASTS));
  for (const targetCoord of targetCoords) {
    // generate random trajectories
    let edge = int(random(0, 4));
    for (let i = 0; i < numBlasts; i++) {
      if (edge === 0) {
        trajectoryOrigins.push({ x: random(0, width), y: 0 });
      } else if (edge === 1) {
        trajectoryOrigins.push({ x: width, y: random(0, height) });
      } else if (edge === 2) {
        trajectoryOrigins.push({ x: random(0, width), y: height });
      } else if (edge === 3) {
        trajectoryOrigins.push({ x: 0, y: random(0, height) });
      }

      edge = (edge + 1) % 4;
    }
    let count = 0;
    for (const o of trajectoryOrigins) {
      let d = dist(o.x, o.y, targetCoord.x, targetCoord.y);

      // find starting point
      let dx = targetCoord.x - o.x;
      let dy = targetCoord.y - o.y;

      let magnitude = sqrt(dx * dx + dy * dy);
      let dirX = dx / magnitude;
      let dirY = dy / magnitude;

      const vx = dirX * (d / TRAVEL_TIME);
      const vy = dirY * (d / TRAVEL_TIME);

      // generate particles
      let added = 0;
      const c = PALETTE[count++ % PALETTE.length];

      const numParticles = int(random(2, NUM_PARTICLES_IN_BLAST));
      while (added < numParticles) {
        // for (let i = 0; i < NUM_PARTICLES_IN_BLAST; i++) {
        const x = o.x + random(-particleSize * 5, particleSize * 3);
        const y = o.y + random(-particleSize * 5, particleSize * 5);
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          continue;
        }
        particles.push(new Particle(x, y, vx, vy, c));
        added++;
      }
    }
  }

  background(0);
}

function setup() {
  createCanvas(700, 700);
  rectMode(CENTER);
  computeTrajectories();
}

function draw() {
  // if (frameCount === 1) {
  //   record();
  // }
  for (const p of particles) {
    p.update();
    p.draw();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < particleSize) {
        p1.collision(p2);
      }
    }
  }

  const outOfBoundsParticles = particles.filter((p) => {
    return p.x < 0 || p.x > width || p.y < 0 || p.y > height;
  });
  if (!timerTillTheNextRound && outOfBoundsParticles.length > particles.length * 0.9) {
    timerTillTheNextRound = Timing.frames(240, 0, false);
  }

  if (timerTillTheNextRound?.finished) {
    computeTrajectories();
    // const capture = P5Capture.getInstance();
    // capture.stop();
    // record();
    // console.log('===========================');
    // console.log(frameCount, 60 * 60);
    // console.log('===========================');
  }
}
// function imageFilename(index) {
//   return frameCount.toString().padStart(7, '0');
// }
// function record() {
//   const capture = P5Capture.getInstance();
//   capture.start({
//     format: 'png',
//     framerate: 60,
//     quality: 1,
//     imageFilename,
//   });
// }

// let isLooping = true;
// function mouseClicked() {
//   computeTrajectories();

// }

P5Capture.setDefaultOptions({
  disableUi: true,
});
