// =============================================================
//  REFERENCE SOLUTIONS for 01-complexity/optimize
//  Only open this after `npm test` passes for a problem, or after
//  you've been stuck for 30+ minutes. Compare your approach and
//  complexity with these, then close it.
// =============================================================

module.exports = {
  // O(n) time, O(n) space: a Set remembers what we've seen
  '01-has-duplicate'(arr) {
    const seen = new Set();
    for (const x of arr) {
      if (seen.has(x)) return true;
      seen.add(x);
    }
    return false;
  },

  // O(a + b) time, O(b) space
  '02-count-common'(a, b) {
    const inB = new Set(b);
    let count = 0;
    for (const x of a) if (inB.has(x)) count++;
    return count;
  },

  // O(n + q) time, O(n) space for the prefix array
  '03-range-sums'(arr, queries) {
    const prefix = new Array(arr.length + 1).fill(0);
    for (let i = 0; i < arr.length; i++) prefix[i + 1] = prefix[i] + arr[i];
    return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
  },

  // O(n) time, O(1) space: add the one entering, subtract the one leaving
  '04-max-window-sum'(arr, k) {
    let sum = 0;
    for (let i = 0; i < k; i++) sum += arr[i];
    let best = sum;
    for (let r = k; r < arr.length; r++) {
      sum += arr[r] - arr[r - k];
      if (sum > best) best = sum;
    }
    return best;
  },

  // O(n) time, O(1) space: sorted input → two pointers from both ends
  '05-pair-sum-sorted'(sorted, target) {
    let left = 0, right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[left] + sorted[right];
      if (sum === target) return [left, right];
      if (sum < target) left++;   // need bigger → only moving left up can increase the sum
      else right--;               // need smaller → only moving right down can decrease it
    }
    return [-1, -1];
  },

  // O(n) time, O(k) space for k distinct characters
  '06-first-unique-char'(s) {
    const count = new Map();
    for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1);
    for (let i = 0; i < s.length; i++) if (count.get(s[i]) === 1) return i;
    return -1;
  },

  // O(n) time, O(n) space: prefix sum + Map of how often each prefix has appeared
  '07-subarray-sum-k'(nums, k) {
    const seen = new Map([[0, 1]]); // the empty prefix, so subarrays starting at 0 count
    let sum = 0, count = 0;
    for (const x of nums) {
      sum += x;
      count += seen.get(sum - k) || 0;
      seen.set(sum, (seen.get(sum) || 0) + 1);
    }
    return count;
  },

  // O(n) time, O(n) space: each index is pushed once and popped at most once → ≤ 2n stack ops
  '08-next-greater'(nums) {
    const out = new Array(nums.length).fill(-1);
    const stack = [];
    for (let i = 0; i < nums.length; i++) {
      while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
        out[stack.pop()] = nums[i];
      }
      stack.push(i);
    }
    return out;
  },

  // O(n) time, O(1) space: sorted prefix + sorted suffix, join with two pointers
  '09-min-remove-to-sort'(arr) {
    const n = arr.length;
    let left = 0;
    while (left + 1 < n && arr[left] <= arr[left + 1]) left++;
    if (left >= n - 1) return 0;
    let right = n - 1;
    while (right > 0 && arr[right - 1] <= arr[right]) right--;
    let ans = Math.min(n - left - 1, right);
    let i = 0, j = right;
    while (i <= left && j < n) {
      if (arr[i] <= arr[j]) { ans = Math.min(ans, j - i - 1); i++; }
      else j++;
    }
    return ans;
  },
};
