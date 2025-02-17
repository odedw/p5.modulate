// import { Timing, TimingFactory } from './Timing';

// export class Envelope {
//   static Registry: Envelope[] = [];

//   private _gate: Timing = TimingFactory.zero();
//   private _stage: 'a' | 'd' | 's' | 'r' | null = null;
//   //   private sMarker?: number;
//   constructor(
//     public readonly adsr: { a: Timing; d: Timing; s: number; r: Timing },
//     public readonly min: number = 0,
//     public readonly max: number = 1
//   ) {
//     Envelope.Registry.push(this);

//     this.reset();
//   }

//   private reset() {
//     [this.adsr.a, this.adsr.d, this.adsr.r].forEach((t) => {
//       t.loop = false;
//       t.autoTrigger = false;
//       t.deactivate();
//       t.reset();
//     });
//   }

//   calculateStage() {
//     switch (this._stage) {
//       case 'a':
//         if (this.adsr.a.finished) {
//           this._stage = 'd';
//           this.adsr.d.activate();
//         }
//         break;
//       case 'd':
//         if (this.adsr.d.finished) {
//           this._stage = 's';
//         }
//         break;
//       case 's':
//         if (this._gate.finished) {
//           this._stage = 'r';
//           this.adsr.r.activate();
//         }
//         break;
//       case 'r':
//         if (this.adsr.r.finished) {
//           this._stage = null;
//         }
//         break;
//     }

//     return this._stage;
//   }

//   get value(): number {
//     switch (this._stage) {
//       case 'a':
//         return map(this.adsr.a.elapsed, 0, 1, this.min, this.max);
//       case 'd':
//         return map(this.adsr.d.elapsed, 0, 1, this.max, this.adsr.s);
//       case 's':
//         return this.adsr.s;
//       case 'r':
//         return map(this.adsr.r.elapsed, 0, 1, this.adsr.s, this.min);
//       default:
//         return this.min;
//     }
//   }

//   get active() {
//     return this._stage !== null;
//   }

//   get stage() {
//     return this._stage;
//   }

//   gate(t: Timing) {
//     this.reset();

//     // start the gate timer
//     this._gate = t;
//     t.loop = false;
//     t.autoTrigger = false;
//     t.reset();
//     t.activate();

//     // start the attack stage
//     this.adsr.a.activate();
//     this._stage = 'a';
//   }

//   pulse() {
//     this.gate(TimingFactory.zero());
//   }
// }

// export function createEnvelope(
//   adsr: { a: Timing; d: Timing; s: number; r: Timing },
//   min: number = 0,
//   max: number = 1
// ): Envelope {
//   return new Envelope(adsr, min, max);
// }
