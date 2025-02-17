import * as modulate from './src';

p5.prototype.modulate = modulate;
p5.prototype.TimeFunction = modulate.TimeFunctionGenerator;
p5.prototype.createLfo = modulate.createLfo;
// p5.prototype.createEnvelope = modulate.createEnvelope;
p5.prototype.createSequencer = modulate.createSequencer;
p5.prototype.registerMethod('pre', modulate.onDraw);
