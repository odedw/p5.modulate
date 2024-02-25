/// <reference types="p5/global" />

// constants
const ITERATIONS = 10000;

// locals
let blooms = [];
let visitedMatrix, mappingMatrix;
let gradient1Img, gradient1Pg, gradient2Img, gradient2Pg;

const Scenes = {
  BFS: 0,
  DFS: 1,
};
initScenes([Scenes.BFS, Scenes.DFS]);

class Bloom {
  constructor(x, y, pg) {
    this.x = x;
    this.y = y;
    this.setPg(pg);

    this.frontier = [{ x, y }];
  }

  setPg(pg) {
    this.pg = createGraphics(pg.width, pg.height);
    this.pg.image(pg, 0, 0);
    this.pg.loadPixels();
    this.visitedPg = new Matrix(pg.width, pg.height, false);

    const startPointInPg = { x: 0, y: 0 };
    mappingMatrix.set(this.x, this.y, startPointInPg);
    this.visitedPg.set(startPointInPg.x, startPointInPg.y, true);
    const color = this.pg.get(startPointInPg.x, startPointInPg.y);
    stroke(color);
    strokeWeight(1);
    rect(this.x, this.y, 1, 1);
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
  // gradient2Img = loadImage('public/assets/gradient2.png');
}

function setup() {
  createCanvas(1000, 1000);
  stroke(255);
  rectMode(CENTER);
  pixelDensity(1);
  gradient1Pg = createGraphics(width, height);
  gradient1Pg.image(gradient1Img, 0, 0, width, height);
  // gradient2Pg = createGraphics(width, height);
  // gradient2Pg.image(gradient2Img, 0, 0, width, height);

  visitedMatrix = new Matrix(width, height, false);
  mappingMatrix = new Matrix(width, height, null);

  blooms.push(new Bloom(int(random(width)), int(random(height)), gradient1Pg));
  blooms.push(new Bloom(int(random(width)), int(random(height)), gradient1Pg));
  blooms.push(new Bloom(int(random(width)), int(random(height)), gradient1Pg));
  background(0);
}

let pgBool = false;

function draw() {
  loadPixels();
  for (let i = 0; i < ITERATIONS; i++) {
    for (const b of blooms) {
      b.draw();
    }
  }
  if (frameCount % 5 === 0) {
    console.log('===========================');

    // blooms.forEach((b) => b.setPg(gradient1Pg));
    // pgBool = !pgBool;
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
