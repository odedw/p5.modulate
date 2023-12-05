// constants
const RADIUS = 10;

// locals
const points = [];
let lfo1, lfo2, lfo3, lfo4;

function setup() {
  createCanvas(600, 600);
  stroke(255);
  //   background(0);
  lfo1 = createLfo(LfoWaveform.Sine, LfoTiming.Milliseconds(1000), width * 0.25, width * 0.75);
  lfo2 = createLfo(LfoWaveform.Sine, LfoTiming.Seconds(1), width * 0.25, width * 0.75);
  lfo3 = createLfo(LfoWaveform.Sine, LfoTiming.Frames(60), width * 0.25, width * 0.75);
  lfo4 = createLfo(LfoWaveform.Sine, LfoTiming.Manual(60), width * 0.25, width * 0.75);
}

function draw() {
  background(0);
  ellipse(lfo1.value, height * 0.2, RADIUS * 2, RADIUS * 2);
  ellipse(lfo2.value, height * 0.4, RADIUS * 2, RADIUS * 2);
  ellipse(lfo3.value, height * 0.6, RADIUS * 2, RADIUS * 2);
  ellipse(lfo4.value, height * 0.8, RADIUS * 2, RADIUS * 2);
  lfo4.step();
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
