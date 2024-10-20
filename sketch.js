/// <reference types="p5/global" />

// constants
const MIN_BLOCKS = 10;
const MAX_BLOCKS = 20;
const MIN_W = 20;
const MAX_W = 200;
const BLOCK_HEIGHT = 20;
const BALL_SIZE = 10;
const RESTITUTION = 0.9;

// locals
let midiInitialized = false;
let sequencers = [];
let output;

function noteName(note) {
  return `${note.name().toUpperCase()}${note.accidental()}${note.octave()}`;
}

// var render = Render.create({
//   element: document.body,
//   engine: engine,
//   options: {
//     width: 700,
//     height: 700,
//   },
// });

// Render.run(render);

class Block {
  constructor(x, y, w, h, a, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
    this.c = c;
    this.b = addRect({
      x,
      y,
      w,
      h,
      options: { angle: a, isStatic: true, restitution: RESTITUTION, friction: 0, label: 'block' },
    });
  }

  draw() {
    push();
    translate(this.b.position.x, this.b.position.y);
    rotate(this.a);
    fill(this.c);
    noStroke();
    rect(0, 0, this.w, this.h);
    pop();
  }
}

class Ball {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.b = addCircle({
      x,
      y,
      r,
      options: {
        restitution: RESTITUTION,
        // torque: random(-0.05, 0.05),
        label: 'ball',
      },
    });
  }
  draw() {
    fill(this.c);
    noStroke();
    ellipse(this.b.position.x, this.b.position.y, this.r * 2);
  }
}

function addRect({ x, y, w, h, options = {} } = {}) {
  let body = Bodies.rectangle(x, y, w, h, options);
  World.add(world, body);
  return body;
}

function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
  let body = Bodies.circle(x, y, r, options);
  World.add(world, body);
  return body;
}

function init() {
  randomPalette();
  blocks = [];
  const numBlocks = int(random(MIN_BLOCKS, MAX_BLOCKS));
  console.log('===========================');
  console.log('numBlocks', numBlocks);
  for (let i = 0; i < numBlocks; i++) {
    const w = random(MIN_W, MAX_W);
    const x = random(w, width - w);
    const y = random(BLOCK_HEIGHT, height - BLOCK_HEIGHT);
    const h = BLOCK_HEIGHT;
    const a = random(TAU);
    const c = random(PALETTE);
    const newBlock = new Block(x, y, w, h, a, c);
    let overlap = false;
    for (let j = 0; j < blocks.length; j++) {
      const otherBlock = blocks[j];
      overlap = areRectanglesColliding(otherBlock, newBlock, 20);
      if (overlap) {
        i--;
        World.remove(world, newBlock.b);
        break;
      }
    }
    if (!overlap) {
      blocks.push(newBlock);
    }
  }
  balls = [];
  console.log('===========================');
}
function setup() {
  createCanvas(500, 500);
  stroke(255);
  rectMode(CENTER);
  const midi = new Midi();
  midi.init().then(() => {
    // midi.list();
    output = midi.getOutput('browser-out');
    midiInitialized = true;
  });
  const root = teoria.note('a2');
  const scale = root.scale('lydian').notes();
  sequencers.push(new Sequencer(8, scale[0], 'voice1', 1));
  sequencers.push(new Sequencer(8, scale[4], 'voice2', 2));
  sequencers.push(new Sequencer(8, scale[6], 'voice3', 3));
  setInterval(() => {
    if (midiInitialized) {
      sequencers.forEach((sequencer, i) => {
        const note = sequencer.tick();
        if (output) {
          output.channels[sequencer.channel].playNote(noteName(note), {
            duration: 900,
          });
        }
      });
    }
  }, 1000);

  // pixelDensity(1);
  //   background(0);
}

function draw() {
  Engine.update(engine);
  // translate(width / 2, height / 2);

  background(0);
  for (const b of blocks) {
    b.draw();
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    if (balls[i].b.position.y > height + BALL_SIZE) {
      World.remove(world, balls[i].b);
      balls.splice(i, 1);
    } else {
      balls[i].draw();
    }
  }

  if (frameCount % 60 === 0 && !!spawnX) {
    const x = spawnX;
    // for (let x = 0; x < width; x += 30) {
    const y = -100;
    const r = BALL_SIZE;
    balls.push(new Ball(x, y, r, 255));
    // }
  }
}

let isLooping = true;
function mouseClicked() {
  spawnX = mouseX;
  // if (isLooping) {
  //   noLoop();
  // } else {
  //   loop();
  // }

  // isLooping = !isLooping;
}

function keyPressed() {
  if (key === ' ') {
    for (const s of sequencers) {
      s.reset();
    }
  }
}

// P5Capture.setDefaultOptions({
//   disableUi: true,
//   format: 'mp4',
//   quality: 1,
//   framerate: 60,
// });
