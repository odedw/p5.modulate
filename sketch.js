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
  }

  draw() {
    push();
    translate(this.x, this.y);
    push();
    rotate(this.a);
    fill(this.c);
    noStroke();
    if (this.kind === 0) {
      ellipse(0, 0, this.w, this.h);
    } else if (this.kind === 1) {
      triangle(-this.w / 2, -this.h / 2, this.w / 2, -this.h / 2, -this.w / 2, this.h / 2);
    } else if (this.kind === 2) {
      push();
      translate(-this.w / 2, -this.h / 2);
      arc(0, 0, this.w * 2, this.h * 2, 0, PI / 2);
      pop();
    } else if (this.kind === 3) {
      push();
      translate(0, -this.h / 2);
      arc(0, 0, this.w, this.h, 0, PI);
      translate(0, this.h);
      arc(0, 0, this.w, this.h, PI, 0);
      pop();
    }
    pop();
    stroke(PALETTE[0]);
    strokeWeight(0.5);
    noFill();
    rect(0, 0, this.w, this.h);
    // if (
    //   mouseX > this.x - this.w / 2 &&
    //   mouseX < this.x + this.w / 2 &&
    //   mouseY > this.y - this.h / 2 &&
    //   mouseY < this.y + this.h / 2
    // ) {
    //   fill('white');
    //   stroke('black');
    //   text(`${this.a}`, 0, 0);
    // }
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
}

function draw() {
  background(PALETTE[0]);
  for (const tile of tiles) {
    tile.draw();
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
  format: 'mp4',
  quality: 1,
  framerate: 60,
});
