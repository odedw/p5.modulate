import { Envelope } from '.';
import { Timing } from './Timing';

export function onDraw() {
  // only advance timing if it's active
  for (const t of Timing.Registry.filter((t) => t.active)) {
    t.advanceTime(deltaTime);
    t.advanceFrames(1);
  }

  // calculate envelope stages
  // note: has to happen after timing advance
  for (const e of Envelope.Registry) {
    let prevStage = e.stage;
    while (true) {
      let stage = e.calculateStage();
      if (stage === prevStage) break;
      prevStage = stage;
    }
  }
}
