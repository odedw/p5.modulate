import * as modulate from './src';

// Add core functionality to p5 prototype
p5.prototype.modulate = modulate;
p5.prototype.createTimeFunction = modulate.createTimeFunction;
p5.prototype.createLfo = modulate.createLfo;
// p5.prototype.createEnvelope = modulate.createEnvelope;
p5.prototype.createSequencer = modulate.createSequencer;
p5.prototype.registerMethod('pre', modulate.onDraw);

// Add constants to p5 prototype
// Time function constants
p5.prototype.TIME_FRAMES = modulate.TIME_FRAMES;
p5.prototype.TIME_MILLISECONDS = modulate.TIME_MILLISECONDS;
p5.prototype.TIME_SECONDS = modulate.TIME_SECONDS;
p5.prototype.TIME_MANUAL = modulate.TIME_MANUAL;

// Easing constants
p5.prototype.EASE_LINEAR = modulate.EASE_LINEAR;
p5.prototype.EASE_IN_QUAD = modulate.EASE_IN_QUAD;
p5.prototype.EASE_OUT_QUAD = modulate.EASE_OUT_QUAD;
p5.prototype.EASE_IN_OUT_QUAD = modulate.EASE_IN_OUT_QUAD;
p5.prototype.EASE_IN_CUBIC = modulate.EASE_IN_CUBIC;
p5.prototype.EASE_OUT_CUBIC = modulate.EASE_OUT_CUBIC;
p5.prototype.EASE_IN_OUT_CUBIC = modulate.EASE_IN_OUT_CUBIC;

// Waveform constants
p5.prototype.WAVE_SINE = modulate.WAVE_SINE;
p5.prototype.WAVE_SQUARE = modulate.WAVE_SQUARE;
p5.prototype.WAVE_SAW = modulate.WAVE_SAW;
p5.prototype.WAVE_TRIANGLE = modulate.WAVE_TRIANGLE;
