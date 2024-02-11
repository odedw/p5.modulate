/// <reference types="p5/global" />

// constants
const DISTANCE = 100;
const PARTICLE_COUNT = 50;
// locals
let particles = [];
let t1, t2, t3;

const Type = {
  Point: 'Point',
  Line: 'Line',
  Plane: 'Plane',
};

class Particle {
  lastPoint;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.b = randomBezier(x, y);
    this.c = random(PALETTE);
    this.lastPoint = createVector(x, y);
    this.type = Type.Point;
  }

  switchToLine() {
    this.type = Type.Line;

    this.destination = createVector(
      this.x + random(-DISTANCE * 5, DISTANCE * 5),
      this.y + random(-DISTANCE * 5, DISTANCE * 5)
    );
  }

  draw() {
    noFill();
    strokeWeight(5);
    stroke(this.c);
    if (this.type === Type.Point) {
      let nextX = bezierPoint(this.b[0].x, this.b[1].x, this.b[2].x, this.b[3].x, t1.elapsed);
      let nextY = bezierPoint(this.b[0].y, this.b[1].y, this.b[2].y, this.b[3].y, t1.elapsed);
      line(this.lastPoint.x, this.lastPoint.y, nextX, nextY);
      this.lastPoint = createVector(nextX, nextY);
    } else if (this.type === Type.Line) {
      this.x = lerp(this.x, this.destination.x, t2.elapsed);
      this.y = lerp(this.y, this.destination.y, t2.elapsed);
      bezier(this.x, this.y, this.b[1].x, this.b[1].y, this.b[2].x, this.b[2].y, this.b[3].x, this.b[3].y);
    }
  }
}

function randomBezier(x, y) {
  const points = [createVector(x, y)];
  for (let i = 0; i < 3; i++) {
    points.push(createVector(points[i].x + random(-DISTANCE, DISTANCE), points[i].y + random(-DISTANCE, DISTANCE)));
  }

  return points;
}

function reset() {
  randomPalette();
  noStroke();
  t1 = Timing.frames(60, { loop: false, easing: Easing.EaseInOutCubic });
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  t2 = t3 = undefined;

  background(0);
}
function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  reset();

  // pixelDensity(1);
}

function draw() {
  // background(0);
  for (const p of particles) {
    p.draw();
  }

  if (t1?.finished) {
    t1 = undefined;
    particles.forEach((p) => {
      if (p.type === Type.Point) {
        p.switchToLine();
      } else if (p.type === Type.Line) {
        p.type = Type.Plane;
      }
    });
    t2 = Timing.frames(180, { loop: false, easing: Easing.EaseInOutCubic });
  }
  if (t2?.finished) {
    t2 = undefined;
    particles = [];
    t3 = Timing.frames(1, { loop: false });
  }

  if (t3?.finished) {
    reset();
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
