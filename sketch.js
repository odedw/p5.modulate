const FREQUENCY = 4000;
const NUM_POINTS = 200;
const DELTA = 100;
const RADIUS = 500;
const RATIO = 0.9;
const NUMBER_OF_SHAPES = 150;

const points = [];
let lfo1, lfo2, lfo3;
function polarToCartesian(r, a) {
  return {
    x: cos(a) * r,
    y: sin(a) * r,
  };
}

function setup() {
  createCanvas(400, 400);
  background(0);
  let mulitplier = 1;
  for (let j = 0; j < NUMBER_OF_SHAPES; j++) {
    const arr = [];
    for (let index = 0; index < NUM_POINTS; index++) {
      arr.push({
        r: RADIUS * mulitplier,
        a: map(index, 0, NUM_POINTS, 0, TWO_PI),
        lfo: modulate.createLfo(
          modulate.SINE,
          modulate.Timing.Time,
          FREQUENCY,
          -DELTA * mulitplier,
          DELTA * mulitplier,
          map(index, 0, NUM_POINTS, 0, FREQUENCY)
        ),
      });
    }
    mulitplier *= RATIO;
    points.push(arr);
  }

  lfo1 = modulate.createLfo(
    modulate.SINE,
    modulate.Timing.Time,
    FREQUENCY * 2,
    -20,
    20
  );

  lfo2 = modulate.createLfo(
    modulate.SINE,
    modulate.Timing.Time,
    FREQUENCY * 2,
    -20,
    20,
    FREQUENCY / 2
  );
}

function draw() {
  background(0);
  // let coord;
  let c = 255;
  for (const arr of points) {
    fill(c);
    beginShape();
    for (p of arr) {
      const { x, y } = polarToCartesian(p.r + p.lfo.value, p.a);
      vertex(x + width / 2 + lfo1.value, y + height / 2 + lfo2.value);
      // ellipse(x + width / 2, y + height / 2, 10, 10);
    }
    endShape(CLOSE);

    c = c === 255 ? 0 : 255;
  }
  // fill(255);
  // beginShape();
  // for (p of points1) {
  //   const { x, y } = polarToCartesian(p.r + p.lfo.value, p.a);
  //   vertex(x + width / 2, y + height / 2);
  //   // ellipse(x + width / 2, y + height / 2, 10, 10);
  // }
  // endShape(CLOSE);

  // fill(0);
  // beginShape();
  // for (p of points2) {
  //   const { x, y } = polarToCartesian(p.r + p.lfo.value, p.a);
  //   vertex(x + width / 2, y + height / 2);
  //   // ellipse(x + width / 2, y + height / 2, 10, 10);
  // }
  // endShape(CLOSE);
}
