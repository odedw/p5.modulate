function polarToCartesian(r, a) {
  return {
    x: cos(a) * r,
    y: sin(a) * r,
  };
}

function cartesianToPolar(x, y) {
  const r = sqrt(sq(x) + sq(y));
  let a = atan(y / x);
  if (x < 0) {
    a += PI;
  }
  return { r, a };
}

function createColorLfo() {
  const phase = 0; //int(random(60));
  const hFrequency = 100 * 60;
  const hPhase = random(hFrequency);

  const obj = {
    l: createLfo(LfoWaveform.Sine, Timing.frames(int(random(20 * 60, phase)))),
    s: createLfo(LfoWaveform.Sine, Timing.frames(int(random(20 * 60, phase)))),
    h: createLfo(LfoWaveform.Sine, Timing.frames(int(hFrequency), hPhase), -1, 1),
  };

  obj.color = function () {
    const h = map(obj.h.value, -1, 1, 0, 360);
    const s = map(obj.s.value, -1, 1, 20, 100);
    const l = map(obj.l.value, -1, 1, 30, 70);

    let color = new Color('hsl', [h, s, l]);
    return { r: color.srgb.r * 255, g: color.srgb.g * 255, b: color.srgb.b * 255 };
  };

  obj.fill = function () {
    const color = obj.color();
    fill(color.r, color.g, color.b);
  };

  obj.stroke = function () {
    const color = obj.color();
    stroke(color.r, color.g, color.b);
  };

  return obj;
}

class Matrix {
  constructor(cols, rows) {
    this._matrix = [];

    for (let i = 0; i < cols; i++) {
      this._matrix.push([]);
      for (let j = 0; j < rows; j++) {
        this._matrix[i].push(0);
      }
    }
  }

  get(x, y) {
    return this._matrix[x][y];
  }

  set(x, y, value) {
    this._matrix[x][y] = value;
  }

  get width() {
    return this._matrix.length;
  }

  get height() {
    return this._matrix[0].length;
  }

  getNeighbors(x, y) {
    const neighbors = [];

    for (let i = x - 1; i <= x + 1; i++) {
      if (i < 0 || i >= this.width) {
        continue;
      }

      for (let j = y - 1; j <= y + 1; j++) {
        if (j < 0 || j >= this.height) {
          continue;
        }

        if (i === x && j === y) {
          continue;
        }

        neighbors.push({ x: i, y: j, value: this.get(i, j) });
      }
    }

    return neighbors;
  }
}

function generateGrid(cols, rows, w, h) {
  let points = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * (w / (cols - 1));
      let y = row * (h / (rows - 1));
      if (x >= 0 && x <= w && y >= 0 && y <= h) points.push({ x: int(x), y: int(y), col, row });
    }
  }
  return points;
}
