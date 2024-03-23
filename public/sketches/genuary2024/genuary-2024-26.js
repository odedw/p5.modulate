/// <reference types="p5/global" />

// constants
const BACKGROUND = '#FEFBED';
const RADIUS = 10;
const ITERATIONS = 10;
const DELTA_BOUNDARY = 50;
const NUM_PARTICLES = 500;
const MAX_BRANCHES_PER_CELL = 8;
const NUM_CELLS = 30;
const MAX_LEAVES = 10000;
const MAX_BRANCHES = 2200;
const MAX_FRUIT = 10;
const CAPTURE_MINIMUM = 3;
const Scenes = {
  Trunk: 0,
  Branches: 1,
  Leaves: 2,
  End: 3,
};
const PALETTES = {
  [Scenes.Trunk]: ['#452017', '#5F2D1C', '#562719', '#723F27', '#432117', '#571419'],
  [Scenes.Branches]: ['#452017', '#5F2D1C', '#562719', '#723F27', '#432117', '#571419'],
  [Scenes.Leaves]: ['#B6BA7A', '#3A6035', '#6C7C3E', '#466038', '#435F36', '#3E5C34'],
};
// locals
let particles = [];
let trunk = [];
let branches = [];
let leaves = [];
let fruit = [];
let spawnBounds, trunkBounds, branchesBounds;
let branchesDensityMatrix;

initScenes([Scenes.Trunk, Scenes.Branches, Scenes.Leaves, Scenes.End]);

function randomPoint() {
  const v = createVector(
    random(spawnBounds.minX - DELTA_BOUNDARY, spawnBounds.maxX + DELTA_BOUNDARY),
    random(spawnBounds.minY - DELTA_BOUNDARY, spawnBounds.maxY + DELTA_BOUNDARY)
  );
  return v;
}

class Particle {
  constructor(x, y) {
    if (x && y) {
      this.pos = createVector(x, y);
      this.stuck = true;
    } else {
      this.pos = randomPoint();
      this.stuck = false;
    }
    this.s = currentScene;
    if (currentScene === Scenes.Trunk || currentScene === Scenes.Branches) {
      this.r = random(RADIUS * 0.5, RADIUS);
    } else if (currentScene === Scenes.Leaves) {
      this.r = random(RADIUS * 0.3, RADIUS * 0.8);
    } else if (currentScene === Scenes.Fruit) {
      this.r = random(RADIUS * 2, RADIUS * 3);
    }
  }

  update() {
    var vel = p5.Vector.random2D();
    this.pos.add(vel);
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    const particlesToCheckAgainst = currentScene === Scenes.Trunk ? trunk : branches;
    let stuckTo = particlesToCheckAgainst.find((p2) => stuckPredicate(this, p2));
    if (!stuckTo && currentScene === Scenes.Leaves) {
      if (Math.random() > 0.1) {
        return;
      }
      stuckTo = leaves.find((p2) => stuckPredicate(this, p2));
    }
    if (stuckTo) {
      this.stuck = true;
      stuckTo.stuckCount = stuckTo.stuckCount ? 1 : stuckTo.stuckCount + 1;
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
    fill(random(PALETTES[currentScene]));
    ellipse(0, 0, this.r, this.r);
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

function withinDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return dx * dx + dy * dy < (p1.r * p1.r) / 2 + (p2.r * p2.r) / 2;
}
function withinRadius(p) {
  const dx = p.x - width / 2;
  const dy = p.y - height * 0.4;
  return dx * dx + dy * dy < width * 0.4 * width * 0.4;
}
function stuckPredicate(p1, p2) {
  if (currentScene == Scenes.Trunk) {
    if (p2.stuckCount >= 1 || (p2.y > 688 && p2.stuckCount >= 5)) {
      return false;
    }

    const d = withinDistance(p1, p2);
    if (d) {
      const row = round((p1.y / height) * NUM_CELLS);
      const col = round((p1.x / width) * NUM_CELLS);
      try {
        if (branchesDensityMatrix.get(col, row) >= MAX_BRANCHES_PER_CELL) {
          return false;
        }
      } catch {
        return false;
      }

      if (!checkBounds(trunkBounds, p1.x, p1.y, 0.5)) return false;
      if (Math.random() < 0.01) expandBounds(trunkBounds, p1.x, p1.y);
      const a = atan2(p1.pos.y - p2.pos.y, p1.pos.x - p2.pos.x);
      return a > -180 && a < 0;
    }

    return false;
  } else if (currentScene === Scenes.Branches) {
    const row = round((p1.y / height) * NUM_CELLS);
    const col = round((p1.x / width) * NUM_CELLS);
    try {
      if (branchesDensityMatrix.get(col, row) >= MAX_BRANCHES_PER_CELL) {
        return false;
      }
    } catch {
      return false;
    }
    if (!checkBounds(branchesBounds, p2.x, p2.y)) {
      if (p1.y >= branchesBounds.minY || Math.random() > 0.1) {
        return false;
      }
    }
    const d = withinDistance(p1, p2);

    if (d) {
      const a = atan2(p1.pos.y - p2.pos.y, p1.pos.x - p2.pos.x);
      return a > -180 && a < 0;
      // return true;
    }
  } else if (currentScene === Scenes.Leaves) {
    if (p2.s === Scenes.Branches && p2.stuckCount >= 4) {
      return false;
    }
    if (p2.s === Scenes.Leaves && p2.y < 0.5 && p2.stuckCount >= 2) {
      return false;
    }

    if (p2.s === Scenes.Leaves && p2.y < 0.2 && p2.stuckCount >= 4) {
      return false;
    }

    if (!withinRadius(p1)) {
      if (Math.random() > 0.1) {
        return false;
      }
    }
    const d = withinDistance(p1, p2);

    if (d) {
      return true;
    }
  } else if (currentScene === Scenes.End) {
  }
  return false;
}
function onSceneChanged(prev, next) {
  console.log('scene changed', prev, next);
  if (prev === Scenes.Trunk) {
    spawnBounds = {
      minX: width * 0.4,
      maxX: width * 0.6,
      minY: height * 0.5,
      maxY: height * 0.6,
    };
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle());
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
      minY: height * 0.5,
      maxY: height * 0.5,
    };
    particles = [];
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle());
    }
  } else if (prev === Scenes.Leaves) {
    particles = [];
    spawnBounds = {
      minX: width / 2,
      maxX: width / 2,
      minY: height * 0.5,
      maxY: height * 0.5,
    };
    // particles.push(new Particle());
  } else {
    particles = [];
  }
}
let img;
function preload() {
  img = loadImage('public/assets/genuary26gradient.png');
}
function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < 10; i++) {
    p = new Particle(width / 2, height - RADIUS);
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
    minX: width / 2 - RADIUS * 0.1,
    maxX: width / 2 + RADIUS * 0.1,
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
    particles.push(new Particle());
  }

  branchesDensityMatrix = new Matrix(NUM_CELLS, NUM_CELLS, 0);

  // pixelDensity(1);
  // background(BACKGROUND);
  image(img, 0, 0, width, height);
}
let stuckSinceLastFrame = 0;
let endFrames = 0;
function draw() {
  // background(0);
  // iterate backwards so we can remove particles
  let shouldSaveFrame = false;
  if (currentScene === Scenes.End) {
    saveFrame();
    endFrames++;
    if (endFrames >= 120) {
      noLoop();
      console.log('done');
      done = true;
    }
    return;
  }
  for (let n = 0; n < ITERATIONS; n++) {
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      if (p.stuck) {
        stuckSinceLastFrame++;
        particles.splice(i, 1);
        if (currentScene === Scenes.Trunk) {
          trunk.push(p);
          particles.push(new Particle());
          const row = round((p.y / height) * NUM_CELLS);
          const col = round((p.x / width) * NUM_CELLS);
          branchesDensityMatrix.set(col, row, branchesDensityMatrix.get(col, row) + 1);
        } else if (currentScene === Scenes.Branches) {
          branches.push(p);
          for (let i = 0; i < 2; i++) {
            particles.push(new Particle());
          }
          const row = round((p.y / height) * NUM_CELLS);
          const col = round((p.x / width) * NUM_CELLS);
          branchesDensityMatrix.set(col, row, branchesDensityMatrix.get(col, row) + 1);
        } else if (currentScene === Scenes.Leaves) {
          leaves.push(p);
          if (stuckSinceLastFrame >= CAPTURE_MINIMUM * 7) {
            shouldSaveFrame = true;
            break;
          }

          if (leaves.length >= MAX_LEAVES) {
            break;
          }
          for (let i = 0; i < 2; i++) {
            if (particles.length < 5000) {
              particles.push(new Particle());
            }
          }
        }

        expandBounds(spawnBounds, p.x, p.y);
        p.draw();
      }
    }
  }

  if (
    (currentScene === Scenes.Trunk && spawnBounds.minY - 1 <= trunkBounds.minY) ||
    (currentScene === Scenes.Branches && branches.length >= MAX_BRANCHES) ||
    (currentScene === Scenes.Leaves && leaves.length >= MAX_LEAVES)
  ) {
    nextScene();
  }

  if (shouldSaveFrame || (currentScene !== Scenes.Leaves && stuckSinceLastFrame >= CAPTURE_MINIMUM)) {
    saveFrame();
  }
}
let done = false;
function saveFrame() {
  // stuckSinceLastFrame = 0;
  // const paddedFrameNumber = frame.toString().padStart(7, '0');
  // noLoop();
  // saveCanvas(`frame-${paddedFrameNumber}`, 'png');
  // setTimeout(() => {
  //   console.log(trunk.length, branches.length, leaves.length, '===========================', frame++);
  //   if (!done) {
  //     loop();
  //   }
  // }, 150);
}
let frame = 0;

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
  format: 'mp4',
  quality: 1,
  framerate: 60,
});
