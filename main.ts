import * as modulate from './src';
p5.prototype.modulateHooks = modulate.modulateHooks;
p5.prototype.Waveform = modulate.Waveform;
p5.prototype.Timing = modulate.Timing;
p5.prototype.createLfo = modulate.createLfo;
p5.prototype.registerMethod('pre', p5.prototype.modulateHooks.onDraw);
