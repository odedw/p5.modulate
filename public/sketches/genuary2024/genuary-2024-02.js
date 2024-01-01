// constants
const NUM_STEPS = 1000;

// locals
let colorLfo;
let matrix;
let cells = [];
let setColors = [];
let sizeLfo;
function colorCell(x, y, a, s) {
  // generate colors and color the new cell
  palette = setColors[s];
  while (palette.length <= a) {
    palette.push(colorLfo.color());
  }
  fill(palette[a].r, palette[a].g, palette[a].b);
  ellipse(x, y, sizeLfo.value);
}

function generatePoints() {
  let points = [];
  let cols, rows;
  const r = 8; //int(random(5, 13));
  cols = r;
  rows = r;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * (width / cols);
      let y = row * (height / rows);
      if (x > 0 && x < width && y > 0 && y < height) points.push({ x: int(x), y: int(y) });
    }
  }
  return points;
}
function reset() {
  background(0);
  setColors = [];
  cells = [];
  sizeLfo = createLfo(LfoWaveform.Sine, Timing.frames(120), 10, 50);
  // create sets
  colorLfo = createColorLfo();

  let points = generatePoints();
  matrix = new Matrix(width, height);
  points.forEach(({ x, y }, i) => {
    matrix.set(x, y, 1);
    cells.push({ x, y, a: 0, s: i });
    setColors.push([colorLfo.color()]);
    colorCell(x, y, 0, i);
  });
}
function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  noStroke();
  reset();
}

function step() {
  const index = int(random(cells.length));
  const randomCell = cells[index];
  const neighbors = matrix.getNeighbors(randomCell.x, randomCell.y).sort(() => random(-1, 1));
  const emptyNeighbor = neighbors.find((neighbor) => neighbor.value === 0);
  if (!emptyNeighbor) {
    // remove cell from list
    cells.splice(index, 1);
    return;
  }
  matrix.set(emptyNeighbor.x, emptyNeighbor.y, 1);
  const newCell = {
    x: emptyNeighbor.x,
    y: emptyNeighbor.y,
    a: randomCell.a + 1,
    s: randomCell.s,
  };
  cells.push(newCell);

  colorCell(newCell.x, newCell.y, newCell.a, newCell.s);
}
function draw() {
  for (let i = 0; i < NUM_STEPS; i++) {
    step();
    if (cells.length === 0) {
      noLoop();
    }
  }
}
