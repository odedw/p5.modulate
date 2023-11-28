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

  get value(): number {
    const current = (this.elapsedTimeMs + this.phase) % this.frequency;
    const x = map(current, 0, this.frequency, 0, TWO_PI);
    let v;
    if (this.waveform === Waveform.Sine) {
      v = map(sin(x), -1, 1, this.min, this.max);
    } else if (this.waveform === Waveform.Triangle) {
      v = this.getTriangleValue(x);
    } else if (this.waveform === Waveform.Square) {
      v = this.getSquareValue(x);
    } else if (this.waveform === Waveform.Sawtooth) {
      v = this.getSawtoothValue(x);
    } else {
      v = random(this.min, this.max);
    }

    return v;
  }

  private getTriangleValue(x: number): number {
    let v;
    if (x < PI * 0.5) {
      v = map(x, 0, PI * 0.5, 0, 1);
    } else if (x < PI * 1.5) {
      v = map(x, PI * 0.5, PI * 1.5, 1, -1);
    } else {
      v = map(x, PI * 1.5, TWO_PI, -1, 0);
    }

    return map(v, -1, 1, this.min, this.max);
  }

  private getSquareValue(x: number): number {
    let v;
    if (x < PI) {
      v = 1;
    } else {
      v = -1;
    }

    return map(v, -1, 1, this.min, this.max);
  }

  private getSawtoothValue(x: number): number {
    let v;
    if (x < PI) {
      v = map(x, 0, PI, 0, 1);
    } else {
      v = map(x, PI, TWO_PI, -1, 0);
    }

    return map(v, -1, 1, this.min, this.max);
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
