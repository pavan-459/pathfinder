// =============================================================
//  O6 · First unique character                         [MEDIUM]
// -------------------------------------------------------------
//  Return the index of the first character that appears exactly
//  once in s, or -1.
//    firstUnique("leetcode")     → 0
//    firstUnique("loveleetcode") → 2
//    firstUnique("aabb")         → -1
//  Constraint: s.length up to 100,000
// =============================================================

// Time:  O(    )   Space: O(    )
// (Hint: split creates an array. How big, and how often?)
function brute(s) {
  for (let i = 0; i < s.length; i++) {
    const occurrences = s.split(s[i]).length - 1;
    if (occurrences === 1) return i;
  }
  return -1;
}

// Target: O(n) time. Two passes is fine (O(2n) = O(n)).
// Time:  O(    )   Space: O(    )
function fast(s) {
  // Pass 1: count every character
  // Pass 2: go left to right, return the first index whose count is 1
}

module.exports = { brute, fast };
