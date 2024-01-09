/// <reference types="p5/global" />

// constants
const palette = ['#e5d346', '#272624', '#4d6c79', '#aa3827'];
const DOWN = 0;
const LEFT = 1;
const UP = 2;
const RIGHT = 3;

// locals
let t;
let segments = [];
class Segment {
  constructor(x, y, d, c, w, h) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  draw() {
    fill(this.c);
    let x, y;
    if (this.d === LEFT) {
      x = lerp(width, 0, t.elapsed);
      y = this.y;
    } else if (this.d === RIGHT) {
      x = lerp(-width, 0, t.elapsed);
      y = this.y;
    } else if (this.d === UP) {
      x = this.x;
      y = lerp(height, 0, t.elapsed);
    } else if (this.d === DOWN) {
      x = this.x;
      y = lerp(-height, 0, t.elapsed);
    }

    rect(x, y, this.w, this.h);
  }
}
function setup() {
  createCanvas(360 * 1.5, 600 * 1.5);
  noStroke();
  // rectMode(CENTER);
  t = Timing.frames(60, 0, false);

  let horizontalSegmentHeight = height / 54;
  let verticalSegmentWidth = width / 12;

  // back
  segments.push(new Segment(0, 1 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 3 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 5 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 6 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 7 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 8 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 9 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 10 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 11 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 25 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 27 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 29 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 31 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 33 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 35 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 37 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 39 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 41 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 48 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 50 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 52 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));

  // middle
  segments.push(new Segment(0 * verticalSegmentWidth, 0, UP, palette[0], verticalSegmentWidth, height));
  segments.push(new Segment(2 * verticalSegmentWidth, 0, UP, palette[1], verticalSegmentWidth, height));
  segments.push(new Segment(4 * verticalSegmentWidth, 0, UP, palette[2], verticalSegmentWidth, height));
  segments.push(new Segment(6 * verticalSegmentWidth, 0, UP, palette[3], verticalSegmentWidth, height));
  segments.push(new Segment(8 * verticalSegmentWidth, 0, UP, palette[3], verticalSegmentWidth, height));
  segments.push(new Segment(10 * verticalSegmentWidth, 0, UP, palette[0], verticalSegmentWidth, height));

  // front
  segments.push(new Segment(0, 12 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 14 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 16 * horizontalSegmentHeight, LEFT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 18 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 20 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 22 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 24 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 26 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 28 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 30 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 32 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 34 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 42 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 44 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 46 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
}

function draw() {
  background(255);
  for (const segment of segments) {
    segment.draw();
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
