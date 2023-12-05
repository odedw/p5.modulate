import { Lfo } from './Lfo';

export function onDraw() {
  for (const lfo of Lfo.Registry) {
    lfo.advanceTime(deltaTime);
    lfo.advanceFrames(1);
  }
}
