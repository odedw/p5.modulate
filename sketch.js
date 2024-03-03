/// <reference types="p5/global" />

// constants
const RADIUS = 10;
const ITERATIONS = 100;
const DELTA_BOUNDARY = 50;
const NUM_PARTICLES = 200;
// locals
let particles = [];
let trunk = [];
let branches = [];
let leaves = [];
let spawnBounds, trunkBounds, branchesBounds;
const Scenes = {
  Trunk: 0,
  Branches: 1,
  Leaves: 2,
};

initScenes([Scenes.Trunk, Scenes.Branches, Scenes.Leaves]);

function randomPoint() {
  const v = createVector(
    random(spawnBounds.minX - DELTA_BOUNDARY, spawnBounds.maxX + DELTA_BOUNDARY),
    random(spawnBounds.minY - DELTA_BOUNDARY, spawnBounds.maxY + DELTA_BOUNDARY)
  );
  return v;
}

class Particle {
  constructor(c, x, y) {
    if (x && y) {
      this.pos = createVector(x, y);
      this.stuck = true;
    } else {
      this.pos = randomPoint();
      this.stuck = false;
    }
    this.c = c;
  }

  update() {
    var vel = p5.Vector.random2D();
    this.pos.add(vel);
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    const particlesToCheckAgainst = currentScene === Scenes.Trunk ? trunk : branches;
    if (particlesToCheckAgainst.some((p2) => stuckPredicate(this, p2))) {
      this.stuck = true;
    }
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }

  draw() {
    push();
    noStroke();
    translate(this.pos.x, this.pos.y);
    fill(this.c);
    ellipse(0, 0, RADIUS, RADIUS);
    pop();
  }
}

function checkBounds(b, x, y, d = 0) {
  return x >= b.minX - d && x <= b.maxX + d && y >= b.minY - d && y <= b.maxY + d;
}
function expandBounds(b, x, y) {
  b.minX = min(x, b.minX);
  b.minY = min(y, b.minY);
  b.maxX = max(x, b.maxX);
  b.maxY = max(y, b.maxY);
}

function stuckPredicate(p1, p2) {
  if (currentScene == Scenes.Trunk) {
    const d = p5.Vector.dist(p1.pos, p2.pos);
    if (d < RADIUS) {
      if (!checkBounds(trunkBounds, p1.x, p1.y, 0.5)) return false;
      if (Math.random() < 0.09) expandBounds(trunkBounds, p1.x, p1.y);
      const a = atan2(p1.pos.y - p2.pos.y, p1.pos.x - p2.pos.x);
      return a > -180 && a < 0;
    }

    return false;
  } else if (currentScene === Scenes.Branches) {
    if (!checkBounds(branchesBounds, p2.x, p2.y)) return false;
    const d = p5.Vector.dist(p1.pos, p2.pos);
    if (d < RADIUS) {
      const a = atan2(p1.pos.y - p2.pos.y, p1.pos.x - p2.pos.x);
      return a > -180 && a < 0;
    }
  } else if (currentScene === Scenes.Leaves) {
    const d = p5.Vector.dist(p1.pos, p2.pos);
    if (d < RADIUS) {
      return true;
    }
  }
  return false;
}
function onSceneChanged(prev, next) {
  if (prev === Scenes.Trunk) {
    spawnBounds = {
      minX: width / 2,
      maxX: width / 2,
      minY: height * 0.6,
      maxY: height * 0.6,
    };
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle('brown'));
    }
    let highestParticle;
    for (const p of trunk) {
      if (!highestParticle || highestParticle.y > p.y) {
        highestParticle = p;
      }
    }
    branches.push(highestParticle);
  } else if (prev === Scenes.Branches) {
    spawnBounds = {
      minX: width / 2,
      maxX: width / 2,
      minY: height * 0.2,
      maxY: height * 0.2,
    };
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle('green'));
    }
  }
}
function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < 10; i++) {
    p = new Particle('brown', width / 2 + random(-RADIUS * 0.5, RADIUS * 0.5), height - RADIUS);
    trunk.push(p);
    if (!spawnBounds) {
      spawnBounds = {
        minX: p.pos.x,
        maxX: p.pos.x,
        minY: p.pos.y,
        maxY: p.pos.y,
      };
    } else {
      expandBounds(spawnBounds, p.x, p.y);
    }
  }
  trunkBounds = {
    minX: spawnBounds.minX,
    maxX: spawnBounds.maxX,
    minY: height * 0.75,
    maxY: height,
  };
  branchesBounds = {
    maxX: width * 0.9,
    minX: width * 0.1,
    minY: height * 0.2,
    maxY: height * 0.8,
  };
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle('brown'));
  }

  // pixelDensity(1);
  background(0);
}

function draw() {
  // background(0);
  // iterate backwards so we can remove particles
  for (let n = 0; n < ITERATIONS; n++) {
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      if (p.stuck) {
        particles.splice(i, 1);
        if (currentScene === Scenes.Trunk) {
          trunk.push(p);
          particles.push(new Particle('brown'));
        } else if (currentScene === Scenes.Branches) {
          branches.push(p);
          particles.push(new Particle('brown'));
        } else if (currentScene === Scenes.Leaves) {
          leaves.push(p);
          particles.push(new Particle('green'));
        }
        expandBounds(spawnBounds, p.x, p.y);
        p.draw();
      }
    }
  }

  // for (let p of particles) {
  //   p.draw();
  // }
  // for (let p of trunk) {
  //   p.draw();
  // }
  // for (const p of branches) {
  //   p.draw();
  // }

  // for (const p of leaves) {
  //   p.draw();
  // }

  if (currentScene === Scenes.Trunk && spawnBounds.minY - 1 <= trunkBounds.minY) {
    nextScene();
  }

  if (currentScene === Scenes.Branches && branches.length >= 1000) {
    nextScene();
  }

  if (frameCount % 60 === 0) {
    console.log(trunk.length, branches.length, leaves.length);
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

// P5Capture.setDefaultOptions({
//   disableUi: true,
//   format: 'mp4',
//   quality: 1,
//   framerate: 60,
// });
