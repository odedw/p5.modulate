/// <reference types="p5/global" />

// constants
const SIZE = 75;
const NUM_SHAPES_PER_ROW = 5;
const PADDING = 70;
const SNAPSHOT_INTERVAL = 10;
const FREQUENCY = 240;
const MAX_SNAPSHOTS = 10;
const PHASE_RATIO = 2;

// locals
let brLfo, xLfo, yLfo, bezierLfo, colorLfo, diamondLfo;
let stage = 'square';
let stageFuncs = {};
const snapshots = [];
const shapes = [];

class Shape {
  constructor(x, y, phase, size) {
    this.x = x;
    this.y = y;
    this.stage = 'square';
    this.size = size || SIZE;
    this.phase = phase;
    this.createShapeLfos(phase);
  }

  createShapeLfos(phase = 0) {
    this.brLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75 + phase), 0, this.size / 2);
    this.bezierLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
    this.diamondLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
  }

  draw() {
    push();
    translate(this.x, this.y);
    if (this.stage === 'square') {
      drawSquare(this.brLfo.value, this.size);

      if (this.brLfo.value >= this.size / 2) {
        this.stage = 'circle';
        this.createShapeLfos();
      }
    } else if (this.stage === 'circle') {
      drawCircle(this.bezierLfo.value, this.size);

      if (this.bezierLfo.value >= 1) {
        this.stage = 'diamond';
        this.createShapeLfos();
      }
    } else if (this.stage === 'diamond') {
      drawDiamond(this.diamondLfo.value, this.size);

      if (this.diamondLfo.value >= 1) {
        this.stage = 'square';
        this.createShapeLfos();
      }
    }
    pop();
  }
}

function drawBezierOvalQuarter(sizeX, sizeY, value) {
  beginShape();
  vertex(-sizeX, 0);
  const cp1y = map(value, 0, 1, -0.552 * sizeY, 0);
  const cp2x = map(value, 0, 1, -0.552 * sizeX, 0);
  bezierVertex(-sizeX, cp1y, cp2x, -sizeY, 0, -sizeY);
  endShape();
}

function drawBezierOval(sizeX, sizeY, value) {
  drawBezierOvalQuarter(-sizeX, sizeY, value);
  drawBezierOvalQuarter(sizeX, sizeY, value);
  drawBezierOvalQuarter(sizeX, -sizeY, value);
  drawBezierOvalQuarter(-sizeX, -sizeY, value);
}

function drawCircle(value, size) {
  drawBezierOval(size / 2, size / 2, value);
}

function drawSquare(value, size) {
  square(0, 0, size, value);
}

function drawDiamond(value, size) {
  rotate(map(value, 0, 1, PI / 4, PI));
  square(0, 0, map(value, 0, 1, sqrt((size * size) / 2), size));
}

function setup() {
  createCanvas(600, 600);
  stroke(255);
  strokeWeight(2);
  rectMode(CENTER);
  noFill();

  const points = generateGrid(NUM_SHAPES_PER_ROW, NUM_SHAPES_PER_ROW, width - PADDING * 2, height - PADDING * 2);

  let index = 0;

  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    shapes.push(new Shape(point.x + PADDING - SIZE / 8, point.y + PADDING, index * PHASE_RATIO));
    shapes.push(new Shape(point.x + PADDING, point.y + PADDING, index * PHASE_RATIO));
    shapes.push(new Shape(point.x + PADDING + SIZE / 8, point.y + PADDING, index * PHASE_RATIO));
    index++;
  }
  background(0);
}

function draw() {
  background(0, 0, 0);

  for (const shape of shapes) {
    shape.draw();
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
