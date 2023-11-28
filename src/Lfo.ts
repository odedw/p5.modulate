export enum Timing {
  Frames,
  Milliseconds,
  Manual,
}

export enum Waveform {
  Sine,
  Triangle,
  Square,
  Sawtooth,
  Noise,
}

export class Lfo {
  static Registry: Lfo[] = [];

  private elapsedTimeMs: number = 0;
  private _value?: number;
  private _previousValue?: number;

  constructor(
    public waveform: Waveform,
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

  public get previousValue(): number {
    return this._previousValue || this.value;
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
    this._previousValue = this._value;
    this._value = v;
    return this._value;
  }
}

export function createLfo(
  waveform: Waveform,
  timing: Timing,
  frequency: number,
  min: number = -1,
  max: number = 1,
  phase: number = 0
): Lfo {
  return new Lfo(waveform, timing, frequency, min, max, phase);
}
