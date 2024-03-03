/// <reference types="p5/global" />

// constants
const ANGLE = Math.PI / 4;
const DELTA = 1;
const SQUARE_DELTA = 20;
const SIZE = 160;

// locals
const Style = {
  Black: 1,
  Gray: 2,
  White: 3,
  Dotted: 4,
};

const Type = {
  BottomLeft: 0,
  TopRight: 1,
  Full: 2,
};
let diamonds = [];
class Diamond {
  constructor(cx, cy, size) {
    this.cx = cx;
    this.cy = cy;
    this.size = size;
    this.squares = [];
    const numSquares = round(random(6, 8));
    let lastStyles = [];
    for (let i = 0; i < numSquares; i++) {
      let style1, style2;
      for (let j = 0; j < 40; j++) {
        style1 = round(random(1, 4));
        if (!lastStyles.includes(style1) && (i > 2 || style1 !== Style.White)) {
          break;
        }
      }

      if (Math.random() > 0.5 && i != numSquares - 1) {
        style2 = round(random(1, 4));
        for (let j = 0; j < 40; j++) {
          style1 = round(random(1, 4));
          if (!lastStyles.includes(style2) && style1 !== style2) {
            break;
          }
        }
      }
      // console.log('numSquares', numSquares, style1, style2);
      let startX = -size / 2 + random(-DELTA, DELTA);
      let endX = size / 2 + random(-DELTA, DELTA);
      let startY = -size / 2 + random(-DELTA, DELTA);
      let endY = size / 2 + random(-DELTA, DELTA);

      this.squares.push({ style1, style2, size, startX, endX, startY, endY });
      lastStyles = [style1, style2];
      size -= SQUARE_DELTA;
    }
    this.a = ANGLE + random(-PI / 90, PI / 90);
    this.lfo = createLfo(LfoWaveform.Sine, Timing.frames(240, { phase: diamonds.length }), -5, 5);
  }

  draw() {
    push();
    translate(this.cx, this.cy);
    this.squares.forEach((s) => {
      push();
      translate(0, this.lfo.value);
      rotate(this.a);

      drawSquare(0, 0, s.size, s.style1, s.style2, s.startX, s.endX, s.startY, s.endY);
      pop();
    });
    pop();
  }
}

function drawSquare(cx, cy, size, style1, style2, startX, endX, startY, endY) {
  // console.log('drawSquare', cx, cy, size, style1, style2);

  let noiseScale = 0.1;
  let z = 0;
  for (let x = startX; x < endX; x += 1) {
    for (let y = startY; y < endY; y += 1) {
      const style = !style2 ? style1 : y < x ? style1 : style2;

      if (style === Style.Black) {
        let nx = noiseScale * x;
        let ny = noiseScale * y;
        // Compute noise value.
        let c = max(map(noise(nx, ny, z), 0, 1, 0, 255) - 130, 0);
        // Render.
        noStroke();
        fill(c);
        rect(x, y, 1);
      } else if (style === Style.White) {
        let nx = noiseScale * x;
        let ny = noiseScale * y;
        // Compute noise value.
        let c = map(noise(nx, ny, z), 0, 1, 200, 255);
        // Render.
        noStroke();
        fill(c);
        rect(x, y, 1);
      } else if (style === Style.Gray) {
        let nx = noiseScale * x;
        let ny = noiseScale * y;
        // Compute noise value.
        let c = map(noise(nx, ny, z), 0, 1, 100, 150);
        // Render.
        noStroke();
        fill(c);
        rect(x, y, 1);
      } else if (style === Style.Dotted) {
        const bright = (x + y) % 10 == 0;
        const c = bright ? 220 : 50;
        noStroke();
        fill(c);
        ellipse(x, y, 1);
      }

      z++;
    }
  }
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  // rectMode(CENTER);
  // pixelDensity(1);
  //   background(0);
  background(0);
  do {
    const x = random(0, width);
    const y = random(0, height);
    let start = millis();
    if (diamonds.every((d) => dist(x, y, d.cx, d.cy) > SIZE * 0.6)) {
      diamonds.push(new Diamond(x, y, SIZE));
    }
    let end = millis();
    console.log('time_add', end - start);
  } while (diamonds.length < 40);
  console.log('ready');
  noLoop();
}

function draw() {
  start = millis();

  for (const d of diamonds) {
    d.draw();
  }
  end = millis();
  console.log('time_draw', end - start);

  console.log(frameCount);
  if (frameCount === 240) {
    const capture = P5Capture.getInstance();
    capture.stop();
    console.log('done');
    noLoop();
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
  // disableUi: true,
  format: 'png',
  quality: 1,
  framerate: 60,
});
