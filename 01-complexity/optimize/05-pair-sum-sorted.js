// =============================================================
//  O5 · Pair with target sum, sorted input             [MEDIUM]
// -------------------------------------------------------------
//  `sorted` is sorted ascending. Return [i, j] (i < j) with
//  sorted[i] + sorted[j] === target, or [-1, -1] if none.
//  If several pairs exist, any one is fine.
//    pairSumSorted([1, 3, 4, 6, 9], 10) → [0, 4] or [2, 3]
//  Constraint: length up to 200,000
// =============================================================

// Time:  O(    )   Space: O(    )
function brute(sorted, target) {
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i] + sorted[j] === target) return [i, j];
    }
  }
  return [-1, -1];
}

// Target: O(n) time AND O(1) space. (A Map gets O(n) time but costs O(n) space.
// The input being sorted is the clue that you can do better.)
// Time:  O(    )   Space: O(    )
function fast(sorted, target) {
  // Step 1: left at the start, right at the end
  // Step 2: while left < right:
  //           sum too small → which pointer moves, and why?
  //           sum too big   → which pointer moves, and why?
  //           equal         → return
  // Step 3: return [-1, -1]
}

module.exports = { brute, fast };
