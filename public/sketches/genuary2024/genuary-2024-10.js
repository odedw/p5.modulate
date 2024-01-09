/// <reference types="p5/global" />

// constants
const SIZE = 3;
const WIDTH = Math.sqrt(3) * SIZE;
const HEIGHT = SIZE * 2;
const FRAME_RATE = 1;
const DEBUG = false;

// locals
const cells = [];
let RULES = [];
let palette = [];
let rows, cols;
let ruleIndex = 0;
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.state = false;
    this.nextState = null;
    this.neighbors = [];
    const offset = this.row % 2 ? WIDTH / 2 : 0;
    this.x = this.col * WIDTH + offset;
    this.y = (this.row * HEIGHT * 3) / 4;
  }

  update() {
    this.highlighted = false;
    this.numLivingNeighbors = this.neighbors.filter((c) => c.state).length;
    const rules = this.state ? RULES[0] : RULES[1];
    this.nextState = rules.includes(this.numLivingNeighbors);
  }

  commit() {
    this.state = this.nextState;
  }

  draw() {
    if (DEBUG) stroke(255);
    fill(this.state ? palette[this.numLivingNeighbors - 1] : 0);
    push();
    translate(this.x, this.y);

    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const x2 = SIZE * Math.cos(angle);
      const y2 = SIZE * Math.sin(angle);
      vertex(x2, y2);
    }
    endShape(CLOSE);
    if (DEBUG) {
      textAlign(CENTER, CENTER);
      fill(this.highlighted || this.state ? 0 : 255);
      stroke(this.highlighted || this.state ? 0 : 255);
      text(`${this.col},${this.row}`, 0, 0);
    }
    pop();
  }
}

function reset() {
  let row = 0,
    col = 0;

  if (!cells.length) {
    // create cells
    for (let y = 0; y < height + HEIGHT; y += 1.5 * SIZE) {
      col = 0;
      for (let x = 0; x < width + WIDTH; x += WIDTH) {
        cells.push(new Cell(row, col));
        col++;
      }
      row++;
    }
    rows = row;
    cols = col;

    // set neighbors
    for (const c of cells) {
      const { row, col } = c;
      const offset = row % 2;
      const neighbors = [
        [col - 1, row],
        [col + 1, row],
        [col - 1 + offset, row + 1],
        [col + offset, row + 1],
        [col - 1 + offset, row - 1],
        [col + offset, row - 1],
      ];
      for (const [col, row] of neighbors) {
        const neighbor = cells.find((c) => c.row === row && c.col === col);
        if (neighbor) {
          c.neighbors.push(neighbor);
        }
      }
    }
  } else {
    // reset cells
    for (const c of cells) {
      c.state = false;
      c.nextState = null;
    }
  }
  // set ruleset and colors
  // RULES = [RULESETS[ruleIndex][0], RULESETS[ruleIndex][1]];
  // console.log('rule index', ruleIndex);
  const live = [1, 2, 3, 4, 5, 6].toSorted(() => random(-1, 1)).slice(0, int(random(1, 6)));
  const dead = [1, 2, 3, 4, 5, 6].toSorted(() => random(-1, 1)).slice(0, int(random(1, 6)));
  RULES = [live, dead];
  palette = [1, 2, 3, 4, 5, 6].map(() => color(random(255), random(255), random(255)));

  // initialize center
  const centerCell = cells.find((c) => c.row === int(rows / 2) && c.col === int(cols / 2));
  centerCell.state = true;
  centerCell.neighbors.forEach((c) => (c.state = true));
  centerCell.neighbors.flatMap((c) => c.neighbors).forEach((c) => (c.state = true));
}

function setup() {
  createCanvas(800, 800);
  rectMode(CENTER);
  noStroke();
  reset();
  background(0);
}

function draw() {
  background(0);
  for (const c of cells) {
    c.update();
  }
  for (const c of cells) {
    c.commit();
    c.draw();
  }
}

function keyPressed() {
  if (key === ' ') {
    reset();
  }
}

P5Capture.setDefaultOptions({
  disableUi: true,
});

// const RULESETS = [
//   [
//     [4, 3, 2, 6, 5],
//     [4, 2],
//   ],
//   [
//     [3, 2, 1],
//     [4, 3, 2],
//   ],
//   [[4, 5, 1], [2]],
//   [
//     [6, 5, 4, 3, 2],
//     [1, 5, 6],
//   ],
//   [[4, 3, 2], [1]],
//   [
//     [5, 4, 3],
//     [1, 2, 3],
//   ],
//   [[1, 5, 4], [1]],
//   [
//     [1, 5, 2, 4, 3],
//     [1, 2, 3, 6],
//   ],
// ];
