/// <reference types="p5/global" />

// constants
const TILE_WIDTH = 40;
const TILE_HEIGHT = 40;
const WIDTH_RATIO = 635 / 1400;
const HEIGHT_RATIO = 625 / 1400;
const START_X_RATIO = 395 / 1400;
const START_Y_RATIO = 283 / 1400;

// locals
let img;
let tiles;
let startX = 0;
let startY = 0;
let frame;
let iterations = 0;

class Tile {
  constructor(x, y, w, h, img, destX, destY, timing) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.img = img;
    this.destX = destX;
    this.destY = destY;
    this.timing = timing;
  }

  draw() {
    const currentX = lerp(this.x, this.destX, this.timing.elapsed);
    const currentY = lerp(this.y, this.destY, this.timing.elapsed);
    const currentWidth = lerp(this.width, this.width * WIDTH_RATIO, this.timing.elapsed);
    const currentHeight = lerp(this.height, this.height * HEIGHT_RATIO, this.timing.elapsed);
    frame.image(this.img, currentX, currentY, currentWidth, currentHeight);

    return this.timing.finished;
  }
}
function preload() {
  img = loadImage('public/assets/genuary-03-canvas.png');
}

function createTiles() {
  tiles = [];

  let row = 0;
  let nextTileWidth = currentTileWidth * WIDTH_RATIO;
  let nextTileHeight = currentTileHeight * HEIGHT_RATIO;
  for (let y = 0; y < frame.height; y += currentTileHeight) {
    let col = 0;
    for (let x = 0; x < frame.width; x += currentTileWidth) {
      const tileImg = scaledImage.get(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
      const destX = START_X_RATIO * frame.width + col * nextTileWidth;
      const destY = START_Y_RATIO * frame.height + row * nextTileHeight;
      tiles.push(
        new Tile(
          x,
          y,
          currentTileWidth,
          currentTileHeight,
          tileImg,
          destX,
          destY,
          Timing.frames(int(random(60, 180)), 0, false)
        )
      );
      col++;
    }
    row++;
  }

  return tiles;
}
let currentTileWidth, currentTileHeight, currentImage, targetImage, scaledImage;
function setup() {
  createCanvas(700, 700);
  stroke(255);
  scaledImage = createGraphics(width, height);
  scaledImage.image(img, 0, 0, width, height);
  frame = createGraphics(width, height);
  frame.image(img, 0, 0, width, height);
  currenCanvastHeight = height;
  currentCanvasWidth = width;
  currentTileWidth = TILE_WIDTH;
  currentTileHeight = TILE_HEIGHT;
  currentImage = img;
  targetImage = img;
  createTiles(img);
}

function draw() {
  frame.image(img, 0, 0, frame.width, frame.height);
  let done = true;
  for (const tile of tiles) {
    let res = tile.draw();
    done = done && res;
  }

  image(frame, startX, startY, frame.width, frame.height);

  if (done) {
    if (++iterations === 6) {
      noLoop();
    }
    // currentImage = frame.get();
    startX += START_X_RATIO * frame.width;
    startY += START_Y_RATIO * frame.height;
    frame = createGraphics(frame.width * WIDTH_RATIO, frame.height * HEIGHT_RATIO);

    currentTileWidth *= WIDTH_RATIO;
    currentTileHeight *= HEIGHT_RATIO;
    createTiles();
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
