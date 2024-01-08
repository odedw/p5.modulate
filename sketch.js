/// <reference types="p5/global" />

// constants
const NUM_COLS = 23;
const NUM_ROWS = 23;
const NUM_MOVES = 23;
const SIZE = 30;
const HEIGHT = SIZE * 2;
const WIDTH = Math.round(Math.sqrt(3) * SIZE);
console.log('===========================');
console.log(WIDTH, HEIGHT);
console.log('===========================');

// locals
const particles = [];
let pg, img;
let timer;
let horizontal = true;
let chosen = [];
let rowDir;
let rows, cols;
let TILE_SIZE;
let moves = [];
let mask;

class Particle {
  constructor(x, y, s, pg, row, col) {
    this.x = x;
    this.y = y;
    this.w = WIDTH;
    this.h = HEIGHT;
    this.s = s;
    this.row = row;
    this.col = col;
    this.dx = 0;
    this.frame = createGraphics(this.w, this.h);
    this.frame.image(pg.get(this.x, this.y, this.w, this.h), 0, 0, this.w, this.h);

    this.frame.fill(0);
    [
      [
        [0, 0],
        [this.w / 2, 0],
        [0, this.s / 2],
      ],
      [
        [this.w / 2, 0],
        [this.w, 0],
        [this.w, this.s / 2],
      ],
      [
        [this.w / 2, this.h],
        [this.w, this.h],
        [this.w, this.h - this.s / 2],
      ],
      [
        [0, this.h],
        [this.w / 2, this.h],
        [0, this.h - this.s / 2],
      ],
    ].forEach((t) => {
      this.frame.beginShape();
      t.forEach((v) => this.frame.vertex(v[0], v[1]));
      this.frame.endShape(CLOSE);
    });
  }
}
function preload() {
  img = loadImage('public/assets/ThePinkCloud_HenriEdmondCross.jpg');
}

function randomizeStart() {
  for (let i = 0; i < NUM_MOVES; i++) {
    randomizeNextMove();
    moves.push({
      rowDir: rowDir.map((r) => (r *= -1)),
      // colDir: colDir.map((c) => (c *= -1)),
    });
    for (const p of particles) {
      p.dx = rowDir[p.row] * TILE_SIZE;
      // p.dy = colDir[p.col] * TILE_SIZE;
    }
    commitMove();
  }
  moves.reverse();
  // colDir = moves[currentMove].colDir;
  rowDir = moves[currentMove].rowDir;
}

function randomizeNextMove() {
  horizontal = !horizontal;
  rowDir = Array(rows).fill(0);
  // colDir = Array(cols).fill(0);

  const numChosen = int(random(1, cols));

  chosen = [...Array(int(width / TILE_SIZE)).keys()].sort(() => 0.5 - Math.random()).slice(0, numChosen);

  chosen.forEach((c) => {
    if (horizontal) {
      // colDir[c] = Math.random() > 0.5 ? -1 : 1;
    } else {
      rowDir[c] = Math.random() > 0.5 ? -1 : 1;
    }
  });
}

function commitMove() {
  for (const p of particles) {
    if (p.dx !== 0) {
      p.x += WIDTH * rowDir[p.row];
      p.dx = 0;
      p.col += rowDir[p.row];
    }
    // if (p.dy !== 0) {
    //   p.y += TILE_SIZE * colDir[p.col];
    //   p.dy = 0;
    //   p.row += colDir[p.col];
    // }

    // wrap around
    if (p.col === cols) {
      p.col = 0;
      p.x = 0;
    } else if (p.col === -1) {
      p.col = cols - 1;
      p.x = width - TILE_SIZE;
    }

    // if (p.row === rows) {
    //   p.row = 0;
    //   p.y = 0;
    // } else if (p.row === -1) {
    //   p.row = rows - 1;
    //   p.y = height - TILE_SIZE;
    // }
  }
}

function updateDeltas() {
  for (const p of particles) {
    if (rowDir[p.row] !== 0) {
      p.dx = map(timer.elapsed, 0, 1, 0, WIDTH * rowDir[p.row]);
      console.log(p.dx);
    }
    // if (colDir[p.col] !== 0) {
    //   p.dy = map(timer.elapsed, 0, 1, 0, TILE_SIZE * colDir[p.col]);
    // }
  }
}

function setup() {
  createCanvas(600, 600);
  TILE_SIZE = width / NUM_COLS;
  stroke(255);
  rectMode(CENTER);
  noStroke();
  pg = createGraphics(600, 600);
  pg.image(img, 0, 0, width, height);
  blendMode(LIGHTEST);

  cols = 0;
  for (let y = 0; y < height; y += 1.5 * SIZE - 1) {
    rows = 0;
    for (let x = 0; x < width; x += WIDTH) {
      const offset = cols % 2 === 0 ? 0 : WIDTH / 2;
      particles.push(new Particle(x - offset, y, SIZE, pg, cols, rows));
      rows++;
    }
    cols++;
  }

  // particles.push(new Particle(0, 0, SIZE, pg, 0, 0));
  // randomizeStart();

  // fill directions with zeros

  // moves.push({
  //   rowDir: Array(cols).fill(1),
  // });
  rowDir = Array(rows).fill(0);
  rowDir[2] = 1;

  timer = Timing.frames(30, 0, false);
  //   background(0);
}

let currentMove = 0;
function draw() {
  blendMode(NORMAL);

  background(0);
  blendMode(LIGHTEST);

  for (const p of particles) {
    image(p.frame, p.x + p.dx, p.y, p.frame.width, p.frame.height);

    // render wrap around
    if (p.x + p.dx + WIDTH > width) {
      // image(p.frame, p.x + p.dx - width + WIDTH / 2, p.y, WIDTH, HEIGHT);
    }
    // if (p.row === rows - 1) {
    //   image(p.img, p.x + p.dx, p.y + p.dy - height, WIDTH, HEIGHT);
    // } else if (p.row === 0) {
    //   image(p.img, p.x + p.dx, p.y + p.dy + height, WIDTH, HEIGHT);
    // }
  }

  if (timer.finished) {
    commitMove();
    // currentMove++;
    // if (currentMove < moves.length) {
    //   colDir = moves[currentMove].colDir;
    //   rowDir = moves[currentMove].rowDir;
    //   timer.reset();
    // }
  } else {
    updateDeltas();
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
});
