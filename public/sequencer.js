class Sequencer {
  steps;
  currentStep;
  values = [];
  name;
  constructor(steps, value, name, channel) {
    this.steps = steps;
    this.currentStep = -1;
    for (let i = 0; i < steps; i++) {
      this.values.push(value);
    }
    this.name = name;
    this.channel = channel;
  }

  tick() {
    this.currentStep = (this.currentStep + 1) % this.steps;
    console.log(`${this.name} | channel ${this.channel} | ${this.currentStep} | ${this.values[this.currentStep]}`);
    return this.values[this.currentStep];
  }

  reset() {
    this.currentStep = 0;
    console.log(`${this.name} | reset`);
  }
}
