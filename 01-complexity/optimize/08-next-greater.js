// =============================================================
//  O8 · Next greater element                             [HARD]
// -------------------------------------------------------------
//  For each element, find the first element to its RIGHT that is
//  strictly greater. Use -1 if there isn't one.
//    nextGreater([2, 1, 3, 2, 5]) → [3, 3, 5, 5, -1]
//  Constraint: length up to 100,000
// =============================================================

// Time:  O(    )   Space: O(    )   (not counting the output)
// What input makes this the slowest?
function brute(nums) {
  const out = new Array(nums.length).fill(-1);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] > nums[i]) { out[i] = nums[j]; break; }
    }
  }
  return out;
}

// Target: O(n) with a monotonic stack.
// Keep a stack of INDEXES still waiting for their next greater element.
// Their values are decreasing from bottom to top. Why?
// Time:  O(    )   Space: O(    )
// (Each index is pushed once and popped at most once. What does that make the total?)
function fast(nums) {
  // Step 1: out = array of -1s, stack = []
  // Step 2: for each i:
  //           while stack not empty AND nums[i] > nums[top of stack]:
  //             pop the top index; its answer is nums[i]
  //           push i
  // Step 3: return out (anything left on the stack keeps -1)
}

module.exports = { brute, fast };
