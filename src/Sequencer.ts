import { Timing } from './Timing';

export class Sequencer {
  static Registry: Sequencer[] = [];
  private _currentStep: number = 0;
  private _values: number[] = [];

  constructor(
    public readonly frequency: Timing,
    public readonly min: number,
    public readonly max: number,
    public readonly steps: number
  ) {
    Sequencer.Registry.push(this);
    this.randomize();
    this.frequency.loop = false;
  }

  get currentValue(): number {
    return this._values[this._currentStep];
  }

  get currentStep(): number {
    return this._currentStep;
  }

  randomize(): void {
    this._values = Array(this.steps)
      .fill(0)
      .map(() => random(this.min, this.max));
  }

  get values(): number[] {
    return this._values;
  }

  setValue(step: number, value: number): void {
    if (step >= 0 && step < this.steps) {
      this._values[step] = Math.max(this.min, Math.min(this.max, value));
    }
  }

  get value(): number {
    return this._values[this._currentStep];
  }

  tick(): void {
    if (this.frequency.finished) {
      this._currentStep = (this._currentStep + 1) % this.steps;
      this.frequency.reset();
    }
  }

  reset(): void {
    this._currentStep = 0;
    this.frequency.reset();
  }
}

export function createSequencer(options: { frequency: Timing; min?: number; max?: number; steps: number }): Sequencer {
  const { frequency, min = 0, max = 1, steps } = options;
  return new Sequencer(frequency, min, max, steps);
}
