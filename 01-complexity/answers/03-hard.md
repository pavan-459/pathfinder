# Answers: Hard

| # | Time | Space |
|---|---|---|
| H1 | O(2ⁿ) | O(n) |
| H2 | O(n) | O(n) |
| H3 | O(n · 2ⁿ) | O(n · 2ⁿ) |
| H4 | O(n log n) | O(n) |
| H5 | O(n · n!) | O(n · n!) with output, O(n) without |
| H6 | O(n + m) | O(1) |
| H7 | O(n log n) | O(1) |
| H8 | **O(n)** | **O(n)** |
| H9 | O(n³) | O(1) |

---

**H1 `fib`: O(2ⁿ) time, O(n) space**
fib(4) makes **9 calls**: fib(4), fib(3), fib(2), fib(1), fib(0), fib(1), fib(2), fib(1), fib(0). Each call branches into two, about n levels deep, so roughly 2ⁿ calls. (The exact growth is about 1.6ⁿ, but O(2ⁿ) is the accepted answer.)
Space is only O(n): at any moment, only one root-to-leaf path is on the stack, and the deepest path is n calls.
> "Time counts every call ever made. Space counts only the calls alive at the same moment."

**H2 `fibMemo`: O(n), O(n)**
Only n − 1 different values (2 … n) are ever computed. After that, each is a Map lookup. n subproblems × O(1) each = O(n).
Space: the memo holds n entries, and the recursion goes n deep. O(n) + O(n) = O(n).
This is the jump from O(2ⁿ) to O(n): exponential to linear just by not recomputing.

**H3 `subsets`: O(n · 2ⁿ), O(n · 2ⁿ)**
[1,2,3] → **8** subsets (2³). Each element is either in or out, so 2ⁿ subsets. Building each one copies up to n items, so n · 2ⁿ time. The output stores 2ⁿ arrays of average length n/2, so the space is O(n · 2ⁿ) too.
When the output itself is exponential, no algorithm can be faster than the size of the output.

**H4 `mergeSort`: O(n log n), O(n)**
n = 8 → **3 levels** of splitting (8 → 4 → 2 → 1). At every level, merging touches all **8** elements in total. 3 × 8 = n log n.
Space: the merge buffers and slices at one level add up to n; recursion depth is log n. O(n) overall.

**H5 `permutations`: O(n · n!), O(n · n!)**
[1,2,3] → **6**, 4 items → **24**, n items → **n!**. Each finished permutation is copied (`[...path]`, n items), so n · n!.
Without counting the output, the extra space is O(n): `used`, `path`, and recursion depth n.
n! explodes: 10! = 3,628,800 and 12! ≈ 479 million. That's why "n ≤ 10" in constraints hints at permutations.

**H6 `countSmallerSorted`: O(n + m), O(1)**
`j` is declared **outside** the for loop and never resets. Over the whole run, `j` moves at most m times in total, and `i` moves n times. Total n + m. This is the merge step of merge sort and the core of most two-pointer solutions.
If `let j = 0` were inside the for loop, it would be O(n · m).

**H7 `harmonicSteps`: O(n log n), O(1)**
Inner loop runs n/1 + n/2 + n/3 + … + n/n = n × (1 + 1/2 + … + 1/n). That bracket is the harmonic series, which grows like ln n. So O(n log n).
Check by running it: n = 1,000 → 7,069 steps (n ln n ≈ 6,908). n = 100,000 → 1,166,750 (n ln n ≈ 1,151,293).
This pattern appears in sieve-style loops ("for every i, visit its multiples").

**H8 `containsSlice`: O(n) time, O(n) space (not O(log n)!)**
There are only log n calls, but each one **slices**, copying half of the current array:
n/2 + n/4 + n/8 + … ≤ **n**. So copying costs O(n) time in total, which beats the O(log n) comparisons.
Space: the slices still alive along the recursion chain add up to n/2 + n/4 + … ≤ n → O(n), plus log n stack frames.
Fix: pass indices, not copies:
```js
function contains(sorted, target, lo = 0, hi = sorted.length - 1) {
  if (lo > hi) return false;
  const mid = (lo + hi) >> 1;
  if (sorted[mid] === target) return true;
  return sorted[mid] < target
    ? contains(sorted, target, mid + 1, hi)
    : contains(sorted, target, lo, mid - 1);
}
```
Now O(log n) time and O(log n) stack space (or O(1) with a loop, see M9).

**H9 `minRemoveBrute`: O(n³), O(1)**
About n²/2 (i, j) pairs, and `isSortedExcept` is O(n) for each one: n²/2 × n → O(n³). Only a few numbers are stored → O(1).
At n = 100,000: about 5 × 10¹⁴ steps (days). The O(n) version does at most 4n = 400,000 steps (instant).
That gap is why "optimise" was part of the feedback.
