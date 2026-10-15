// Run: npm run bench
// Times brute() and your fast() as n doubles, so you can SEE the complexity.
//   O(n):  doubling n roughly doubles the time   (ratio ≈ 2)
//   O(n²): doubling n roughly quadruples it      (ratio ≈ 4)
//   O(n³): doubling n multiplies it by about 8   (ratio ≈ 8)
// Small timings are noisy. Look at the trend in the bigger rows.

const cases = require('./_harness/cases');
const { load } = require('./_harness/load');
const only = process.argv[2];
const useRef = process.env.USE_REFERENCE === '1';

function time(fn, args, reps) {
  fn(...args); // warm up
  const start = performance.now();
  for (let r = 0; r < reps; r++) fn(...args);
  return (performance.now() - start) / reps;
}

for (const [problem, spec] of Object.entries(cases)) {
  const label = 'O' + Number(problem.slice(0, 2));
  if (only && only.toUpperCase() !== label) continue;
  const brute = require('./' + problem + '.js').brute;
  const fast = load(problem, useRef);
  const started = fast(...structuredClone(spec.small[0].args)) !== undefined;

  console.log(`\n${label} · ${problem.slice(3)}${started ? '' : '   (fast() not started: showing brute force only)'}`);
  console.log('       n │  brute ms  ratio │   fast ms  ratio');
  console.log('─────────┼─────────────────┼─────────────────');
  let prevB = null, prevF = null;
  for (const n of spec.benchSizes) {
    const args = spec.benchArgs ? spec.benchArgs(n) : spec.large(n).args;
    const b = time(brute, structuredClone(args), 1);
    const f = started ? time(fast, structuredClone(args), 5) : null;
    const rb = prevB ? (b / prevB).toFixed(1) : '';
    const rf = f !== null && prevF ? (f / prevF).toFixed(1) : '';
    console.log(
      String(n).padStart(8) + ' │ ' + b.toFixed(2).padStart(9) + ' ' + rb.padStart(6) + ' │ ' +
      (f === null ? '        -' : f.toFixed(3).padStart(9)) + ' ' + rf.padStart(6)
    );
    prevB = b; prevF = f;
  }
}
