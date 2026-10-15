// =============================================================
//  O1 · Has duplicate                                   [EASY]
// -------------------------------------------------------------
//  Return true if any value appears at least twice in `arr`.
//    hasDuplicate([1, 2, 3, 1]) → true
//    hasDuplicate([1, 2, 3])    → false
//  Constraint: arr.length up to 200,000
// =============================================================

// Brute force (given). Read it and fill in its complexity.
// Time:  O(    )   Space: O(    )
function brute(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// Your version. Target: O(n) time.
// What is the brute force re-searching each time? ___________________
// Time:  O(    )   Space: O(    )
function fast(arr) {
  // Step 1: make something that remembers values you've already seen
  // Step 2: for each value, if you've seen it → return true, else remember it
  // Step 3: return false
}

module.exports = { brute, fast };
