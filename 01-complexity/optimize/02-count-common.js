// =============================================================
//  O2 · Count common values                             [EASY]
// -------------------------------------------------------------
//  Count how many elements of `a` also appear in `b`.
//  (Count every element of a, including repeats.)
//    countCommon([1, 2, 2, 5], [2, 3, 5]) → 3   (2, 2, 5)
//  Constraint: a.length and b.length up to 100,000
// =============================================================

// Time:  O(    )   Space: O(    )
function brute(a, b) {
  let count = 0;
  for (const x of a) {
    if (b.includes(x)) count++;
  }
  return count;
}

// Target: O(a + b) time. What does it cost in space?
// Time:  O(    )   Space: O(    )
function fast(a, b) {
  // Step 1: put b into a structure with O(1) lookups
  // Step 2: loop over a, count the ones that are in it
}

module.exports = { brute, fast };
