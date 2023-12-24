import { Timing, TimingType } from './Timing';

export enum LfoWaveform {
  Sine,
  Triangle,
  Square,
  Sawtooth,
  Noise,
}

export class Lfo {
  static Registry: Lfo[] = [];

  private elapsedTimeMs: number = 0;
  private elapsedFrames: number = 0;
  private elapsedSteps: number = 0;
  private _manualValue: number = 0;

  constructor(
    public waveform: LfoWaveform,
    public frequency: Timing,
    public min: number,
    public max: number,
    public phase: number
  ) {
    Lfo.Registry.push(this);
    if (frequency.timingType === TimingType.Manual) {
      this.step();
    }
  }

  advanceTime(timeMs: number) {
    this.elapsedTimeMs += timeMs;
  }

  advanceFrames(frames: number) {
    this.elapsedFrames += frames;
  }

  get value(): number {
    if (this.frequency.timingType === TimingType.Manual) {
      return this._manualValue;
    }

    // get mapped x value in the cycle
    let current;
    if (this.frequency.timingType === TimingType.Frames) {
      current = (this.elapsedFrames + this.phase) % this.frequency.value;
    } else if (this.frequency.timingType === TimingType.Milliseconds) {
      current = (this.elapsedTimeMs + this.phase) % this.frequency.value;
    } else if (this.frequency.timingType === TimingType.Seconds) {
      current = (this.elapsedTimeMs / 1000 + this.phase) % this.frequency.value;
    } else if (this.frequency.timingType === TimingType.Manual) {
      current = (this.elapsedSteps + this.phase) % this.frequency.value;
    } else {
      return 0;
    }

    const x = map(current, 0, this.frequency.value, 0, TWO_PI);

    // map x to a value based on the waveform
    let v;
    if (this.waveform === LfoWaveform.Sine) {
      v = map(sin(x), -1, 1, this.min, this.max);
    } else if (this.waveform === LfoWaveform.Triangle) {
      v = this.getTriangleValue(x);
    } else if (this.waveform === LfoWaveform.Square) {
      v = this.getSquareValue(x);
    } else if (this.waveform === LfoWaveform.Sawtooth) {
      v = this.getSawtoothValue(x);
    } else if (this.waveform === LfoWaveform.Noise) {
      v = random(this.min, this.max);
    } else {
      return 0;
    }

    return v;
  }

  public step(): number {
    this.elapsedSteps++;

    // compute new value
    const current = this.elapsedSteps + (this.phase % this.frequency.value);
    const x = map(current, 0, this.frequency.value, 0, TWO_PI);
    let v;
    if (this.waveform === LfoWaveform.Sine) {
      v = map(sin(x), -1, 1, this.min, this.max);
    } else if (this.waveform === LfoWaveform.Triangle) {
      v = this.getTriangleValue(x);
    } else if (this.waveform === LfoWaveform.Square) {
      v = this.getSquareValue(x);
    } else if (this.waveform === LfoWaveform.Sawtooth) {
      v = this.getSawtoothValue(x);
    } else if (this.waveform === LfoWaveform.Noise) {
      v = random(this.min, this.max);
    } else {
      v = 0;
    }

    this._manualValue = v;

    return this._manualValue;
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
  waveform: LfoWaveform,
  frequency: Timing,
  min: number = -1,
  max: number = 1,
  phase: number = 0
): Lfo {
  return new Lfo(waveform, frequency, min, max, phase);
}
