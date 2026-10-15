// Run: npm test             (all problems)
//      npm test -- O4       (just one problem, see package.json)
// Problems you haven't started are skipped, not failed.

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const cases = require('./_harness/cases');
const { load } = require('./_harness/load');
const { checkResult } = require('./_harness/check');
const { runLarge } = require('./_harness/run-in-worker');

const USE_REFERENCE = process.env.USE_REFERENCE === '1';
const TIME_LIMIT_MS = 1500;
const ONLY = (process.env.ONLY || '').toUpperCase();

for (const [problem, spec] of Object.entries(cases)) {
  const id = 'O' + Number(problem.slice(0, 2));
  if (ONLY && ONLY !== id) continue;
  const label = id + ' · ' + problem.slice(3);
  const brute = require('./' + problem + '.js').brute;
  const fast = load(problem, USE_REFERENCE);

  describe(label, () => {
    test('brute force gives the right answers (sanity check)', () => {
      for (const c of spec.small) checkResult(spec.check, brute(...structuredClone(c.args)), c.expected, c.args);
    });

    const started = fast(...structuredClone(spec.small[0].args)) !== undefined;

    test('your fast() is correct on small and edge cases', { skip: !started && 'not started yet' }, () => {
      for (const c of spec.small) {
        const args = structuredClone(c.args);
        checkResult(spec.check, fast(...args), c.expected, c.args);
      }
    });

    test(`your fast() handles the large input in under ${TIME_LIMIT_MS} ms`, { skip: !started && 'not started yet', timeout: TIME_LIMIT_MS + 10000 }, async () => {
      const out = await runLarge(problem, USE_REFERENCE, TIME_LIMIT_MS);
      if (out.error) assert.fail(out.error);
      if (out.timedOut) {
        assert.fail(`Too slow: still running after ${TIME_LIMIT_MS} ms on the large input. ` +
          `It's probably O(n²) or worse. Look for a loop (or includes/slice/shift/split) inside a loop.`);
      }
      checkResult(spec.check, out.result, out.expected, spec.large().args);
    });
  });
}
