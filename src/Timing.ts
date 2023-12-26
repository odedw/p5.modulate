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
  private _active: boolean = false;

  constructor(
    public readonly timingType: TimingType,
    public readonly value: number = 0,
    public readonly phase: number = 0,
    public loop: boolean = true,
    public autoTrigger: boolean = true
  ) {
    Timing.Registry.push(this);
    this.reset();
  }

  reset() {
    if (this.autoTrigger) {
      this._active = true;
    }

    if (this.timingType === TimingType.Manual) {
      this.elapsedSteps = this.phase;
    } else if (this.timingType === TimingType.Frames) {
      this.elapsedFrames = this.phase;
    } else if (this.timingType === TimingType.Milliseconds) {
      this.elapsedTimeMs = this.phase;
    } else if (this.timingType === TimingType.Seconds) {
      this.elapsedTimeMs = this.phase * 1000;
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
        this._active = false;
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
        this._active = false;
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
        this._active = false;
      }
    }
  }

  /**
   * Returns the elapsed percentage of the timing value.
   */
  get elapsed(): number {
    // zero timers are always done
    if (this.value === 0) {
      return 1;
    }

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

  get finished(): boolean {
    return !this._active && this.elapsed === 1;
  }

  get active(): boolean {
    return this._active;
  }

  activate() {
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }
}

export const TimingFactory = {
  frames: function (frames: number, phase: number = 0): Timing {
    return new Timing(TimingType.Frames, frames, phase);
  },

  milliseconds: function (ms: number, phase: number = 0): Timing {
    return new Timing(TimingType.Milliseconds, ms, phase);
  },

  seconds: function (s: number, phase: number = 0): Timing {
    return new Timing(TimingType.Seconds, s, phase);
  },

  manual: function (s: number = 0, phase: number = 0, loop: boolean = true, autoTrigger: boolean = true): Timing {
    return new Timing(TimingType.Manual, s, phase, loop, autoTrigger);
  },

  zero: function () {
    return TimingFactory.manual(0, 0, false, false);
  },
};
