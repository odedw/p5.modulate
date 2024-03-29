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
  constructor(cols, rows, defaultValue = 0) {
    this._matrix = [];

    for (let i = 0; i < cols; i++) {
      this._matrix.push([]);
      for (let j = 0; j < rows; j++) {
        this._matrix[i].push(defaultValue);
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

  getNeighbors(x, y, predicate) {
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

        if (predicate && !predicate(this.get(i, j))) {
          continue;
        }

        neighbors.push({ x: i, y: j, value: this.get(i, j) });
      }
    }

    return neighbors;
  }

  bfs(startPoint, predicate) {
    const queue = [startPoint];
    const visited = new Set([`${startPoint.x},${startPoint.y}`]);

    while (queue.length > 0) {
      const { x, y } = queue.shift(); // Dequeue the next cell

      if (predicate(this.get(x, y))) {
        return { x, y }; // Found the target cell
      }

      // Get all valid, not yet visited neighbors
      const neighbors = this.getNeighbors(x, y).filter((neighbor) => {
        const key = `${neighbor.x},${neighbor.y}`;
        if (visited.has(key)) {
          return false;
        }
        visited.add(key); // Mark this neighbor as visited
        return true;
      });

      // Enqueue all unvisited neighbors
      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }
    }

    return null; // No cell with value true was found
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

let scenes;
let currentScene;
let currentSceneIndex = 0;
function initScenes(s) {
  scenes = s;
  currentScene = scenes[0];
}

function onSceneChanged(prevScene, currentScene) {
  console.log('scene changed', prevScene, currentScene);
}
function nextScene() {
  let prevScene = currentScene;
  currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
  // console.log('next scene', currentSceneIndex);
  currentScene = scenes[currentSceneIndex];
  onSceneChanged(prevScene, currentScene);
}
