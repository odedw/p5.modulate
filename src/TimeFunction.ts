// Time function type constants
export const TIME_FRAMES = 'time_frames';
export const TIME_MILLISECONDS = 'time_milliseconds';
export const TIME_SECONDS = 'time_seconds';
export const TIME_MANUAL = 'time_manual';

export type TimeFunctionType = typeof TIME_FRAMES | typeof TIME_MILLISECONDS | typeof TIME_SECONDS | typeof TIME_MANUAL;

// Run mode constants
export const RUN_MODE_LOOP = 'run_mode_loop';
export const RUN_MODE_ONCE = 'run_mode_once';
export type RunMode = typeof RUN_MODE_LOOP | typeof RUN_MODE_ONCE;

// Time function trigger constants
export const TIME_TRIGGER_AUTO = 'time_trigger_auto';
export const TIME_TRIGGER_MANUAL = 'time_trigger_manual';
export type TimeFunctionTrigger = typeof TIME_TRIGGER_AUTO | typeof TIME_TRIGGER_MANUAL;

// Easing function constants
export const EASE_LINEAR = 'ease_linear';
export const EASE_IN_QUAD = 'ease_in_quad';
export const EASE_OUT_QUAD = 'ease_out_quad';
export const EASE_IN_OUT_QUAD = 'ease_in_out_quad';
export const EASE_IN_CUBIC = 'ease_in_cubic';
export const EASE_OUT_CUBIC = 'ease_out_cubic';
export const EASE_IN_OUT_CUBIC = 'ease_in_out_cubic';

export type EasingType =
  | typeof EASE_LINEAR
  | typeof EASE_IN_QUAD
  | typeof EASE_OUT_QUAD
  | typeof EASE_IN_OUT_QUAD
  | typeof EASE_IN_CUBIC
  | typeof EASE_OUT_CUBIC
  | typeof EASE_IN_OUT_CUBIC;

const easingFunctions: Record<EasingType, (x: number) => number> = {
  [EASE_LINEAR]: (x) => x,
  [EASE_IN_QUAD]: (x) => x * x,
  [EASE_OUT_QUAD]: (x) => 1 - (1 - x) * (1 - x),
  [EASE_IN_OUT_QUAD]: (x) => (x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2),
  [EASE_IN_CUBIC]: (x) => x * x * x,
  [EASE_OUT_CUBIC]: (x) => 1 - pow(1 - x, 3),
  [EASE_IN_OUT_CUBIC]: (x) => (x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2),
};

export class TimeFunction {
  private elapsedTimeMs: number = 0;
  private elapsedFrames: number = 0;
  private elapsedSteps: number = 0;
  private _active: boolean = false;

  constructor(
    public readonly functionType: TimeFunctionType,
    public readonly duration: number = 0,
    public readonly phase: number = 0,
    public readonly runMode: RunMode = RUN_MODE_LOOP,
    public readonly trigger: TimeFunctionTrigger = TIME_TRIGGER_AUTO,
    public readonly easingType: EasingType = EASE_LINEAR
  ) {
    this.reset();
  }

  reset() {
    if (this.trigger === TIME_TRIGGER_AUTO) {
      this._active = true;
    }

    if (this.functionType === TIME_MANUAL) {
      this.elapsedSteps = this.phase;
    } else if (this.functionType === TIME_FRAMES) {
      this.elapsedFrames = this.phase;
    } else if (this.functionType === TIME_MILLISECONDS) {
      this.elapsedTimeMs = this.phase;
    } else if (this.functionType === TIME_SECONDS) {
      this.elapsedTimeMs = this.phase * 1000;
    }
  }

  advanceTime(timeMs: number) {
    this.elapsedTimeMs += timeMs;
    const normalizedDuration = this.functionType === TIME_MILLISECONDS ? this.duration : this.duration * 1000;
    if (
      (this.functionType === TIME_MILLISECONDS || this.functionType === TIME_SECONDS) &&
      this.elapsedTimeMs >= normalizedDuration
    ) {
      if (this.runMode === RUN_MODE_LOOP) {
        this.elapsedTimeMs = this.elapsedTimeMs % normalizedDuration;
      } else {
        this.elapsedTimeMs = normalizedDuration;
        this.deactivate();
      }
    }
  }

  advanceFrames(frames: number) {
    this.elapsedFrames += frames;

    if (this.functionType === TIME_FRAMES && this.elapsedFrames >= this.duration) {
      if (this.runMode === RUN_MODE_LOOP) {
        this.elapsedFrames = this.elapsedFrames % this.duration;
      } else {
        this.elapsedFrames = this.duration;
        this._active = false;
      }
    }
  }

  advanceManual(steps: number = 1) {
    this.elapsedSteps += steps;
    if (this.functionType === TIME_MANUAL && this.elapsedSteps >= this.duration) {
      if (this.runMode === RUN_MODE_LOOP) {
        this.elapsedSteps = this.elapsedSteps % this.duration;
      } else {
        this.elapsedSteps = this.duration;
        this.deactivate();
      }
    }
  }

  /**
   * Returns the elapsed percentage of the timing value.
   */
  get elapsed(): number {
    // zero timers are always done
    if (this.duration === 0) {
      return 1;
    }

    let result = 0;
    if (this.functionType === TIME_FRAMES) {
      result = this.elapsedFrames / this.duration;
    } else if (this.functionType === TIME_MILLISECONDS) {
      result = this.elapsedTimeMs / this.duration;
    } else if (this.functionType === TIME_SECONDS) {
      result = this.elapsedTimeMs / (this.duration * 1000);
    } else if (this.functionType === TIME_MANUAL) {
      result = this.elapsedSteps / this.duration;
    }

    return easingFunctions[this.easingType](result);
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

interface TimeFunctionOptions {
  functionType: TimeFunctionType;
  duration: number;
  phase?: number;
  runMode?: RunMode;
  trigger?: TimeFunctionTrigger;
  easingType?: EasingType;
}

const defaultTimeFunctionOptions = {
  phase: 0,
  runMode: RUN_MODE_LOOP,
  trigger: TIME_TRIGGER_AUTO,
  easingType: EASE_LINEAR,
} as const;

/**
 * Creates a new TimeFunction for controlling time-based progression
 * @param options Configuration options
 * @param options.functionType The type of time function (TIME_FRAMES, TIME_SECONDS, etc.)
 * @param options.duration The duration/steps value (frames, seconds, etc. depending on type)
 * @param [options.phase=0] Starting phase (0-1)
 * @param [options.runMode=RUN_MODE_LOOP] Whether to loop or run once
 * @param [options.trigger=TIME_TRIGGER_AUTO] Whether to auto-start or require manual trigger
 * @param [options.easingType=EASE_LINEAR] Easing function to apply
 */
export function createTimeFunction(options: TimeFunctionOptions): TimeFunction {
  const {
    functionType,
    duration,
    phase = defaultTimeFunctionOptions.phase,
    runMode = defaultTimeFunctionOptions.runMode,
    trigger = defaultTimeFunctionOptions.trigger,
    easingType = defaultTimeFunctionOptions.easingType,
  } = options;

  return new TimeFunction(functionType, duration, phase, runMode, trigger, easingType);
}

// Convenience functions that wrap createTimeFunction
// export const TimeFunctionHelpers = {
//   frames(frames: number, opts?: Partial<Omit<TimeFunctionOptions, 'functionType' | 'duration'>>) {
//     return createTimeFunction({
//       functionType: TIME_FRAMES,
//       duration: frames,
//       ...opts,
//     });
//   },

//   seconds(s: number, opts?: Partial<Omit<TimeFunctionOptions, 'functionType' | 'duration'>>) {
//     return createTimeFunction({
//       functionType: TIME_SECONDS,
//       duration: s,
//       ...opts,
//     });
//   },

//   milliseconds(ms: number, opts?: Partial<Omit<TimeFunctionOptions, 'functionType' | 'duration'>>) {
//     return createTimeFunction({
//       functionType: TIME_MILLISECONDS,
//       duration: ms,
//       ...opts,
//     });
//   },

//   manual(steps: number = 0, opts?: Partial<Omit<TimeFunctionOptions, 'functionType' | 'duration'>>) {
//     return createTimeFunction({
//       functionType: TIME_MANUAL,
//       duration: steps,
//       ...opts,
//     });
//   },

//   zero() {
//     return TimeFunctionHelpers.manual(0, {
//       runMode: RUN_MODE_ONCE,
//       trigger: TIME_TRIGGER_MANUAL,
//     });
//   },
// } as const;
