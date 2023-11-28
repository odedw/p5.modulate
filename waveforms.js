// constants
const PADDING = 500;
const CIRCLE_SIZE = 10;
const AMPLITUDE = 100;
const FREQUENCY = 1000;
const TRAILING_SIZE = 300;
// locals
const points = [];
const lfos = [];
let xAxis;

function setup() {
  createCanvas(600, 600);
  stroke(255);
  // background(0);

  xAxis = createLfo(Waveform.Sine, Timing.Milliseconds, FREQUENCY * 4, PADDING, width - PADDING);

  // lfos
  lfos.push(createLfo(Waveform.Sine, Timing.Milliseconds, FREQUENCY, 0, AMPLITUDE));
  points.push([]);
}

function draw() {
  background(0);

  let y = AMPLITUDE;
  for (let i = 0; i < lfos.length; i++) {
    const lfo = lfos[i];
    const arr = points[i];
    arr.push({ x: xAxis.value, y: lfo.value });
    ellipse(xAxis.value, y + lfo.value, CIRCLE_SIZE, CIRCLE_SIZE);
    points[i] = arr.slice(-TRAILING_SIZE);
    for (let j = 1; j < arr.length; j++) {
      const p = arr[j];
      const p2 = arr[j - 1];
      line(p2.x, p2.y + y, p.x, p.y + y);
    }
  }
}
