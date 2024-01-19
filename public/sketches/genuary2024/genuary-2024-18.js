/// <reference types="p5/global" />

// constants
const COLS = 5;

// locals
let tiles = [];
class Tile {
  constructor(x, y, w, h, c, kind, a) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.kind = kind;
    this.a = a;
    this.da = 0;
    this.dy = 0;
    this.dx = 0;
  }

  inMotion() {
    return !!this.t;
  }

  startRotation() {
    if (this.inMotion()) {
      return;
    }

    this.da = (PI / 2) * (Math.random() < 0.5 ? 1 : -1);
    this.t = Timing.frames(60, { loop: false, easing: Easing.EaseOutCubic });
  }

  startTransition() {
    if (this.inMotion()) {
      return;
    }

    // find neighbor tiles
    const tileSize = width / COLS;
    const neighbors = tiles.filter((t) => {
      return (
        (t.x === this.x && (t.y === this.y - tileSize || t.y === this.y + tileSize)) ||
        (t.y === this.y && (t.x === this.x - tileSize || t.x === this.x + tileSize))
      );
    });

    neighbors.sort((a, b) => {
      Math.random() < 0.5 ? -1 : 1;
    });

    for (const n of neighbors) {
      if (n.inMotion()) {
        continue;
      }

      const timer = Timing.frames(60, { loop: false, easing: Easing.EaseOutCubic });
      n.t = this.t = timer;
      n.dx = this.x - n.x;
      n.dy = this.y - n.y;
      this.dx = n.dx * -1;
      this.dy = n.dy * -1;

      break;
    }
  }

  update() {
    if (this.t?.finished) {
      this.t = null;
      this.a += this.da;
      this.da = 0;
      this.x += this.dx;
      this.dx = 0;
      this.y += this.dy;
      this.dy = 0;
    }
  }

  draw() {
    push();
    const x = this.x + (this.t && this.dx ? this.t.elapsed * this.dx : 0);
    const y = this.y + (this.t && this.dy ? this.t.elapsed * this.dy : 0);

    translate(x, y);
    push();
    const angle = this.a + (this.t && this.da ? this.t.elapsed * this.da : 0);
    rotate(angle);
    fill(this.c);
    noStroke();
    if (this.kind === 0) {
      ellipse(0, 0, this.w - 0.5, this.h - 0.5);
    } else if (this.kind === 1) {
      triangle(
        -this.w / 2 + 0.5,
        -this.h / 2 + 0.5,
        this.w / 2 - 0.5,
        -this.h / 2 + 0.5,
        -this.w / 2 + 0.5,
        this.h / 2 - 0.5
      );
    } else if (this.kind === 2) {
      push();
      translate(-this.w / 2 + 0.5, -this.h / 2 + 0.5);
      arc(0, 0, this.w * 2 - 1, this.h * 2 - 1, 0, PI / 2);
      pop();
    } else if (this.kind === 3) {
      push();
      translate(0, -this.h / 2 + 0.5);
      arc(0, 0, this.w - 1, this.h - 1, 0, PI);
      translate(0, this.h - 0.5);
      arc(0, 0, this.w - 1, this.h - 1, PI, 0);
      pop();
    }
    pop();
    pop();
  }
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  setPalette('Bauhaus1');
  textAlign(CENTER, CENTER);
  textSize(16);
  let tileSize = width / COLS;
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < COLS; j++) {
      let x = i * tileSize + tileSize / 2;
      let y = j * tileSize + tileSize / 2;
      let c = random(PALETTE.slice(1));
      let kind = int(random(4));
      let tile = new Tile(x, y, tileSize, tileSize, c, kind, (int(random(4)) * PI) / 2);
      tiles.push(tile);
    }
  }
  noLoop();
}

function draw() {
  background(PALETTE[0]);
  for (const tile of tiles) {
    tile.update();
    tile.draw();
  }

  if (frameCount % 30 === 0) {
    const tile = random(tiles);
    const r = Math.random();
    if (r < 0.45) {
      tile.startRotation();
    } else if (r < 0.9) {
      tile.startTransition();
    }
  }
}

P5Capture.setDefaultOptions({
  disableUi: true,
  // format: 'mp4',
  // quality: 1,
  // framerate: 60,
});
