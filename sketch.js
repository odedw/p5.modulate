let lfo1, lfo2, lfo3;
function setup() {
  createCanvas(400, 400);
  background(220);

  lfo1 = modulate.createLfo(modulate.SINE, modulate.Timing.Time, 5000);
  lfo2 = modulate.createLfo(
    modulate.SINE,
    modulate.Timing.Time,
    5000,
    -1,
    1,
    5000 / 4
  );
  lfo3 = modulate.createLfo(
    modulate.SINE,
    modulate.Timing.Time,
    1000,
    -250,
    50
  );
}

function draw() {
  background(220);
  const x = map(lfo1.value, -1, 1, 100, 300);
  const y = map(lfo2.value, -1, 1, 300, 100);
  ellipse(x, y, 10, 10);
}
