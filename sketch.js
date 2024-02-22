/// <reference types="p5/global" />

// constants
const ITERATIONS = 10000;

// locals
let blooms = [];
let visitedMatrix, mappingMatrix;
let gradient1Img, gradient1Pg;
class Bloom {
  constructor(x, y, pg) {
    this.x = x;
    this.y = y;
    this.pg = createGraphics(pg.width, pg.height);
    this.pg.image(pg, 0, 0);
    this.visitedPg = new Matrix(pg.width, pg.height, false);
    this.pg.loadPixels();

    const startPointInPg = { x: 0, y: 0 };
    this.frontier = [{ x, y }];

    mappingMatrix.set(x, y, startPointInPg);
    this.visitedPg.set(startPointInPg.x, startPointInPg.y, true);
    this.visitedCount = 1;
    const color = this.pg.get(startPointInPg.x, startPointInPg.y);
    stroke(color);
    strokeWeight(1);
    rect(x, y, 1, 1);
  }

  draw() {
    if (this.frontier.length === 0) {
      return;
    }

    // choose one point
    const frontierIndex = int(random(this.frontier.length));
    const point = this.frontier[frontierIndex];

    // find an unvisited neighbor
    const neighbors = mappingMatrix.getNeighbors(point.x, point.y, (val) => !val);
    if (neighbors.length === 0) {
      this.frontier.splice(frontierIndex, 1);
      return;
    }

    const target = random(neighbors);

    // start from mapped point and run bfs
    const startPointInPg = mappingMatrix.get(point.x, point.y);
    let endPointInPg = this.visitedPg.bfs(startPointInPg, (val) => !val);
    // const queue = [startPointInPg];
    // while (queue.length > 0) {
    //   const current = queue.shift();
    //   const neighbors = this.visitedPg
    //     .getNeighbors(current.x, current.y, (val) => !val)
    //     .sort(() => Math.random() - 0.5);

    //   for (const neighbor of neighbors) {
    //     if (!this.visitedPg.get(neighbor.x, neighbor.y)) {
    //       endPointInPg = neighbor;
    //       break;
    //     }
    //     queue.push(neighbor);
    //   }
    // }

    if (!endPointInPg) {
      return;
    }

    // mark it
    this.visitedPg.set(endPointInPg.x, endPointInPg.y, true);
    this.visitedCount++;
    mappingMatrix.set(target.x, target.y, endPointInPg);
    this.frontier.push(target);

    //draw
    const index = (target.y * width + target.x) * 4;
    const pgIndex = (endPointInPg.y * this.pg.width + endPointInPg.x) * 4;
    pixels[index] = this.pg.pixels[pgIndex];
    pixels[index + 1] = this.pg.pixels[pgIndex + 1];
    pixels[index + 2] = this.pg.pixels[pgIndex + 2];
    pixels[index + 3] = this.pg.pixels[pgIndex + 3];
  }
}
function preload() {
  gradient1Img = loadImage('public/assets/gradient2.png');
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  gradient1Pg = createGraphics(gradient1Img.width, gradient1Img.height);
  gradient1Pg.image(gradient1Img, 0, 0);
  visitedMatrix = new Matrix(width, height, false);
  mappingMatrix = new Matrix(width, height, null);

  blooms.push(new Bloom(width / 2, height / 2, gradient1Pg));
  background(0);
}

function draw() {
  loadPixels();
  for (let i = 0; i < ITERATIONS; i++) {
    for (const b of blooms) {
      b.draw();
    }
  }
  if (frameCount % 60 === 0) {
    console.log(blooms[0].frontier.length, blooms[0].visitedCount);
  }
  updatePixels();
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

// P5Capture.setDefaultOptions({
//   disableUi: true,
//   format: 'mp4',
//   quality: 1,
//   framerate: 60,
// });
