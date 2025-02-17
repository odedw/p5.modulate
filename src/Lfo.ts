import { TimeFunction, TimeFunctionType } from './TimeFunction';

export enum LfoWaveform {
  Sine,
  Square,
  Saw,
  Triangle,
}

export class Lfo {
  private _value: number = 0;

  constructor(public waveform: LfoWaveform, public frequency: TimeFunction, public min: number, public max: number) {
    this.update();
  }

  get value(): number {
    if (this.frequency.type === TimeFunctionType.Manual) {
      this.update();
    }
    return this._value;
  }

  update() {
    if (this.frequency.type === TimeFunctionType.Manual) {
      this.frequency.advanceManual();
    }

    const elapsed = this.frequency.elapsed;
    let value = 0;

    switch (this.waveform) {
      case LfoWaveform.Sine:
        value = sin(elapsed * TWO_PI);
        break;
      case LfoWaveform.Square:
        value = elapsed < 0.5 ? 1 : -1;
        break;
      case LfoWaveform.Saw:
        value = elapsed * 2 - 1;
        break;
      case LfoWaveform.Triangle:
        if (elapsed < 0.25) {
          value = elapsed * 4;
        } else if (elapsed < 0.75) {
          value = 2 - elapsed * 4;
        } else {
          value = elapsed * 4 - 4;
        }
        break;
    }

    this._value = map(value, -1, 1, this.min, this.max);
  }

  get active(): boolean {
    return this.frequency.active;
  }

  get finished(): boolean {
    return this.frequency.finished;
  }

  activate() {
    this.frequency.activate();
  }

  deactivate() {
    this.frequency.deactivate();
  }

  reset() {
    this.frequency.reset();
  }
}

export function createLfo(options: {
  waveform: LfoWaveform;
  frequency: TimeFunction;
  min?: number;
  max?: number;
}): Lfo {
  const { waveform, frequency, min = 0, max = 1 } = options;
  return new Lfo(waveform, frequency, min, max);
}
