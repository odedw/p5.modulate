export enum TimingType {
  Frames,
  Milliseconds,
  Seconds,
  Manual,
}

export class Timing {
  static Registry: Timing[] = [];
  private elapsedTimeMs: number = 0;
  private elapsedFrames: number = 0;
  private elapsedSteps: number = 0;

  constructor(
    public readonly timingType: TimingType,
    public readonly value: number = 0,
    public phase: number = 0,
    public loop: boolean = true
  ) {
    Timing.Registry.push(this);
    if (this.timingType === TimingType.Manual) {
      this.elapsedSteps = phase;
    } else if (this.timingType === TimingType.Frames) {
      this.elapsedFrames = phase;
    } else if (this.timingType === TimingType.Milliseconds) {
      this.elapsedTimeMs = phase;
    } else if (this.timingType === TimingType.Seconds) {
      this.elapsedTimeMs = phase * 1000;
    }
  }

  advanceTime(timeMs: number) {
    this.elapsedTimeMs += timeMs;
    const normalizedValue = this.timingType === TimingType.Milliseconds ? this.value : this.value * 1000;
    if (this.elapsedTimeMs >= normalizedValue) {
      if (this.loop) {
        this.elapsedTimeMs = this.elapsedTimeMs % normalizedValue;
      } else {
        this.elapsedTimeMs = normalizedValue;
      }
    }
  }

  advanceFrames(frames: number) {
    this.elapsedFrames += frames;
    if (this.elapsedFrames >= this.value) {
      if (this.loop) {
        this.elapsedFrames = this.elapsedFrames % this.value;
      } else {
        this.elapsedFrames = this.value;
      }
    }
  }

  advanceManual(steps: number = 1) {
    this.elapsedSteps += steps;
    if (this.elapsedSteps >= this.value) {
      if (this.loop) {
        this.elapsedSteps = this.elapsedSteps % this.value;
      } else {
        this.elapsedSteps = this.value;
      }
    }
  }

  /**
   * Returns the elapsed percentage of the timing value.
   */
  get elapsed(): number {
    let result = 0;
    if (this.timingType === TimingType.Frames) {
      result = this.elapsedFrames / this.value;
    } else if (this.timingType === TimingType.Milliseconds) {
      result = this.elapsedTimeMs / this.value;
    } else if (this.timingType === TimingType.Seconds) {
      result = this.elapsedTimeMs / (this.value * 1000);
    } else if (this.timingType === TimingType.Manual) {
      result = this.elapsedSteps / this.value;
    }

    return result;
  }
}

export const LfoTiming = {
  Frames: function (frames: number, phase: number = 0): Timing {
    return new Timing(TimingType.Frames, frames, phase);
  },

  Milliseconds: function (ms: number, phase: number = 0): Timing {
    return new Timing(TimingType.Milliseconds, ms, phase);
  },

  Seconds: function (s: number, phase: number = 0): Timing {
    return new Timing(TimingType.Seconds, s, phase);
  },

  Manual: function (s: number = 0, phase: number = 0): Timing {
    return new Timing(TimingType.Manual, s, phase);
  },
};
