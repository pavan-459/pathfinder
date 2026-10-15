// =============================================================
//  O3 · Range sum queries                          [EASY–MEDIUM]
// -------------------------------------------------------------
//  Given `arr` and a list of queries [l, r], return the sum of
//  arr[l..r] (inclusive) for each query.
//    rangeSums([2, 4, 6, 8], [[0, 1], [1, 3], [2, 2]]) → [6, 18, 6]
//  Constraint: arr.length up to 100,000, queries up to 100,000
// =============================================================

// Time:  O(    )   Space: O(    )   (use n for arr, q for queries)
function brute(arr, queries) {
  return queries.map(([l, r]) => {
    let sum = 0;
    for (let i = l; i <= r; i++) sum += arr[i];
    return sum;
  });
}

// Target: O(n + q) time.
// Hint: prefix[i] = sum of arr[0..i-1], so sum(l..r) = prefix[r + 1] - prefix[l]
// Time:  O(    )   Space: O(    )
function fast(arr, queries) {
  // Step 1: build prefix of length arr.length + 1, prefix[0] = 0
  // Step 2: answer each query with one subtraction
}

module.exports = { brute, fast };
