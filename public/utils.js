function polarToCartesian(r, a) {
  return {
    x: cos(a) * r,
    y: sin(a) * r,
  };
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

  return obj;
}
