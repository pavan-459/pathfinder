// Test cases for the optimize problems. You don't need to edit this file.
// Each problem has small correctness cases and a `large(n)` generator whose
// answer is known, so we can check speed without needing a reference solution.

const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);

module.exports = {
  '01-has-duplicate': {
    check: 'equal',
    small: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3]], expected: false },
      { args: [[]], expected: false },
      { args: [[7]], expected: false },
      { args: [[5, 5]], expected: true },
      { args: [[-1, 0, 1, -1]], expected: true },
    ],
    large: (n = 200000) => ({ args: [range(0, n)], expected: false }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '02-count-common': {
    check: 'equal',
    small: [
      { args: [[1, 2, 2, 5], [2, 3, 5]], expected: 3 },
      { args: [[], [1, 2]], expected: 0 },
      { args: [[1, 2], []], expected: 0 },
      { args: [[4, 4, 4], [4]], expected: 3 },
      { args: [[1, 2, 3], [4, 5, 6]], expected: 0 },
    ],
    large: (n = 100000) => ({ args: [range(0, n), range(n / 2, n / 2 + n)], expected: n / 2 }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '03-range-sums': {
    check: 'deepEqual',
    small: [
      { args: [[2, 4, 6, 8], [[0, 1], [1, 3], [2, 2]]], expected: [6, 18, 6] },
      { args: [[5], [[0, 0]]], expected: [5] },
      { args: [[1, -2, 3], [[0, 2], [1, 1]]], expected: [2, -2] },
      { args: [[1, 2, 3], []], expected: [] },
    ],
    large: (n = 100000) => ({
      args: [new Array(n).fill(1), range(0, n).map(i => [i, n - 1])],
      expected: range(0, n).map(i => n - i),
    }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '04-max-window-sum': {
    check: 'equal',
    small: [
      { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
      { args: [[4], 1], expected: 4 },
      { args: [[-3, -1, -2], 2], expected: -3 },
      { args: [[1, 2, 3], 3], expected: 6 },
      { args: [[5, -10, 6, 7], 2], expected: 13 },
    ],
    large: (n = 200000) => ({ args: [new Array(n).fill(1), n / 2], expected: n / 2 }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
    benchArgs: n => [new Array(n).fill(1), n / 2],
  },
  '05-pair-sum-sorted': {
    check: 'pair',
    small: [
      { args: [[1, 3, 4, 6, 9], 10], expected: 'any' },
      { args: [[2, 7, 11, 15], 9], expected: 'any' },
      { args: [[1, 2, 3], 100], expected: [-1, -1] },
      { args: [[], 5], expected: [-1, -1] },
      { args: [[5], 10], expected: [-1, -1] },
      { args: [[-4, -1, 0, 3, 8], -1], expected: 'any' },
      { args: [[3, 3], 6], expected: 'any' },
    ],
    // all even numbers can never sum to an odd target → no pair, worst case for brute
    large: (n = 200000) => ({ args: [range(0, n).map(i => i * 2), 1], expected: [-1, -1] }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '06-first-unique-char': {
    check: 'equal',
    small: [
      { args: ['leetcode'], expected: 0 },
      { args: ['loveleetcode'], expected: 2 },
      { args: ['aabb'], expected: -1 },
      { args: [''], expected: -1 },
      { args: ['z'], expected: 0 },
      { args: ['aabbc'], expected: 4 },
    ],
    large: (n = 100000) => ({ args: ['ab'.repeat(n / 2) + 'c'], expected: n }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '07-subarray-sum-k': {
    check: 'equal',
    small: [
      { args: [[1, 1, 1], 2], expected: 2 },
      { args: [[1, -1, 0], 0], expected: 3 },
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[], 0], expected: 0 },
      { args: [[3], 3], expected: 1 },
      { args: [[-1, -1, 1], 0], expected: 1 },
    ],
    // alternating 1, -1, k = 0: prefix sums are 0,1,0,1,... count equal pairs
    large: (n = 50000) => {
      const zeros = n / 2 + 1, ones = n / 2;
      return {
        args: [range(0, n).map(i => (i % 2 === 0 ? 1 : -1)), 0],
        expected: (zeros * (zeros - 1)) / 2 + (ones * (ones - 1)) / 2,
      };
    },
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '08-next-greater': {
    check: 'deepEqual',
    small: [
      { args: [[2, 1, 3, 2, 5]], expected: [3, 3, 5, 5, -1] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [-1] },
      { args: [[3, 3, 3]], expected: [-1, -1, -1] },
      { args: [[1, 2, 3]], expected: [2, 3, -1] },
      { args: [[4, 1, 2, 5]], expected: [5, 2, 5, -1] },
    ],
    // strictly decreasing → nobody has a greater element; brute scans to the end every time
    large: (n = 100000) => ({ args: [range(0, n).map(i => n - i)], expected: new Array(n).fill(-1) }),
    benchSizes: [1000, 2000, 4000, 8000, 16000],
  },
  '09-min-remove-to-sort': {
    check: 'equal',
    small: [
      { args: [[1, 2, 3, 10, 4, 2, 3, 5]], expected: 3 },
      { args: [[5, 4, 3, 2, 1]], expected: 4 },
      { args: [[1, 2, 3]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[1, 2, 6, 4, 5, 7]], expected: 1 },
      { args: [[1, 2, 3, 10, 2, 3, 4, 5]], expected: 2 },
      { args: [[2, 2, 2, 1, 1, 1]], expected: 3 },
    ],
    // [1..m, 1..m]: best is keep [1..t] + [t..m] from the second half → remove m - 1
    large: (n = 100000) => {
      const m = n / 2;
      const half = range(1, m + 1);
      return { args: [[...half, ...half]], expected: m - 1 };
    },
    benchSizes: [100, 200, 400, 800],
  },
};
