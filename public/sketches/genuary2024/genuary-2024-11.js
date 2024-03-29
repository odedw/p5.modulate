/// <reference types="p5/global" />

// constants
const palette = ['#e5d346', '#272624', '#4d6c79', '#aa3827'];
const DOWN = 0;
const LEFT = 1;
const UP = 2;
const RIGHT = 3;
const EASING = 0.05;
// locals
let t1, t2, t3, t4, bg;
let segments = [];
class Segment {
  constructor(x, y, d, c, w, h) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.w = w;
    this.h = h;
    this.c = c;
    this.pg = createGraphics(w, h);
    this.pg.noFill();
    const r = red(c);
    const g = green(c);
    const b = blue(c);
    // this.pg.background(c);
    for (let x2 = 0; x2 < this.pg.width; x2++) {
      for (let y2 = 0; y2 < this.pg.height; y2++) {
        const delta = random(-20, 20);
        this.pg.stroke(r + delta, g + delta, b + delta);
        this.pg.ellipse(x2, y2, 1);
      }
    }
  }

  draw() {
    // fill(this.c);
    let x, y;
    if (this.d === LEFT) {
      x = lerp(width, 0, t1.elapsed) + lerp(0, -width, t3.elapsed);
      y = this.y;
    } else if (this.d === RIGHT) {
      x = lerp(-width, 0, t1.elapsed) + lerp(0, width, t3.elapsed);
      y = this.y;
    } else if (this.d === UP) {
      x = this.x;
      y = lerp(height, 0, t1.elapsed) + lerp(0, -height, t3.elapsed);
    } else if (this.d === DOWN) {
      x = this.x;
      y = lerp(-height, 0, t1.elapsed) + lerp(0, height, t3.elapsed);
    }

    image(this.pg, x, y, this.w, this.h);
  }
}

function setup() {
  createCanvas(360 * 1.5, 600 * 1.5);
  noStroke();
  // rectMode(CENTER);
  t1 = Timing.frames(120, { easing: Easing.EaseOutCubic, loop: false });
  t2 = Timing.frames(30, { autoTrigger: false, loop: false });
  t3 = Timing.frames(120, { easing: Easing.EaseInCubic, loop: false, autoTrigger: false });
  t4 = Timing.frames(30, { autoTrigger: false, loop: false });

  let horizontalSegmentHeight = height / 54;
  let verticalSegmentWidth = width / 12;

  // back
  segments.push(new Segment(0, 1 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 3 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 5 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 6 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 7 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 8 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 9 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 10 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 11 * horizontalSegmentHeight, LEFT, palette[2], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 25 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 27 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 29 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 31 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 33 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 35 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 37 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 39 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 41 * horizontalSegmentHeight, LEFT, palette[3], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 48 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 50 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 52 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));

  // middle
  segments.push(new Segment(0 * verticalSegmentWidth, 0, UP, palette[0], verticalSegmentWidth, height));
  segments.push(new Segment(2 * verticalSegmentWidth, 0, DOWN, palette[1], verticalSegmentWidth, height));
  segments.push(new Segment(4 * verticalSegmentWidth, 0, UP, palette[2], verticalSegmentWidth, height));
  segments.push(new Segment(6 * verticalSegmentWidth, 0, DOWN, palette[3], verticalSegmentWidth, height));
  segments.push(new Segment(8 * verticalSegmentWidth, 0, DOWN, palette[3], verticalSegmentWidth, height));
  segments.push(new Segment(10 * verticalSegmentWidth, 0, UP, palette[0], verticalSegmentWidth, height));

  // front
  segments.push(new Segment(0, 12 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 14 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
  segments.push(new Segment(0, 16 * horizontalSegmentHeight, RIGHT, palette[1], width, horizontalSegmentHeight));
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

  bg = createGraphics(width, height);
  for (let x = 0; x < bg.width; x++) {
    for (let y = 0; y < bg.height; y++) {
      bg.stroke(random(230, 255));
      bg.ellipse(x, y, 1);
    }
  }
}

function draw() {
  image(bg, 0, 0, width, height);
  for (const segment of segments) {
    segment.draw();
  }

  if (t1.finished && !t2.isActive && !t2.finished) {
    t2.activate();
  }

  if (t2.finished && !t3.isActive && !t3.finished) {
    t3.activate();
  }

  if (t3.finished && !t4.isActive && !t4.finished) {
    t4.activate();
  }

  if (t4.finished) {
    t1.reset();
    t2.reset();
    t3.reset();
    t4.reset();
  }
}

let isLooping = false;
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
  // format: 'mp4',
  // frameRate: 60,
});
