/// <reference types="p5/global" />

// constants
const NUM_BOIDS = 700;
const MAX_SPEED = 5;
const MAX_FORCE = 0.2;
let ALIGN = 0;
let COHESION = 0;
let SEPARATION = 1;
// locals
let lastStateChange = 0;
let flock = [];
let pg;
let index = 0;
let states = [
  { text: '', align: 0, cohesion: 0, separation: 0, frames: 180 },
  { text: 'Genuary', align: 0, cohesion: 0, separation: 0, frames: 210 },
  { text: '2024', align: 0, cohesion: 0, separation: 0, frames: 180 },
];

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = MAX_FORCE;
    this.maxSpeed = MAX_SPEED;
    this.c = random(PALETTE);
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let separation = this.separation(boids);
    if (!!this.target) {
      let direction = p5.Vector.sub(this.target, this.position);
      direction.setMag(this.maxSpeed);
      this.acceleration.add(direction);
    }

    separation.mult(SEPARATION);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  draw() {
    strokeWeight(6);
    stroke(this.c);
    point(this.position.x, this.position.y);
  }
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  setPalette('Connection');
  pg = createGraphics(width, height);
  pg.background(0);
  pg.stroke(255);
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(150);
  pg.textFont('Courier New');
  for (let i = 0; i < NUM_BOIDS; i++) {
    flock.push(new Boid());
  }
  background(0);
  noLoop();
}

function draw() {
  background(0, 100);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.draw();
  }

  // image(pg, 0, 0);

  if (frameCount === lastStateChange + states[index].frames) {
    index = (index + 1) % states.length;
    lastStateChange = frameCount;

    pg.background(0);
    if (states[index].text === '') {
      for (const boid of flock) {
        boid.target = null;
      }
      // SEPARATION = 10;
    } else {
      // SEPARATION = 1;
      pg.text(states[index].text, width / 2, height / 2);
      for (const boid of flock) {
        while (true) {
          const x = random(width);
          const y = random(height);
          if (red(pg.get(x, y)) > 0) {
            boid.target = createVector(x, y);
            break;
          }
        }
      }
    }
  }
}

let isLooping = false;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }
}

P5Capture.setDefaultOptions({
  // disableUi: true,
  format: 'png',
  quality: 1,
  framerate: 60,
});
