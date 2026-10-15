const assert = require('node:assert/strict');

function checkResult(kind, result, expected, args) {
  if (kind === 'equal') return assert.equal(result, expected);
  if (kind === 'deepEqual') return assert.deepEqual(result, expected);
  if (kind === 'pair') {
    const [sorted, target] = args;
    if (Array.isArray(expected)) return assert.deepEqual(result, expected);
    assert.ok(Array.isArray(result) && result.length === 2, 'should return [i, j]');
    const [i, j] = result;
    assert.ok(i >= 0 && i < j && j < sorted.length, `indexes ${i}, ${j} are not a valid i < j pair`);
    assert.equal(sorted[i] + sorted[j], target, `sorted[${i}] + sorted[${j}] is not ${target}`);
  }
}

module.exports = { checkResult };
