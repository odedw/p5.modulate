// constants
const PADDING = 100;
const CIRCLE_SIZE = 10;
const FREQUENCY = 1000;
const X_FREQUENCY = FREQUENCY * 6;
const TRAILING_SIZE = 100;
// locals
const points = [];
const lfos = [];
let amplitude;
let xAxis;

function setup() {
  createCanvas(800, 800);
  amplitude = (height - 2 * PADDING) / 9;
  stroke('lightgreen');
  strokeWeight(3);
  xAxis = createLfo(Waveform.Triangle, Timing.Milliseconds, X_FREQUENCY, PADDING, width - PADDING, X_FREQUENCY * 0.75);

  // lfos
  lfos.push(createLfo(Waveform.Sine, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Triangle, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Square, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Sawtooth, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Noise, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  points.push([], [], [], [], []);
}

function draw() {
  background(0, 0, 0, 20);

  let y = PADDING;
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
    y += 2 * amplitude;
  }
}
