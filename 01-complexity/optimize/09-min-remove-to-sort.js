// =============================================================
//  O9 · Shortest subarray to remove so the rest is sorted [HARD]
//       (The ServiceNow problem, LeetCode 1574)
// -------------------------------------------------------------
//  Remove one contiguous subarray (possibly empty) so the remaining
//  elements are non-decreasing. Return the minimum length removed.
//    minRemove([1, 2, 3, 10, 4, 2, 3, 5]) → 3   (remove [10, 4, 2])
//    minRemove([5, 4, 3, 2, 1])           → 4
//    minRemove([1, 2, 3])                 → 0
//  Constraint: length up to 100,000
// =============================================================

// Time:  O(    )   Space: O(    )
function brute(arr) {
  const n = arr.length;
  const sortedWithout = (i, j) => {
    let prev = -Infinity;
    for (let k = 0; k < n; k++) {
      if (k >= i && k <= j) continue;
      if (arr[k] < prev) return false;
      prev = arr[k];
    }
    return true;
  };
  if (sortedWithout(-1, -1)) return 0;
  let best = n;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (sortedWithout(i, j)) best = Math.min(best, j - i + 1);
    }
  }
  return best;
}

// Target: O(n) time, O(1) space. Try it WITHOUT looking at the guide's section 6 first.
// Time:  O(    )   Space: O(    )
function fast(arr) {
  // Step 1: left = end of the sorted prefix. If it reaches the end → return 0
  // Step 2: right = start of the sorted suffix
  // Step 3: answer so far = min(remove everything after the prefix, remove everything before the suffix)
  // Step 4: two pointers i (in prefix) and j (in suffix):
  //           if arr[i] <= arr[j] → they can join; removed = j - i - 1; move i
  //           else                → move j to find a bigger value
  // Step 5: return the answer
}

module.exports = { brute, fast };
