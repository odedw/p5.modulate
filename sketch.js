/// <reference types="p5/global" />
// constants
const PARTICLE_COUNT = 50;
const SEQUENCER_STEPS = 8;
const SEQUENCER_FREQUENCY = 8;

class Particle {
  constructor() {
    this.position = createVector(random(0, width), random(0, height));
    this.color = color(random(0, 255), random(0, 255), random(0, 255));

    this.angle = random(0, TWO_PI);
    this.sequencers = {
      size: createSequencer({
        frequency: TimeFunction.frames(SEQUENCER_FREQUENCY),
        steps: SEQUENCER_STEPS,
        min: random(50, 100),
        max: random(150, 200),
      }),
      angle: createSequencer({
        frequency: TimeFunction.frames(SEQUENCER_FREQUENCY),
        steps: SEQUENCER_STEPS,
        min: -PI,
        max: PI,
      }),
    };
  }

  update() {}

  draw() {
    push();
    fill(this.color);
    noStroke();
    translate(this.position.x, this.position.y);
    rotate(this.sequencers.angle.value);
    rect(0, 0, this.sequencers.size.value, this.sequencers.size.value);
    pop();
  }
}

// locals
let lfo1;
let sequencer1, sequencer2;
function setup() {
  createCanvas(700, 700);
  rectMode(CENTER);
  // lfo1 = createLfo({
  //   waveform: WAVE_SINE,
  //   frequency: TimeFunction.frames(6),
  //   min: -PI,
  //   max: PI,
  // });
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // pixelDensity(1);
  //   background(0);

  sequencer1 = createSequencer({
    steps: 8,
    min: 0,
    max: 1,
    frequency: TimeFunction.frames(SEQUENCER_FREQUENCY),
  });

  sequencer2 = createSequencer({
    steps: 8,
    min: 0,
    max: 1,
    frequency: TimeFunction.frames(SEQUENCER_FREQUENCY),
  });
}

function draw() {
  background(0, 0, 0, 100);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  // draw sequencer1
  for (let i = 0; i < sequencer1.steps; i++) {
    const x = map(i, 0, sequencer1.steps, 0, width);
    const y = map(sequencer1.value, 0, 1, height, 0);
    const w = width / sequencer1.steps;
    const h = height - y;

    if (i === sequencer1.step) {
      fill(255, 0, 0);
    } else {
      fill(0);
    }

    rect(x, y, w, h);
  }

  // draw sequencer2
  for (let i = 0; i < sequencer2.steps; i++) {
    const x = map(i, 0, sequencer2.steps, 0, width);
    const y = map(sequencer2.value, 0, 1, height, 0);
    const w = width / sequencer2.steps;
    const h = height - y;

    if (i === sequencer2.step) {
      fill(0, 255, 0);
    } else {
      fill(0);
    }

    rect(x, y, w, h);
  }
}

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
}
