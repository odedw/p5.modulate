/// <reference types="p5/global" />

// constants
const SIZE = (75 * 7) / 6;
const NUM_SHAPES_PER_ROW = 5;
const PADDING = (70 * 7) / 6;
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
const palette = ['#c06046', '#8c2336', '#a9413e'];
class Shape {
  constructor(x, y, phase, size, color) {
    this.x = x;
    this.y = y;
    this.stage = 'square';
    this.size = size || SIZE;
    this.phase = phase;
    this.createShapeLfos(phase);
    this.color = color;
  }

  createShapeLfos(phase = 0) {
    this.brLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75 + phase), 0, this.size / 2);
    this.bezierLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
    this.diamondLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
  }

  draw() {
    fill(this.color);
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
  rotate(PI);
  drawDiamond(0, size + 1);
}

function drawSquare(value, size) {
  square(0, 0, size, value);
}

function drawDiamond(value, size) {
  rotate(map(value, 0, 1, PI / 4, PI));
  square(0, 0, map(value, 0, 1, sqrt((size * size) / 2), size));
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  noStroke();

  const points = generateGrid(NUM_SHAPES_PER_ROW, NUM_SHAPES_PER_ROW, width - PADDING * 2, height - PADDING * 2);

  let index = 0;

  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    shapes.push(new Shape(point.x + PADDING - SIZE / 6, point.y + PADDING, index * PHASE_RATIO, SIZE, palette[0]));
    shapes.push(new Shape(point.x + PADDING, point.y + PADDING, index * PHASE_RATIO, SIZE, palette[1]));
    shapes.push(new Shape(point.x + PADDING + SIZE / 6, point.y + PADDING, index * PHASE_RATIO, SIZE, palette[2]));
    index++;
  }
  // noLoop();
}

function draw() {
  if (frameCount === 1) {
    if (frameCount === 1) {
      const capture = P5Capture.getInstance();
      capture.start({
        format: 'png',
        framerate: 30,
        quality: 1,
      });
    }
  }
  background(238, 243, 248);

  for (const shape of shapes) {
    shape.draw();
  }

  if (frameCount === FREQUENCY * 1.5) {
    const capture = P5Capture.getInstance();
    capture.stop();
    console.log('done');
    // capture.download();
  }
}

function mouseClicked() {
  loop();
}

P5Capture.setDefaultOptions({
  disableUi: true,
});
