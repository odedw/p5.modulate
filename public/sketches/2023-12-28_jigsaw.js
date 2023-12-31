/// <reference types="p5/global" />

// constants
const NUM_COLS = 26;
const NUM_ROWS = 26;
const NUM_MOVES = 20;

// locals
const particles = [];
let pg, img;
let timer;
let horizontal = true;
let chosen = [];
let rowDir, colDir;
let rows, cols;
let TILE_SIZE;
let moves = [];

function preload() {
  img = loadImage('public/assets/AlphonseMariaMucha1.jpg');
}

function randomizeStart() {
  for (let i = 0; i < NUM_MOVES; i++) {
    randomizeNextMove();
    moves.push({
      rowDir: rowDir.map((r) => (r *= -1)),
      colDir: colDir.map((c) => (c *= -1)),
    });
    for (const p of particles) {
      p.dx = rowDir[p.row] * TILE_SIZE;
      p.dy = colDir[p.col] * TILE_SIZE;
      // p.col += rowDir[p.col];
      // if (p.col === NUM_COLS) {
      //   p.col = 0;
      // } else if (p.col === -1) {
      //   p.col = NUM_COLS - 1;
      // }
      // p.row += colDir[p.row];
      // if (p.row === NUM_ROWS) {
      //   p.row = 0;
      // } else if (p.row === -1) {
      //   p.row = NUM_ROWS - 1;
      // }
    }
    commitMove();
  }
  moves.reverse();
  colDir = moves[currentMove].colDir;
  rowDir = moves[currentMove].rowDir;
}

function setup() {
  createCanvas(600, 600);
  TILE_SIZE = width / NUM_COLS;
  stroke(255);
  rectMode(CENTER);
  noStroke();
  pg = createGraphics(600, 600);
  pg.image(img, 0, 0, width, height);
  // pg.loadPixels();
  cols = int(width / TILE_SIZE);
  rows = int(height / TILE_SIZE);
  for (let x = 0; x < NUM_COLS; x++) {
    for (let y = 0; y < NUM_ROWS; y++) {
      particles.push({
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
        row: y,
        col: x,
        dx: 0,
        dy: 0,
        img: pg.get(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE),
      });
    }
  }

  randomizeStart();

  // fill directions with zeros

  timer = Timing.frames(30, 0, false);
  //   background(0);
}

function randomizeNextMove() {
  horizontal = !horizontal;
  rowDir = Array(rows).fill(0);
  colDir = Array(cols).fill(0);

  const numChosen = int(random(1, cols));

  chosen = [...Array(int(width / TILE_SIZE)).keys()].sort(() => 0.5 - Math.random()).slice(0, numChosen);

  chosen.forEach((c) => {
    if (horizontal) {
      colDir[c] = Math.random() > 0.5 ? -1 : 1;
    } else {
      rowDir[c] = Math.random() > 0.5 ? -1 : 1;
    }
  });
}

function commitMove() {
  for (const p of particles) {
    if (p.dx !== 0) {
      p.x += TILE_SIZE * rowDir[p.row];
      p.dx = 0;
      p.col += rowDir[p.row];
    }
    if (p.dy !== 0) {
      p.y += TILE_SIZE * colDir[p.col];
      p.dy = 0;
      p.row += colDir[p.col];
    }

    // wrap around
    if (p.col === cols) {
      p.col = 0;
      p.x = 0;
    } else if (p.col === -1) {
      p.col = cols - 1;
      p.x = width - TILE_SIZE;
    }

    if (p.row === rows) {
      p.row = 0;
      p.y = 0;
    } else if (p.row === -1) {
      p.row = rows - 1;
      p.y = height - TILE_SIZE;
    }
  }
}

function updateDeltas() {
  for (const p of particles) {
    if (rowDir[p.row] !== 0) {
      p.dx = map(timer.elapsed, 0, 1, 0, TILE_SIZE * rowDir[p.row]);
    }
    if (colDir[p.col] !== 0) {
      p.dy = map(timer.elapsed, 0, 1, 0, TILE_SIZE * colDir[p.col]);
    }
  }
}

let currentMove = 0;
function draw() {
  background(0);
  for (const p of particles) {
    image(p.img, p.x + p.dx, p.y + p.dy, TILE_SIZE, TILE_SIZE);

    // render wrap around
    if (p.col === cols - 1) {
      image(p.img, p.x + p.dx - width, p.y + p.dy, TILE_SIZE, TILE_SIZE);
    } else if (p.col === 0) {
      image(p.img, p.x + p.dx + width, p.y + p.dy, TILE_SIZE, TILE_SIZE);
    }
    if (p.row === rows - 1) {
      image(p.img, p.x + p.dx, p.y + p.dy - height, TILE_SIZE, TILE_SIZE);
    } else if (p.row === 0) {
      image(p.img, p.x + p.dx, p.y + p.dy + height, TILE_SIZE, TILE_SIZE);
    }
  }

  if (timer.finished) {
    commitMove();
    currentMove++;
    if (currentMove < moves.length) {
      colDir = moves[currentMove].colDir;
      rowDir = moves[currentMove].rowDir;
      timer.reset();
    }
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
