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
  console.log(hPhase);
  return {
    l: createLfo(LfoWaveform.Sine, Timing.frames(int(random(20 * 60, phase)))),
    s: createLfo(LfoWaveform.Sine, Timing.frames(int(random(20 * 60, phase)))),
    h: createLfo(LfoWaveform.Sine, Timing.frames(int(hFrequency), hPhase), -1, 1),
  };
}
