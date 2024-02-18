/// <reference types="p5/global" />

// constants
const MIN_RADIUS = 20;
const DIFF_RADIUS = 20;
const NUM_CIRCLES = 4;
const SIZE = MIN_RADIUS * (NUM_CIRCLES + 1);

// locals
let particles = [],
  cells = [],
  lfo1,
  pg1,
  pg2,
  t1;

const Scenes = {
  SquaresVertical: 0,
  SquaresHorizontal: 1,
  Circles: 2,
};
initScenes([Scenes.SquaresVertical, Scenes.Circles, Scenes.SquaresHorizontal, Scenes.Circles]);

class Cell {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  draw(frame) {
    frame.push();
    frame.translate(this.x, this.y);
    frame.noStroke();
    frame.fill(this.c);
    frame.rect(0, 0, this.w, this.h);
    frame.pop();
  }
}

class Particle {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.colors = colors;
  }

  draw() {
    push();
    translate(this.x, this.y);
    // rotate(lfo1.value);
    noFill();
    stroke(255);
    strokeWeight(2);
    const coords = [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ];
    for (let i = 0; i < NUM_CIRCLES; i++) {
      for (let j = 0; j < 4; j++) {
        stroke(this.colors[j]);
        arc(0, 0, MIN_RADIUS + i * DIFF_RADIUS, MIN_RADIUS + i * DIFF_RADIUS, j * HALF_PI, (j + 1) * HALF_PI);
      }
    }
    pop();
  }
}

function onSceneChanged(prev, next) {
  if (next === Scenes.Circles) {
    for (const p of particles) {
      p.colors = [
        pg2.get(p.x + SIZE / 2, p.y + SIZE / 2),
        pg2.get(p.x - SIZE / 2, p.y + SIZE / 2),
        pg2.get(p.x - SIZE / 2, p.y - SIZE / 2),
        pg2.get(p.x + SIZE / 2, p.y - SIZE / 2),
      ];
    }

    const p = particles[0];
  }
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  randomPalette();
  for (let x = 0; x <= width; x += SIZE) {
    for (let y = 0; y <= height; y += SIZE) {
      particles.push(new Particle(x, y, [color(255), color(255), color(255), color(255)]));
      cells.push(new Cell(x, y, SIZE, SIZE, random(PALETTE)));
    }
  }

  background(0, 0, 0, 0);
  for (const p of particles) {
    p.draw();
  }
  pg1 = createGraphics(width, height);
  pg2 = createGraphics(width, height);
  // cells.forEach((c) => c.draw(pg1));
  cells.forEach((c) => c.draw(pg2));
  maskBuffer();

  // lfo1 = createLfo(LfoWaveform.Sawtooth, Timing.frames(120), 0, TWO_PI);
  // pixelDensity(1);
  //   background(0);
}

function maskBuffer() {
  const start = millis();
  pg1.background(0);
  loadPixels();
  pg1.loadPixels();
  pg2.loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (x + y * width) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      if (r != 0 && g != 0 && b != 0) {
        pg1.pixels[index] = pg2.pixels[index];
        pg1.pixels[index + 1] = pg2.pixels[index + 1];
        pg1.pixels[index + 2] = pg2.pixels[index + 2];
        pg1.pixels[index + 3] = pg2.pixels[index + 3];
      }
    }
  }
  pg1.updatePixels();

  console.log('copyToImageBuffer', millis() - start);
}

function draw() {
  background(0);
  if (currentScene === Scenes.Circles) {
    for (const p of particles) {
      p.draw();
    }
  } else {
    image(pg1, 0, 0);
  }
}

let isLooping = true;
function mouseClicked() {
  // scene = scene === Scenes.Circles ? Scenes.Squares : Scenes.Circles;
  nextScene();
  // if (isLooping) {
  //   noLoop();
  // } else {
  //   loop();
  // }

  // isLooping = !isLooping;
}

// P5Capture.setDefaultOptions({
//   disableUi: true,
//   format: 'mp4',
//   quality: 1,
//   framerate: 60,
// });
