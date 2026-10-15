# Answers: Medium

| # | Time | Space |
|---|---|---|
| M1 | O(a · b) | O(1) |
| M2 | O(log n) | O(1) |
| M3 | O(n log n) | O(1) |
| M4 | O(n²) | O(1) |
| M5 | O(n log n) | O(n) |
| M6 | O(n) | O(min(n, alphabet size)) |
| M7 | O(n²) | O(n) |
| M8 | O(n²) | O(n) |
| M9 | O(log n) | O(1) |
| M10 | O(n) | **O(n)** |
| M11 | **O(n²)** | O(n) |

---

**M1 `countCommon`: O(a · b), O(1)**
`b.includes(x)` is a hidden loop over b, and it runs once per element of a.
Faster version:
```js
function countCommon(a, b) {
  const setB = new Set(b);          // O(b) time, O(b) space
  let count = 0;
  for (const x of a) if (setB.has(x)) count++;   // O(a), each has() is O(1)
  return count;
}
```
→ **O(a + b) time, O(b) space.** Classic trade: spend memory to save time.

**M2 `countHalvings`: O(log n), O(1)**
32 → 16 → 8 → 4 → 2 → 1: **5 steps**, and log₂ 32 = 5. Each step cuts the remaining work in half.

**M3 `countPowerPairs`: O(n log n), O(1)**
Outer loop: n. Inner loop: j = 1, 2, 4, 8, … < n, about log₂ n steps. They're nested, so multiply: n · log n. For n = 8: 8 × 3 = 24 (run it to check).

**M4 `hasDuplicate`: O(n²), O(1)**
n = 5 with no duplicates: 4 + 3 + 2 + 1 = **10** comparisons = n(n−1)/2. That's about n²/2 → O(n²). Worst case is when there's no duplicate, so it never returns early.

**M5 `hasDuplicateSorted`: O(n log n), O(n)**
`[...arr]` copies (O(n) time and space). `sort` is O(n log n). The final loop is O(n). The biggest is O(n log n).
Space O(n) from the copy (V8's sort also uses up to O(n) extra). If you're allowed to sort the input in place, the copy goes away. Mention the trade-off: it mutates the caller's array.

**M6 `longestUniqueRun`: O(n), O(min(n, alphabet))**
A `while` inside a `for`, but `left` **never resets**. It only moves forward and can't pass `right`. Over the whole run:
- `right` moves n times
- `left` moves at most n times
- total ≤ 2n → O(n). (Rule 7)

The Set holds at most one copy of each character in the current window: at most n, and at most the alphabet size (e.g. 26 or 128).

**M7 `drainQueue`: O(n²), O(n)**
`shift()` removes the first element and moves every other element down one slot: O(current length). Over the whole loop: n + (n−1) + … + 1 ≈ n²/2.
Space O(n) is the `[...items]` copy.
Fix: don't remove, just move an index:
```js
let head = 0;
while (head < queue.length) total += queue[head++];   // O(n)
```
This matters for BFS in JavaScript: use a head index, not `shift()`, on big inputs.

**M8 `prefixSumsSlow`: O(n²), O(n)**
At step i, `slice(0, i+1)` copies i+1 items and `reduce` adds them: 1 + 2 + … + n ≈ n²/2.
Each slice is up to n long → O(n) extra at a time.
This is exactly the "recomputing the same sum" pattern. The prefix-sum fix:
```js
let running = 0;
for (const x of arr) { running += x; out.push(running); }   // O(n), O(1) extra
```

**M9 `binarySearch`: O(log n), O(1)**
Each step throws away half the range. n = 1,000,000 → about 20 steps. Only `lo`, `hi`, `mid` are stored.

**M10 `sumRecursive`: O(n) time, O(n) space**
n + 1 calls, O(1) work each. **No arrays, but space is still O(n)**: when the last call runs, n calls are waiting on the stack. On a very large array this throws "Maximum call stack size exceeded". A loop does the same in O(1) space.

**M11 `doubleAll`: O(n²), O(n)**
`[...acc, x * 2]` copies the whole accumulator every step: 0 + 1 + 2 + … + (n−1) ≈ n²/2 copies.
At any moment the live array is up to n long → O(n) space (plus lots of short-lived garbage).
Fix: `arr.map(x => x * 2)`, or `acc.push(x * 2); return acc;`. Both are O(n).
This pattern shows up in real React/Redux code too, so it's worth spotting.
