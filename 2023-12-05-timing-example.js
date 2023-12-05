// constants
const RADIUS = 10;

// locals
const points = [];
let lfo1, lfo2, lfo3;

function setup() {
  createCanvas(600, 600);
  stroke(255);
  //   background(0);
  lfo1 = createLfo(LfoWaveform.Sine, LfoTiming.Milliseconds(1000), width * 0.25, width * 0.75);
}

function draw() {
  background(0);
  ellipse(lfo1.value, height * 0.5, RADIUS * 2, RADIUS * 2);
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
