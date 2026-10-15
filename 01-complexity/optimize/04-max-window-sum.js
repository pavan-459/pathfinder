// =============================================================
//  O4 · Max sum of a window of size k                  [MEDIUM]
// -------------------------------------------------------------
//  Return the largest sum of any k consecutive elements.
//    maxWindowSum([2, 1, 5, 1, 3, 2], 3) → 9   (5 + 1 + 3)
//  Constraint: 1 ≤ k ≤ arr.length ≤ 200,000
// =============================================================

// Time:  O(    )   Space: O(    )   (use n and k)
function brute(arr, k) {
  let best = -Infinity;
  for (let start = 0; start + k <= arr.length; start++) {
    let sum = 0;
    for (let i = start; i < start + k; i++) sum += arr[i];
    best = Math.max(best, sum);
  }
  return best;
}

// Target: O(n) time, O(1) space.
// When the window slides right by one, which ONE element enters and which ONE leaves?
// Time:  O(    )   Space: O(    )
function fast(arr, k) {
  // Step 1: sum the first k elements
  // Step 2: slide: for each new index r from k to end, add arr[r], subtract arr[r - k]
  // Step 3: track the best sum
}

module.exports = { brute, fast };
