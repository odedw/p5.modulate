import { Sequencer } from '.';
import { TimeFunction } from './TimeFunction';

export function onDraw() {
  // only advance timing if it's active
  for (const t of TimeFunction.Registry.filter((t) => t.active)) {
    t.advanceTime(deltaTime);
    t.advanceFrames(1);
  }

  // calculate envelope stages
  // note: has to happen after timing advance
  // for (const e of Envelope.Registry) {
  //   let prevStage = e.stage;
  //   while (true) {
  //     let stage = e.calculateStage();
  //     if (stage === prevStage) break;
  //     prevStage = stage;
  //   }
  // }

  // tick sequencers
  for (const s of Sequencer.Registry) {
    s.tick();
  }
}

export function advanceTime(timeMs: number) {
  // only advance timing if it's active
  for (const t of TimeFunction.Registry.filter((t) => t.active)) {
    t.advanceTime(timeMs);
  }
}

export function advanceFrames(frames: number) {
  // note: has to happen after timing advance
  for (const t of TimeFunction.Registry.filter((t) => t.active)) {
    t.advanceFrames(frames);
  }
}
