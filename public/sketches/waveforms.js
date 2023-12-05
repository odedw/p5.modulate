// constants
const PADDING = 100;
const FREQUENCY = 1000;
const X_FREQUENCY = FREQUENCY * 6;
const TRAILING_SIZE = 100;
const BACKGROUND = '#FDF4DB';
const STROKE = '#000000';

// locals
const points = [[], [], [], [], []];
const lfos = [];
let amplitude;
let xAxis;

function setup() {
  createCanvas(800, 800);
  amplitude = (height - 2 * PADDING) / 9;
  strokeWeight(6);
  smooth();
  stroke(STROKE);
  xAxis = createLfo(Waveform.Triangle, Timing.Milliseconds, X_FREQUENCY, PADDING, width - PADDING, X_FREQUENCY * 0.75);

  // lfos
  lfos.push(createLfo(Waveform.Sine, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Triangle, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Square, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Sawtooth, Timing.Milliseconds, FREQUENCY, 0, amplitude));
  lfos.push(createLfo(Waveform.Noise, Timing.Milliseconds, FREQUENCY, 0, amplitude));
}

function draw() {
  background(red(BACKGROUND), green(BACKGROUND), blue(BACKGROUND), 80);

  let y = PADDING;
  for (let i = 0; i < lfos.length; i++) {
    const lfo = lfos[i];
    const arr = points[i];
    arr.push({ x: xAxis.value, y: lfo.value });
    points[i] = arr.slice(-TRAILING_SIZE);
    for (let j = 1; j < arr.length; j++) {
      const p = arr[j];
      const p2 = arr[j - 1];
      line(p2.x, p2.y + y, p.x, p.y + y);
    }
    y += 2 * amplitude;
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
