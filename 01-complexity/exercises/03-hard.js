// =============================================================
//  Complexity: HARD (9 exercises)
//  Guide sections: 3 (rules 7–8), 5 (recursion space), 6
// -------------------------------------------------------------
//  Draw the recursion tree or trace table for each one.
//  For recursion: Time = number of calls × work per call.
//                 Space = deepest chain of calls alive at once (+ data).
// =============================================================


// H1 ----------------------------------------------------------
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// Draw the call tree for fib(4). How many calls in total? ____
// Time:  O(    )
// Space: O(    )   (Careful: time counts ALL calls; space counts calls alive at the same time.)
// Why:


// H2 ----------------------------------------------------------
function fibMemo(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, v);
  return v;
}
// Time:  O(    )
// Space: O(    )
// Why:   (How many DIFFERENT values of n ever get computed?)


// H3 ----------------------------------------------------------
function subsets(nums) {
  const result = [[]];
  for (const x of nums) {
    const size = result.length;
    for (let i = 0; i < size; i++) {
      result.push([...result[i], x]);
    }
  }
  return result;
}
// Trace nums = [1, 2, 3]: how many subsets at the end? ____  How long is the longest? ____
// Time:  O(    )
// Space: O(    )   (here the output IS the point, so count it)
// Why:


// H4 ----------------------------------------------------------
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
// How many levels of splitting for n = 8? ____  Work per level? ____
// Time:  O(    )
// Space: O(    )
// Why:


// H5 ----------------------------------------------------------
function permutations(nums) {
  const result = [];
  const used = new Array(nums.length).fill(false);
  const path = [];
  function go() {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      go();
      path.pop(); used[i] = false;
    }
  }
  go();
  return result;
}
// How many permutations of [1,2,3]? ____  of 4 items? ____  of n? ____
// Time:  O(    )
// Space: O(    )   (with the output / without the output)
// Why:


// H6 ----------------------------------------------------------
// a and b are both sorted. For each a[i], count how many b values are smaller.
function countSmallerSorted(a, b) {
  const out = [];
  let j = 0;
  for (let i = 0; i < a.length; i++) {
    while (j < b.length && b[j] < a[i]) j++;
    out.push(j);
  }
  return out;
}
// Time:  O(    )   (Hint: where is j declared? Does it reset?)
// Space: O(    )   (not counting `out`)
// Why:


// H7 ----------------------------------------------------------
function harmonicSteps(n) {
  let steps = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j += i) {
      steps++;
    }
  }
  return steps;
}
// For i = 1 the inner loop runs n times. For i = 2? i = 3? i = n?
// Total = n/1 + n/2 + n/3 + ... + n/n = n × (1 + 1/2 + 1/3 + ... + 1/n)
// Time:  O(    )   (Hint: 1 + 1/2 + 1/3 + ... + 1/n grows like log n.)
// Space: O(    )
// Why:


// H8 ----------------------------------------------------------
function containsSlice(sorted, target) {
  if (sorted.length === 0) return false;
  const mid = sorted.length >> 1;
  if (sorted[mid] === target) return true;
  if (sorted[mid] < target) return containsSlice(sorted.slice(mid + 1), target);
  return containsSlice(sorted.slice(0, mid), target);
}
// It's binary search, so O(log n)... right?
// Add up the cost of the slices: n/2 + n/4 + n/8 + ... = ____
// Time:  O(    )
// Space: O(    )
// Why:
// Then: how would you fix it to get real O(log n)?


// H9 ----------------------------------------------------------
// Brute force for the ServiceNow problem: try removing every [i..j].
function minRemoveBrute(arr) {
  const n = arr.length;
  if (isSortedExcept(arr, -1, -1)) return 0;
  let best = n;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (isSortedExcept(arr, i, j)) best = Math.min(best, j - i + 1);
    }
  }
  return best;
}
function isSortedExcept(arr, i, j) {
  let prev = -Infinity;
  for (let k = 0; k < arr.length; k++) {
    if (k >= i && k <= j) continue;
    if (arr[k] < prev) return false;
    prev = arr[k];
  }
  return true;
}
// Time:  O(    )
// Space: O(    )
// Why:
// Compare with the O(n) version in the guide, section 6. At n = 100,000, how many steps is each?


module.exports = {
  fib, fibMemo, subsets, mergeSort, permutations,
  countSmallerSorted, harmonicSteps, containsSlice, minRemoveBrute,
};
