import { Timing } from './Timing';

export function onDraw() {
  for (const t of Timing.Registry) {
    t.advanceTime(deltaTime);
    t.advanceFrames(1);
  }
}
