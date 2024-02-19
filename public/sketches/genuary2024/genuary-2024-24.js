/// <reference types="p5/global" />

// constants
const MIN_RADIUS = 20;
const DIFF_RADIUS = 20;
const NUM_CIRCLES = 4;
const SIZE = MIN_RADIUS * (NUM_CIRCLES + 1);

// locals
let particles = [],
  squares = [],
  lfo1,
  targetBuffer,
  pgSquares,
  pgCircles,
  mask,
  t1;

const Scenes = {
  SquaresVertical: 0,
  SquaresHorizontal: 1,
  Circles: 2,
};
initScenes([Scenes.SquaresVertical, Scenes.Circles, Scenes.SquaresHorizontal, Scenes.Circles]);

class Square {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.d = 1;
  }

  draw(frame) {
    frame.push();
    let x = this.x;
    let y = this.y;
    if (currentScene === Scenes.SquaresVertical) {
      y += t1.elapsed * SIZE * this.d;
    } else if (currentScene === Scenes.SquaresHorizontal) {
      x += t1.elapsed * SIZE * this.d;
    }
    frame.translate(x, y);
    frame.noStroke();
    frame.fill(this.c);
    frame.rect(0, 0, this.w, this.h);
    if (x > frame.width - SIZE) {
      frame.translate(-frame.width, 0);
      frame.rect(0, 0, this.w, this.h);
    } else if (x < 0) {
      frame.translate(frame.width, 0);
      frame.rect(0, 0, this.w, this.h);
    } else if (y > frame.height - SIZE) {
      frame.translate(0, -frame.height);
      frame.rect(0, 0, this.w, this.h);
    } else if (y < 0) {
      frame.translate(0, frame.height);
      frame.rect(0, 0, this.w, this.h);
    }

    frame.pop();
  }
}

class Particle {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.colors = colors;
  }

  draw(frame) {
    frame.push();
    frame.translate(this.x, this.y);
    frame.rotate(t1.elapsed * TWO_PI);
    frame.noFill();
    frame.stroke(255);
    frame.strokeWeight(currentScene === Scenes.Circles ? 3 : 2);
    for (let i = 0; i < NUM_CIRCLES; i++) {
      for (let j = 0; j < 4; j++) {
        frame.stroke(this.colors[j]);
        frame.arc(0, 0, MIN_RADIUS + i * DIFF_RADIUS, MIN_RADIUS + i * DIFF_RADIUS, j * HALF_PI, (j + 1) * HALF_PI);
      }
    }
    frame.pop();
  }
}

function onSceneChanged(prev, next) {
  if (next === Scenes.Circles) {
    for (const s of squares) {
      if (prev === Scenes.SquaresVertical) {
        s.y += SIZE * s.d;
      } else {
        s.x += SIZE * s.d;
      }
      if (s.x >= width) {
        s.x -= width;
      } else if (s.x < 0) {
        s.x += width;
      }
      if (s.y >= height) {
        s.y -= height;
      } else if (s.y < 0) {
        s.y += height;
      }
    }

    for (const p of particles) {
      p.colors = [
        pgSquares.get(p.x + SIZE / 2, p.y + SIZE / 2),
        pgSquares.get(p.x - SIZE / 2, p.y + SIZE / 2),
        pgSquares.get(p.x - SIZE / 2, p.y - SIZE / 2),
        pgSquares.get(p.x + SIZE / 2, p.y - SIZE / 2),
      ];
    }
    t1 = Timing.frames(60, { loop: false, easing: Easing.EaseInOutCubic });
  } else {
    setSquareDirection(next);
    t1 = Timing.frames(60, { loop: false, easing: Easing.EaseInOutCubic });
  }
}

function setSquareDirection(next) {
  for (const s of squares) {
    const col = s.x / SIZE;
    const row = s.y / SIZE;
    if (next === Scenes.SquaresHorizontal) {
      s.d = row % 2 === 0 ? 1 : -1;
    } else {
      s.d = col % 2 === 0 ? 1 : -1;
    }
  }
}

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  setPalette('Bauhaus1');
  // randomPalette();
  lfo1 = createLfo(LfoWaveform.Sawtooth, Timing.frames(120), 0, TWO_PI);
  t1 = Timing.frames(60, { loop: false, easing: Easing.EaseInOutCubic });

  for (let x = 0; x <= width; x += SIZE) {
    for (let y = 0; y <= height; y += SIZE) {
      particles.push(new Particle(x, y, [color(255), color(255), color(255), color(255)]));
    }
  }
  for (let x = 0; x < width; x += SIZE) {
    for (let y = 0; y < height; y += SIZE) {
      squares.push(new Square(x, y, SIZE, SIZE, random(PALETTE)));
    }
  }
  setSquareDirection();

  background(0, 0, 0, 0);
  targetBuffer = createGraphics(width, height);
  pgSquares = createGraphics(width, height);
  pgCircles = createGraphics(width, height);
  for (const p of particles) {
    p.draw(pgCircles);
  }
  mask = pgCircles.get();
}

function prepareGraphics() {
  if (currentScene === Scenes.Circles) {
    targetBuffer.image(pgCircles, 0, 0);
  } else {
    const imageBuffer = pgSquares.get();
    imageBuffer.mask(mask);
    targetBuffer.image(imageBuffer, 0, 0);
  }
}

function draw() {
  background(0);

  for (const p of particles) {
    p.draw(this);
  }
  if (currentScene === Scenes.Circles) {
  } else {
    squares.forEach((c) => c.draw(pgSquares));
    prepareGraphics();
    image(targetBuffer, 0, 0);
  }

  if (t1.finished) {
    nextScene();
  }
}
