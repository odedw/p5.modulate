class Midi {
  _m = null;
  init() {
    return new Promise((resolve, reject) => {
      WebMidi.enable().then(
        (midiAccess) => {
          console.log('MIDI ready!');
          this._m = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
          resolve();
        },
        (msg) => {
          console.error(`Failed to get MIDI access - ${msg}`);
          reject(msg);
        }
      );
    });
  }

  getOutput(name) {
    return WebMidi.getOutputByName(name);
  }

  list() {
    for (const o of WebMidi.outputs) {
      console.log(o.name);
    }
  }

  // listInputsAndOutputs() {
  //   for (const entry of this._m.inputs) {
  //     const input = entry[1];
  //     console.log(
  //       `Input port [type:'${input.type}']` +
  //         ` id:'${input.id}'` +
  //         ` manufacturer:'${input.manufacturer}'` +
  //         ` name:'${input.name}'` +
  //         ` version:'${input.version}'`
  //     );
  //   }

  //   for (const entry of this._m.outputs) {
  //     const output = entry[1];
  //     console.log(
  //       `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
  //     );
  //   }
  // }

  // getInput(name) {
  //   for (const entry of this._m.inputs) {
  //     const input = entry[1];
  //     if (input.name === name) {
  //       return input;
  //     }
  //   }
  //   return null;
  // }
}
