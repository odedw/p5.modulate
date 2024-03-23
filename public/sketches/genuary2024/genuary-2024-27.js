/// <reference types="p5/global" />

// constants
const BALL_SIZE = 5;
const BULGE_SIZE = 60;
const BULGE_COUNT = 7;
const BALL_COUNT = 500;
const GAP_SIZE = 30;
const PEG_SIZE = 10;

// locals
const { Bodies, Composite, Engine, Events, World, Runner, Body } = Matter;
let engine = Engine.create();
let world = engine.world;
let wheel;
let rotationLfo;
class Wheel {
  constructor() {
    const sectionCount = 250;

    this.r = 280;

    this.sections = [];

    for (let i = 0; i < sectionCount; i++) {
      let segment = TAU / sectionCount;
      let a = (i / sectionCount) * TAU + segment / 2;
      let x = cos(a);
      let y = sin(a);
      let cx = x * this.r;
      let cy = y * this.r;
      let rect = addRect({
        x: cx,
        y: cy,
        w: 10,
        h: 10,
        options: { angle: a, isStatic: true },
      });
      this.sections.push(rect);
    }

    this.bulges = [];
    for (let i = 0; i < BULGE_COUNT; i++) {
      let segment = TAU / BULGE_COUNT;
      let a = (i / BULGE_COUNT) * TAU + segment / 2;
      let x = cos(a);
      let y = sin(a);
      let cx = x * this.r;
      let cy = y * this.r;
      let circle = addCircle({ x: cx, y: cy, r: BULGE_SIZE, options: { angle: a, isStatic: true } });
      this.bulges.push(circle);
    }

    // add pegs
    this.pegs = [];
    for (let y = -this.r; y <= this.r; y += PEG_SIZE * 2 + GAP_SIZE) {
      let xLimit = sqrt(this.r * this.r - y * y);

      for (let x = -xLimit; x <= xLimit; x += PEG_SIZE * 2 + GAP_SIZE) {
        let peg = addCircle({ x, y, r: PEG_SIZE, options: { isStatic: true } });
        this.pegs.push(peg);
      }
    }
    console.log(this.pegs.length);

    this.body = Body.create({ parts: [...this.sections, ...this.bulges, ...this.pegs], isStatic: true });
  }

  draw() {
    Body.rotate(this.body, rotationLfo.value);
    // Body.angle = rotationLfo.value;
    const s = 255;
    stroke(s);
    strokeWeight(20);
    fill('#EEBA40');
    ellipse(0, 0, this.r * 2);
    noStroke();
    fill(s);
    [...this.sections, ...this.bulges, ...this.pegs].forEach((b) => {
      beginShape();
      b.vertices.forEach(({ x, y }) => vertex(x, y));
      endShape(CLOSE);
    });

    // pop();
  }
}

class Ball {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, BALL_SIZE, {
      restitution: 0.1,
      // torque: random(-0.05, 0.05),
      label: 'ball',
    });
    const baseColor = color('#585758');
    const variation = 5;
    this.c = color(
      red(baseColor) + random(-variation, variation),
      green(baseColor) + random(-variation, variation),
      blue(baseColor) + random(-variation, variation)
    );
    World.add(world, this.body);
  }

  draw() {
    push();
    noStroke();
    fill(this.c);
    ellipse(this.body.position.x, this.body.position.y, this.body.circleRadius * 2);
    // const pos = this.body.position;
    // ellipse(pos.x, pos.y, BALL_SIZE * 2);
    pop();
  }
}

function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
  let body = Bodies.rectangle(x, y, w, h, options);
  World.add(world, body);
  return body;
}
function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
  let body = Bodies.circle(x, y, r, options);
  World.add(world, body);
  return body;
}
const balls = [];
function setup() {
  createCanvas(700, 700);
  rectMode(CENTER);
  rotationLfo = createLfo(LfoWaveform.Sine, Timing.frames(520), -0.05, 0);
  wheel = new Wheel();
  for (let i = 0; i < BALL_COUNT; i++) {
    balls.push(new Ball(0, -200));
  }
}

function draw() {
  Engine.update(engine);
  background('#832B29');
  translate(width / 2, height / 2);
  wheel.draw();
  for (let ball of balls) {
    ball.draw();
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
  format: 'png',
  quality: 1,
  framerate: 60,
});
