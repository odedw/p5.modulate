/// <reference types="p5/global" />

// constants
const NUM_BOIDS = 300;
const MAX_SPEED = 5;
const MAX_FORCE = 0.2;
let ALIGN = 1;
let COHESION = 1;
let SEPARATION = 1;
let values = [
  [5, 1, 1, 50],
  [1, 5, 1, 10],
  [1, 1, 5, 0],
];
let index = 0;
// locals
let flock = [];

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

  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
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

  cohesion(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(ALIGN);
    cohesion.mult(COHESION);
    separation.mult(SEPARATION);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
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
  setPalette('Light');
  // pixelDensity(1);
  //   background(0);
  for (let i = 0; i < NUM_BOIDS; i++) {
    flock.push(new Boid());
  }
  background(0);
  noLoop();
}

function draw() {
  background(0, values[index % values.length][3]);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.draw();
  }

  if (frameCount % 120 === 0) {
    index++;
    ALIGN = values[index % values.length][0];
    COHESION = values[index % values.length][1];
    SEPARATION = values[index % values.length][2];
  }
}

let isLooping = false;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }

  isLooping = !isLooping;
}

P5Capture.setDefaultOptions({
  // disableUi: true,
  format: 'mp4',
  quality: 1,
  framerate: 60,
});
