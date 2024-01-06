const R = 120;
const NUM_LINES = 28;
const LINE_WIDTH = 2;
const GAP_WIDTH = (R * 2 - NUM_LINES * LINE_WIDTH) / (NUM_LINES - 1);
const TEXT = 'L O A D I N G';
class Wave {
  constructor(x, y, phase) {
    this.x = x;
    this.y = y;
    this.cycle = 50;
    this.phase = phase;
  }

  draw() {
    let y = this.y + (sin(frameCount / this.cycle - this.phase) * R) / 4;
    fill('#BE8F7A');
    noStroke();
    circle(this.x, y, R * 2);
    noFill();
    stroke(220);
    strokeWeight(LINE_WIDTH);
    for (let i = 0; i < NUM_LINES / 2; i++) {
      circle(this.x, y, R * 2 - LINE_WIDTH - i * 2 * (LINE_WIDTH + GAP_WIDTH));
    }

    fill('#BE8F7A');
    noStroke();
    rect(this.x - R, y, R * 2, height - y + R);

    let lineX = 0;
    fill(220);
    while (lineX < R * 2) {
      rect(lineX + this.x - R, y, LINE_WIDTH, height - y);
      lineX += LINE_WIDTH + GAP_WIDTH;
    }
  }
}

const waves = [];
let tw;
function setup() {
  createCanvas(700, 700);
  let stagger = false;
  for (let y = -R * 2; y < height + R * 2; y += R * 1.5) {
    let phase = 0;
    for (let x = -R + (stagger ? R : 0); x < width + R; x += R * 2 - LINE_WIDTH) {
      waves.push(new Wave(x, y, phase++));
    }
    stagger = !stagger;
  }

  textSize(52);
  tw = textWidth(TEXT);
  noLoop();
}

function draw() {
  background(0);
  for (let w of waves) {
    w.draw();
  }
  fill(0);
  noStroke();
  let done = '';
  TEXT.split('').forEach((c, i) => {
    const doneWidth = textWidth(done);
    const val = sin((frameCount - i * 10) / 52);
    text(c, width / 2 - tw / 2 + doneWidth, height / 2 + (val * R) / 2);
    done += c;
  });
}

function mouseClicked() {
  loop();
}

P5Capture.setDefaultOptions({
  disableUi: true,
});
