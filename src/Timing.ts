export enum TimingType {
  Frames,
  Milliseconds,
  Seconds,
  Manual,
}

export class Timing {
  constructor(public readonly timingType: TimingType, public readonly value: number = 0) {}
}

export const LfoTiming = {
  Frames: function (frames: number): Timing {
    return new Timing(TimingType.Frames, frames);
  },

  Milliseconds: function (ms: number): Timing {
    return new Timing(TimingType.Milliseconds, ms);
  },

  Seconds: function (s: number): Timing {
    return new Timing(TimingType.Seconds, s);
  },

  Manual: function (s: number): Timing {
    return new Timing(TimingType.Manual, s);
  },
};
