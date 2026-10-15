// =============================================================
//  O7 · Count subarrays that sum to k               [MEDIUM–HARD]
// -------------------------------------------------------------
//  Count contiguous subarrays whose sum equals k.
//  Values can be NEGATIVE, so sliding window doesn't work.
//    countSubarrays([1, 1, 1], 2)  → 2
//    countSubarrays([1, -1, 0], 0) → 3
//  Constraint: length up to 50,000
// =============================================================

// Time:  O(    )   Space: O(    )
function brute(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}

// Target: O(n) time.
// Idea: if the running sum is S now, and earlier it was S - k, the part in between sums to k.
// So: how many times have I seen the running sum (S - k) before?
// Time:  O(    )   Space: O(    )
function fast(nums, k) {
  // Step 1: a Map from running-sum → how many times seen. Start with {0: 1}. Why 0?
  // Step 2: for each num: add to running sum, add map.get(sum - k) to the count,
  //         then record the current sum in the map
  // Step 3: return count
}

module.exports = { brute, fast };
