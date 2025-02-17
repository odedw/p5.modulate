// Time function type constants
export const TIME_FRAMES = 'frames';
export const TIME_MILLISECONDS = 'milliseconds';
export const TIME_SECONDS = 'seconds';
export const TIME_MANUAL = 'manual';

export type TimeFunctionType = typeof TIME_FRAMES | typeof TIME_MILLISECONDS | typeof TIME_SECONDS | typeof TIME_MANUAL;

// Easing function constants
export const EASE_LINEAR = 'linear';
export const EASE_IN_QUAD = 'ease-in-quad';
export const EASE_OUT_QUAD = 'ease-out-quad';
export const EASE_IN_OUT_QUAD = 'ease-in-out-quad';
export const EASE_IN_CUBIC = 'ease-in-cubic';
export const EASE_OUT_CUBIC = 'ease-out-cubic';
export const EASE_IN_OUT_CUBIC = 'ease-in-out-cubic';

export type EasingType =
  | typeof EASE_LINEAR
  | typeof EASE_IN_QUAD
  | typeof EASE_OUT_QUAD
  | typeof EASE_IN_OUT_QUAD
  | typeof EASE_IN_CUBIC
  | typeof EASE_OUT_CUBIC
  | typeof EASE_IN_OUT_CUBIC;

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
    public easing: EasingType = EASE_LINEAR
  ) {
    TimeFunction.Registry.push(this);
    this.reset();
  }

  reset() {
    if (this.autoTrigger) {
      this._active = true;
    }

    if (this.type === TIME_MANUAL) {
      this.elapsedSteps = this.phase;
    } else if (this.type === TIME_FRAMES) {
      this.elapsedFrames = this.phase;
    } else if (this.type === TIME_MILLISECONDS) {
      this.elapsedTimeMs = this.phase;
    } else if (this.type === TIME_SECONDS) {
      this.elapsedTimeMs = this.phase * 1000;
    }
  }

  advanceTime(timeMs: number) {
    this.elapsedTimeMs += timeMs;
    const normalizedValue = this.type === TIME_MILLISECONDS ? this.value : this.value * 1000;
    if ((this.type === TIME_MILLISECONDS || this.type === TIME_SECONDS) && this.elapsedTimeMs >= normalizedValue) {
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

    if (this.type === TIME_FRAMES && this.elapsedFrames >= this.value) {
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
    if (this.type === TIME_MANUAL && this.elapsedSteps >= this.value) {
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
    if (this.type === TIME_FRAMES) {
      result = this.elapsedFrames / this.value;
    } else if (this.type === TIME_MILLISECONDS) {
      result = this.elapsedTimeMs / this.value;
    } else if (this.type === TIME_SECONDS) {
      result = this.elapsedTimeMs / (this.value * 1000);
    } else if (this.type === TIME_MANUAL) {
      result = this.elapsedSteps / this.value;
    }

    switch (this.easing) {
      case EASE_IN_QUAD:
        result = this.easeInQuad(result);
        break;
      case EASE_OUT_QUAD:
        result = this.easeOutQuad(result);
        break;
      case EASE_IN_OUT_QUAD:
        result = this.easeInOutQuad(result);
        break;
      case EASE_IN_CUBIC:
        result = this.easeInCubic(result);
        break;
      case EASE_OUT_CUBIC:
        result = this.easeOutCubic(result);
        break;
      case EASE_IN_OUT_CUBIC:
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
  easing: EASE_LINEAR as EasingType,
};

export const TimeFunctionGenerator = {
  frames: function (
    frames: number,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: EasingType }
  ): TimeFunction {
    return new TimeFunction(
      TIME_FRAMES,
      frames,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  milliseconds: function (
    ms: number,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: EasingType }
  ): TimeFunction {
    return new TimeFunction(
      TIME_MILLISECONDS,
      ms,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  seconds: function (
    s: number,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: EasingType }
  ): TimeFunction {
    return new TimeFunction(
      TIME_SECONDS,
      s,
      opts?.phase ?? defaultOpts.phase,
      opts?.loop ?? defaultOpts.loop,
      opts?.autoTrigger ?? defaultOpts.autoTrigger,
      opts?.easing ?? defaultOpts.easing
    );
  },

  manual: function (
    s: number = 0,
    opts: { phase?: number; loop?: boolean; autoTrigger?: boolean; easing?: EasingType }
  ): TimeFunction {
    return new TimeFunction(
      TIME_MANUAL,
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
