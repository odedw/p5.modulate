let state = '0000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000';
const colors = ['31', '32', '33', '34', '35', '36', '37', '90', '91', '92', '93', '94', '95', '96', '97'];
colors.sort(() => Math.random() - 0.5);
let palette;

const rules = [90, 54, 60, 102, 110, 122, 126, 150, 158, 182];
let ruleIndex = 0;
let ruleBinary;

function getCellNumber(index) {
  const numString =
    index === 0
      ? state.slice(-1) + state.slice(0, 2)
      : index === state.length - 1
      ? state.slice(index - 1, index + 1) + state[0]
      : state.slice(index - 1, index + 2);

  const num = parseInt(numString, 2);
  return num;
}

function computeNextStep() {
  let newState = state
    .split('')
    .map((s, i) => ruleBinary[ruleBinary.length - getCellNumber(i) - 1])
    .join('');
  state = newState;
}

function printState() {
  const output = state.split('').map((s, i) => {
    const index = getCellNumber(i);
    return `\x1b[${palette[index]}m█\x1b[0m`;
  });
  console.log(output.join(''));
}

let step = 0;
const interval = setInterval(function () {
  if (step % 100 === 0) {
    const rule = rules[ruleIndex % rules.length];
    ruleBinary = rule.toString(2).padStart(8, '0');
    colors.sort(() => Math.random() - 0.5);
    palette = ['30', ...colors];
    ruleIndex++;
  }
  printState();
  computeNextStep();
  step++;
}, 50);
