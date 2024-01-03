/// <reference types="p5/global" />

// constants
// const RADIUS = 100;
const SIZE = 100;
const SNAPSHOT_INTERVAL = 10;
const FREQUENCY = 120;
const MAX_SNAPSHOTS = 10;

// locals
let brLfo, xLfo, yLfo, bezierLfo, colorLfo, diamondLfo;
let stage = 'square';
let stageFuncs = {};
const snapshots = [];

function createShapeLfos() {
  brLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, SIZE / 2);
  bezierLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
  diamondLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
}

function drawBezierOvalQuarter(sizeX, sizeY, value) {
  beginShape();
  vertex(-sizeX, 0);
  const cp1y = map(value, 0, 1, -0.552 * sizeY, 0);
  const cp2x = map(value, 0, 1, -0.552 * sizeX, 0);
  bezierVertex(-sizeX, cp1y, cp2x, -sizeY, 0, -sizeY);
  endShape();
  // ellipse(-sizeX, cp1y, 10);
  // ellipse(cp2x, -sizeY, 10);
}

function drawBezierOval(sizeX, sizeY, value) {
  drawBezierOvalQuarter(-sizeX, sizeY, value);
  drawBezierOvalQuarter(sizeX, sizeY, value);
  drawBezierOvalQuarter(sizeX, -sizeY, value);
  drawBezierOvalQuarter(-sizeX, -sizeY, value);
}

function drawCircle(value) {
  drawBezierOval(SIZE / 2, SIZE / 2, value);
}

function stepCircle() {
  drawCircle(bezierLfo.value);

  if (bezierLfo.value >= 1) {
    stage = 'diamond';
    createShapeLfos();
  }

  return bezierLfo.value;
}

function drawSquare(value) {
  square(0, 0, SIZE, value);
}
function stepSquare() {
  drawSquare(brLfo.value);

  if (brLfo.value >= SIZE / 2) {
    stage = 'circle';
    createShapeLfos();
  }

  return brLfo.value;
}

function drawDiamond(value) {
  rotate(map(value, 0, 1, PI / 4, PI));
  square(0, 0, map(value, 0, 1, sqrt((SIZE * SIZE) / 2), SIZE));
}

function stepDiamond() {
  drawDiamond(diamondLfo.value);

  if (diamondLfo.value >= 1) {
    stage = 'square';
    createShapeLfos();
  }

  return diamondLfo.value;
}

// 2*x*x = SIZE*SIZE
// x = sqrt(SIZE*SIZE/2)

function setup() {
  createCanvas(600, 600);
  stroke(255);
  strokeWeight(2);
  rectMode(CENTER);
  noFill();

  createShapeLfos();
  colorLfo = createColorLfo();
  xLfo = createLfo(LfoWaveform.Sine, Timing.frames(FREQUENCY * 2, FREQUENCY * 0.75), width * 0.25, width * 0.75);
  yLfo = createLfo(LfoWaveform.Sine, Timing.frames(FREQUENCY * 4, FREQUENCY * 0.75), width * 0.25, width * 0.75);

  stageFuncs = {
    square: stepSquare,
    circle: stepCircle,
    diamond: stepDiamond,
  };
  background(0);
}

function draw() {
  background(0);
  // const c = colorLfo.color();
  // stroke(c.r, c.g, c.b);
  push();
  translate(xLfo.value, yLfo.value);
  // translate(width / 2, height / 2);

  const value = stageFuncs[stage]();
  pop();

  for (const s of snapshots) {
    push();
    translate(s.x, s.y);
    if (s.stage === 'square') {
      drawSquare(s.value);
    } else if (s.stage === 'circle') {
      drawCircle(s.value);
    } else if (s.stage === 'diamond') {
      drawDiamond(s.value);
    }
    pop();
  }

  if (frameCount % SNAPSHOT_INTERVAL === 0) {
    snapshots.push({
      x: xLfo.value,
      y: yLfo.value,
      size: SIZE,
      stage,
      value,
    });
    if (snapshots.length > MAX_SNAPSHOTS) {
      // snapshots.shift();
    }
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
