/// <reference types="p5/global" />

// constants

// locals
let midiInitialized = false;
let sequencers = [];
let output;

function noteName(note) {
  return `${note.name().toUpperCase()}${note.accidental()}${note.octave()}`;
}

function setup() {
  createCanvas(500, 500);
  stroke(255);
  rectMode(CENTER);
  const midi = new Midi();
  midi.init().then(() => {
    // midi.list();
    output = midi.getOutput('browser-out');
    midiInitialized = true;
  });
  const root = teoria.note('a2');
  const scale = root.scale('lydian').notes();
  sequencers.push(new Sequencer(8, scale[0], 'voice1', 1));
  sequencers.push(new Sequencer(8, scale[4], 'voice2', 2));
  sequencers.push(new Sequencer(8, scale[6], 'voice3', 3));
  setInterval(() => {
    if (midiInitialized) {
      sequencers.forEach((sequencer, i) => {
        const note = sequencer.tick();
        if (output) {
          output.channels[sequencer.channel].playNote(noteName(note), {
            duration: 900,
          });
        }
      });
    }
  }, 1000);

  // pixelDensity(1);
  //   background(0);
}

function draw() {
  background(0);
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

function keyPressed() {
  if (key === ' ') {
    for (const s of sequencers) {
      s.reset();
    }
  }
}

// P5Capture.setDefaultOptions({
//   disableUi: true,
//   format: 'mp4',
//   quality: 1,
//   framerate: 60,
// });
