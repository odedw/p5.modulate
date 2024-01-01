/// <reference types="p5/global" />

// constants
// const RADIUS = 100;
const SIZE = 200;
const SNAPSHOT_INTERVAL = 2;
const FREQUENCY = 600;
const MAX_SNAPSHOTS = 10;

// locals
let brLfo, xLfo, yLfo, bezierLfo, colorLfo, diamondLfo;
let stage = 'diamond';
let stageFuncs = {};
const snapshots = [];

function createShapeLfos() {
  brLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, SIZE / 2);
  bezierLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
  diamondLfo = createLfo(LfoWaveform.Triangle, Timing.frames(FREQUENCY, FREQUENCY * 0.75), 0, 1);
}

function drawBezierOvalQuarter(sizeX, sizeY) {
  beginShape();
  vertex(-sizeX, 0);
  const cp1y = map(bezierLfo.value, 0, 1, -0.552 * sizeY, 0);
  const cp2x = map(bezierLfo.value, 0, 1, -0.552 * sizeX, 0);
  bezierVertex(-sizeX, cp1y, cp2x, -sizeY, 0, -sizeY);
  endShape();
  // ellipse(-sizeX, cp1y, 10);
  // ellipse(cp2x, -sizeY, 10);
}

function drawBezierOval(sizeX, sizeY) {
  drawBezierOvalQuarter(-sizeX, sizeY);
  drawBezierOvalQuarter(sizeX, sizeY);
  drawBezierOvalQuarter(sizeX, -sizeY);
  drawBezierOvalQuarter(-sizeX, -sizeY);
}

function drawCircle() {
  drawBezierOval(SIZE / 2, SIZE / 2);

  if (bezierLfo.value >= 1) {
    stage = 'diamond';
    createShapeLfos();
  }
}

function drawSquare() {
  square(0, 0, SIZE, brLfo.value);
  if (brLfo.value >= SIZE / 2) {
    stage = 'circle';
    createShapeLfos();
  }
}

function drawDiamond() {
  rotate(map(diamondLfo.value, 0, 1, PI / 4, PI));
  square(0, 0, map(diamondLfo.value, 0, 1, sqrt((SIZE * SIZE) / 2), SIZE));

  if (diamondLfo.value >= 1) {
    stage = 'square';
    createShapeLfos();
  }
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
  xLfo = createLfo(LfoWaveform.Sine, Timing.frames(FREQUENCY, FREQUENCY * 0.75), width * 0.25, width * 0.75);
  yLfo = createLfo(LfoWaveform.Sine, Timing.frames(FREQUENCY / 2, FREQUENCY * 0.75), width * 0.25, width * 0.75);

  stageFuncs = {
    square: drawSquare,
    circle: drawCircle,
    diamond: drawDiamond,
  };
}

function draw() {
  background(0);

  // const c = colorLfo.color();
  // stroke(c.r, c.g, c.b);
  push();
  // translate(xLfo.value, yLfo.value);
  translate(width / 2, height / 2);

  stageFuncs[stage]();
  pop();

  for (const s of snapshots) {
    push();
    translate(s.x, s.y);
    square(0, 0, s.size, s.br);
    pop();
  }

  // if (frameCount % SNAPSHOT_INTERVAL === 0) {
  //   snapshots.push({
  //     x: xLfo.value,
  //     y: yLfo.value,
  //     size: SIZE,
  //     br: lfo1.value,
  //   });
  //   if (snapshots.length > MAX_SNAPSHOTS) {
  //     snapshots.shift();
  //   }
  // }
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
