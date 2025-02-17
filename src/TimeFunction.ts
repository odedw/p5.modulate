export enum TimeFunctionType {
  Frames,
  Milliseconds,
  Seconds,
  Manual,
}

export enum Easing {
  Linear,
  EaseInQuad,
  EaseOutQuad,
  EaseInOutQuad,
  EaseInCubic,
  EaseOutCubic,
  EaseInOutCubic,
}

export class TimeFunction {
  static Registry: TimeFunction[] = [];
  private elapsedTimeMs: number = 0;
  private elapsedFrames: number = 0;
  private elapsedSteps: number = 0;
  private _active: boolean = false;

  constructor(
    public readonly type: TimeFunctionType,
    public readonly value: number = 0,
    public readonly phase: number = 0,
    public loop: boolean = true,
    public autoTrigger: boolean = true,
    public easing: Easing = Easing.Linear
  ) {
    TimeFunction.Registry.push(this);
    this.reset();
  }

  reset() {
    if (this.autoTrigger) {
      this._active = true;
    }

    if (this.type === TimeFunctionType.Manual) {
      this.elapsedSteps = this.phase;
    } else if (this.type === TimeFunctionType.Frames) {
      this.elapsedFrames = this.phase;
    } else if (this.type === TimeFunctionType.Milliseconds) {
      this.elapsedTimeMs = this.phase;
    } else if (this.type === TimeFunctionType.Seconds) {
      this.elapsedTimeMs = this.phase * 1000;
    }
  }

  advanceTime(timeMs: number) {
    this.elapsedTimeMs += timeMs;
    const normalizedValue = this.type === TimeFunctionType.Milliseconds ? this.value : this.value * 1000;
    if (
      (this.type === TimeFunctionType.Milliseconds || this.type === TimeFunctionType.Seconds) &&
      this.elapsedTimeMs >= normalizedValue
    ) {
      if (this.loop) {
        this.elapsedTimeMs = this.elapsedTimeMs % normalizedValue;
      } else {
        this.elapsedTimeMs = normalizedValue;
        this.deactivate();
      }
    }
  }

  advanceFrames(frames: number) {
    this.elapsedFrames += frames;

    if (this.type === TimeFunctionType.Frames && this.elapsedFrames >= this.value) {
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
    if (this.type === TimeFunctionType.Manual && this.elapsedSteps >= this.value) {
      if (this.loop) {
        this.elapsedSteps = this.elapsedSteps % this.value;
      } else {
        this.elapsedSteps = this.value;
        this.deactivate();
      }
    }
  }

  easeInQuad(x: number) {
    return x * x;
  }

  easeOutQuad(x: number) {
    return 1 - (1 - x) * (1 - x);
  }

  easeInOutQuad(x: number) {
    return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
  }

  easeInCubic(x: number) {
    return x * x * x;
  }

  easeOutCubic(x: number) {
    return 1 - pow(1 - x, 3);
  }

  easeInOutCubic(x: number) {
    return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
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
    if (this.type === TimeFunctionType.Frames) {
      result = this.elapsedFrames / this.value;
    } else if (this.type === TimeFunctionType.Milliseconds) {
      result = this.elapsedTimeMs / this.value;
    } else if (this.type === TimeFunctionType.Seconds) {
      result = this.elapsedTimeMs / (this.value * 1000);
    } else if (this.type === TimeFunctionType.Manual) {
      result = this.elapsedSteps / this.value;
    }

    switch (this.easing) {
      case Easing.EaseInQuad:
        result = this.easeInQuad(result);
        break;
      case Easing.EaseOutQuad:
        result = this.easeOutQuad(result);
        break;
      case Easing.EaseInOutQuad:
        result = this.easeInOutQuad(result);
        break;
      case Easing.EaseInCubic:
        result = this.easeInCubic(result);
        break;
      case Easing.EaseOutCubic:
        result = this.easeOutCubic(result);
        break;
      case Easing.EaseInOutCubic:
        result = this.easeInOutCubic(result);
        break;
    }

    return result;
  }

  get isActive(): boolean {
    return this._active;
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

const defaultOpts = {
  phase: 0,
  loop: true,
  autoTrigger: true,
  easing: Easing.Linear,
};

export const TimeFunctionGenerator = {
  frames: function (
    frames: number,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: Easing }
  ): TimeFunction {
    return new TimeFunction(
      TimeFunctionType.Frames,
      frames,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  milliseconds: function (
    ms: number,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: Easing }
  ): TimeFunction {
    return new TimeFunction(
      TimeFunctionType.Milliseconds,
      ms,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  seconds: function (
    s: number,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: Easing }
  ): TimeFunction {
    return new TimeFunction(
      TimeFunctionType.Seconds,
      s,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  manual: function (
    s: number = 0,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: Easing }
  ): TimeFunction {
    return new TimeFunction(
      TimeFunctionType.Manual,
      s,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  zero: function () {
    return TimeFunctionGenerator.manual(0, {
      loop: false,
      autoTrigger: false,
    });
  },
};
