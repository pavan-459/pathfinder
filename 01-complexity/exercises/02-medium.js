// =============================================================
//  Complexity: MEDIUM (11 exercises)
//  Guide sections: 3 (rules 3–8), 4 (JS built-ins), 5 (space)
// -------------------------------------------------------------
//  These have hidden costs. Look for:
//    - built-in methods that are secretly loops
//    - loops that halve or double
//    - inner pointers that never reset
//    - recursion using the call stack
//  Trace with a small n before answering.
// =============================================================


// M1 ----------------------------------------------------------
function countCommon(a, b) {
  let count = 0;
  for (const x of a) {
    if (b.includes(x)) count++;
  }
  return count;
}
// Time:  O(    )
// Space: O(    )
// Why:
// Then: rewrite it to be faster. What does that cost in space?


// M2 ----------------------------------------------------------
function countHalvings(n) {
  let steps = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }
  return steps;
}
// Trace n = 32:  32 → __ → __ → __ → __ → __   steps = __
// Time:  O(    )
// Space: O(    )
// Why:


// M3 ----------------------------------------------------------
function countPowerPairs(n) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j *= 2) {
      count++;
    }
  }
  return count;
}
// Time:  O(    )
// Space: O(    )
// Why:


// M4 ----------------------------------------------------------
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
// Trace n = 5 (no duplicates): how many comparisons in total? ____
// Time:  O(    )   (worst case)
// Space: O(    )
// Why:


// M5 ----------------------------------------------------------
function hasDuplicateSorted(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) return true;
  }
  return false;
}
// Time:  O(    )
// Space: O(    )
// Why:   (Two things allocate or cost here: the spread and the sort.)


// M6 ----------------------------------------------------------
function longestUniqueRun(s) {
  const seen = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
// Time:  O(    )   (Hint: a while inside a for. Does `left` ever reset?)
// Space: O(    )
// Why:


// M7 ----------------------------------------------------------
function drainQueue(items) {
  const queue = [...items];
  let total = 0;
  while (queue.length > 0) {
    total += queue.shift();
  }
  return total;
}
// Time:  O(    )   (Hint: what does shift() do to every other element?)
// Space: O(    )
// Why:
// Then: how would you fix it without changing the result?


// M8 ----------------------------------------------------------
function prefixSumsSlow(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr.slice(0, i + 1).reduce((a, b) => a + b, 0));
  }
  return out;
}
// Time:  O(    )
// Space: O(    )   (not counting `out`)
// Why:


// M9 ----------------------------------------------------------
function binarySearch(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
// Time:  O(    )
// Space: O(    )
// Why:


// M10 ---------------------------------------------------------
function sumRecursive(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + sumRecursive(arr, i + 1);
}
// Time:  O(    )
// Space: O(    )   (Hint: no arrays are created. Is it O(1)?)
// Why:


// M11 ---------------------------------------------------------
function doubleAll(arr) {
  return arr.reduce((acc, x) => [...acc, x * 2], []);
}
// Time:  O(    )   (Hint: how long is `acc` on the 1st step? the 500th?)
// Space: O(    )
// Why:


module.exports = {
  countCommon, countHalvings, countPowerPairs, hasDuplicate, hasDuplicateSorted,
  longestUniqueRun, drainQueue, prefixSumsSlow, binarySearch, sumRecursive, doubleAll,
};
