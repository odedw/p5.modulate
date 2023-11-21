export const SINE = 'sine';
export const TRIANGLE = 'triangle';
type LFO_TYPE = 'sine' | 'triangle';

export enum Timing {
  Frames,
  Time,
  Manual,
}

export class Lfo {
  static Registry: Lfo[] = [];

  private elapsedTimeMs: number = 0;

  constructor(
    public type: LFO_TYPE,
    public timing: Timing,
    public frequency: number,
    public min: number,
    public max: number,
    public phase: number
  ) {
    Lfo.Registry.push(this);
  }

  advanceTime(timeMs: number) {
    this.elapsedTimeMs += timeMs;
  }

  get value(): number {
    const x = map(
      this.elapsedTimeMs + this.phase,
      0,
      this.frequency,
      0,
      TWO_PI
    );
    const v = map(sin(x), -1, 1, this.min, this.max);
    return v;
  }
}

export function createLfo(
  type: LFO_TYPE,
  timing: Timing,
  frequency: number,
  min: number = -1,
  max: number = 1,
  phase: number = 0
): Lfo {
  return new Lfo(type, timing, frequency, min, max, phase);
}
