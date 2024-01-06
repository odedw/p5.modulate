/// <reference types="p5/global" />

// constants
const NUM_STARS = 100000;
const NUM_BUILDINGS = 7;
const NUM_OVERLAPPING_BUILDINGS = 2;
const BUILDING_LIGHT_COLOR = '#fff663';
const STAR_COLOR = '#ffffff';

// locals
const particles = [];
let buildings = [];
const comets = [];
let framesTillNextComet = 180;
let starCenter;

class Particle {
  constructor(x, y, size, c, freq) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = c;
    if (freq) {
      const phase = int(random(freq));
      this.lfo = createLfo(LfoWaveform.Square, Timing.frames(freq, phase), 0, 1);
    }
  }

  draw(center = { x: 0, y: 0 }) {
    if (!!this.lfo && this.lfo.value == 0) {
      return;
    }
    fill(red(this.c), green(this.c), blue(this.c), alpha(this.c)), // * this.lfo.value);
      push();
    translate(this.x - center.x, this.y - center.y);
    square(0, 0, this.size);
    pop();
  }

  isOnScreen(rotation) {
    const { r, a } = cartesianToPolar(this.x - starCenter.x, this.y - starCenter.y);
    const { x, y } = polarToCartesian(r, a + rotation);
    const x2 = x + starCenter.x;
    const y2 = y + starCenter.y;

    return x2 >= 0 && x2 <= width && y2 >= 0 && y2 <= height;
  }
}

class Building {
  constructor(x, w, h) {
    this.x = x;
    this.y = height - h;
    this.w = w;
    this.h = h;
    const xGap = random(2, 10);
    const yGap = random(2, 10);
    this.points = generateGrid(int(w / xGap), int(h / yGap), w, h);
    const c = color(
      red(BUILDING_LIGHT_COLOR),
      green(BUILDING_LIGHT_COLOR),
      blue(BUILDING_LIGHT_COLOR),
      random(120, 160)
    );
    this.lights = this.points
      .map(
        (point) =>
          new Particle(
            this.x + point.x,
            this.y + point.y,
            random(1, 3),
            c,
            Math.random() < 0.5 ? int(random(12000, 24000)) : null
          )
      )
      .filter((p) => !!p);
  }

  draw() {
    fill(0);
    rect(this.x, height - this.h, this.w, this.h);
    for (let i = 0; i < this.lights.length; i++) {
      const l = this.lights[i];
      l.draw();
    }
  }

  contains(x, y) {
    return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
  }
}

class Comet {
  streak = [];
  constructor(x, y, a, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.a = a;
    this.alpha = 255;
    this.alphaDegradation = 10;
    this.sizeDegradation = 0.1;
  }

  draw() {
    if (this.s <= 0 || this.alpha <= 0) {
      return;
    }

    stroke(255, 255, 255, this.alpha);
    this.x += cos(this.a) * 100;
    this.y += sin(this.a) * 100;

    this.streak.push({ x: this.x, y: this.y });
    if (this.streak.length > 10) {
      this.streak.shift();
    }

    for (let i = this.streak.length - 1; i >= 1; i--) {
      stroke(255, 255, 255, this.alpha * (i / this.streak.length));
      line(this.streak[i].x, this.streak[i].y, this.streak[i - 1].x, this.streak[i - 1].y);
    }

    this.s -= this.sizeDegradation;
    this.alpha -= this.alphaDegradation;
  }
}

function resetBuildings() {
  let highestBuilding = null;
  rerun = false;
  let overlapCount = 0;
  buildings = [];
  while (buildings.length < NUM_BUILDINGS) {
    const x = random(width);
    const w = random(width * 0.05, width * 0.2);
    const h = random(height * 0.1, height * 0.5);
    const c = color(255, 255, 255, random(255));
    const b = new Building(x, w, h, c);
    if (b.x < w / 2 || b.x + b.w > width - w / 2) {
      continue;
    }
    const overlappingBuildings = buildings.filter((b) => b.x <= x && b.x + b.w >= x);
    if (overlappingBuildings.length <= 2 || (overlapCount >= NUM_OVERLAPPING_BUILDINGS && overlappingBuildings === 0)) {
      buildings.push(b);
      highestBuilding = highestBuilding ? (b.h > highestBuilding.h ? b : highestBuilding) : b;
      overlapCount++;
    }
  }
  buildings.push(new Particle(highestBuilding.x + highestBuilding.w / 2, highestBuilding.y - 5, 3, 'red', 200));
}

function setup() {
  createCanvas(700, 700);
  noStroke();
  starCenter = { x: width * 0.5, y: height * 0.9 };

  strokeWeight(0.5);
  const maxR = sqrt(width ** 2 + height ** 2) / 2;

  resetBuildings();

  while (particles.length < NUM_STARS) {
    const x = random(-width * 2, width * 2);
    const y = random(-height * 2, height * 2);
    const { r } = cartesianToPolar(x - starCenter.x, y - starCenter.y);
    if (r > maxR * 2) {
      continue;
    }
    const size = random(0.05, 1.5);
    const c = color(255, 255, 255, random(255));
    particles.push(new Particle(x, y, size, c, int(random(3000, 6000))));
  }
}

function draw() {
  background(0);

  for (const comet of comets) {
    comet.draw();
  }

  noStroke();

  push();
  translate(starCenter.x, starCenter.y);
  const angle = frameCount / 5000;
  rotate(angle);
  for (const particle of particles) {
    if (particle.isOnScreen(angle)) {
      particle.draw(starCenter);
    }
  }

  pop();

  for (const b of buildings) {
    b.draw();
  }

  if (--framesTillNextComet <= 0) {
    const x = random(0.1 * width, 0.9 * width);
    comets.push(
      new Comet(x, random(0.3 * height), x < width / 2 ? random(0.15 * PI, 0.25 * PI) : random(0.75 * PI, 0.85 * PI), 2)
    );
    framesTillNextComet = random(120, 300);
  }
}

function mouseClicked() {
  resetBuildings();
}

P5Capture.setDefaultOptions({
  disableUi: true,
});
