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

  private _manualValue: number = 0;

  constructor(public waveform: LfoWaveform, public frequency: Timing, public min: number, public max: number) {
    Lfo.Registry.push(this);
    if (frequency.timingType === TimingType.Manual) {
      this.calculateManualValue();
    }
  }

  get value(): number {
    if (this.frequency.timingType === TimingType.Manual) {
      return this._manualValue;
    }

    // get mapped x value in the cycle
    const x = map(this.frequency.elapsed, 0, 1, 0, TWO_PI);

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

  private calculateManualValue() {
    // compute new value
    const current = this.frequency.elapsed;
    const x = map(current, 0, 1, 0, TWO_PI);
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
  }

  public step(): number {
    this.frequency.advanceManual();
    this.calculateManualValue();
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

export function createLfo(options: {
  waveform: LfoWaveform,
  frequency: Timing,
  min?: number,
  max?: number
}): Lfo {
  const { waveform, frequency, min = -1, max = 1 } = options;
  return new Lfo(waveform, frequency, min, max);
}
