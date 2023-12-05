import * as modulate from './src';
p5.prototype.modulateHooks = modulate.modulateHooks;
p5.prototype.LfoWaveform = modulate.LfoWaveform;
p5.prototype.LfoTiming = modulate.LfoTiming;
p5.prototype.createLfo = modulate.createLfo;
p5.prototype.registerMethod('pre', p5.prototype.modulateHooks.onDraw);
