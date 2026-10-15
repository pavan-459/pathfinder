# Time and Space Complexity

This is the first module of the roadmap. The ServiceNow feedback was "understand time and space complexity in depth, and optimisation". This guide covers both, in the order you'll use them in an interview:

1. [What Big O actually measures](#1-what-big-o-actually-measures)
2. [The growth ladder, and reading constraints](#2-the-growth-ladder)
3. [Eight rules for working out time complexity](#3-eight-rules-for-time-complexity)
4. [What JavaScript built-ins really cost](#4-what-javascript-built-ins-really-cost)
5. [Space complexity](#5-space-complexity)
6. [Worked example: the ServiceNow problem](#6-worked-example-the-servicenow-problem)
7. [The optimisation playbook](#7-the-optimisation-playbook)
8. [How to say it out loud](#8-how-to-say-it-out-loud)
9. [Practice plan](#9-practice-plan)

Read one section, then do its exercises in [`exercises/`](./exercises). Don't read the [`answers/`](./answers) until you've written your own answer down.

---

## 1. What Big O actually measures

Big O answers one question: **when the input gets bigger, how fast does the work grow?**

It does not measure seconds. Seconds depend on your laptop. Big O counts **steps** and only cares about the shape of the growth.

Count the steps in this function by hand:

```js
function sum(arr) {
  let total = 0;                         // 1 step
  for (let i = 0; i < arr.length; i++) { // loop runs n times
    total += arr[i];                     // 1 step each time → n steps
  }
  return total;                          // 1 step
}
```

Total = `n + 2` steps. Now trace it for bigger inputs:

| n | steps (n + 2) | the "+2" as % of total |
|---|---|---|
| 10 | 12 | 17% |
| 1,000 | 1,002 | 0.2% |
| 1,000,000 | 1,000,002 | 0.0002% |

As n grows, the `+2` stops mattering. Only the `n` part decides how slow it gets. So we write **O(n)**.

That's why we drop constants and smaller terms:

- `n + 2` → O(n)
- `3n` → O(n). Three passes over the array is still linear: double n and the work doubles.
- `n² + 5n + 100` → O(n²). At n = 1,000 the n² part is 1,000,000 and 5n is only 5,000.

> **Rule of thumb:** Big O is "what happens to the work if I multiply n by 10?" O(n): 10× more. O(n²): 100× more. O(log n): only adds about 3.3 steps.

### Worst case, unless said otherwise

When an interviewer asks for "the complexity", they mean the **worst case**. `arr.indexOf(x)` might find x at index 0 (1 step), but in the worst case it isn't there and you check all n. So it's O(n).

The one common exception is hash maps (`Map`, `Set`, objects). Their lookups are O(1) **on average**, and everyone uses the average. You can add "average" when you say it: "O(1) average lookup".

---

## 2. The growth ladder

From fastest to slowest. Learn this order by heart.

| Big O | Name | Typical code | n = 10 | n = 1,000 | n = 100,000 |
|---|---|---|---|---|---|
| O(1) | constant | `arr[i]`, `map.get(k)` | 1 | 1 | 1 |
| O(log n) | logarithmic | binary search, halving loop | 3 | 10 | 17 |
| O(n) | linear | one loop | 10 | 1,000 | 100,000 |
| O(n log n) | linearithmic | good sorting, merge sort | 33 | ~10,000 | ~1,700,000 |
| O(n²) | quadratic | loop inside a loop | 100 | 1,000,000 | 10,000,000,000 |
| O(2ⁿ) | exponential | all subsets, naive recursion | 1,024 | too big | too big |
| O(n!) | factorial | all orderings | 3,628,800 | too big | too big |

Look at the n = 100,000 column. That's a normal LeetCode input size. O(n) is 100,000 steps and runs instantly. O(n²) is 10 billion steps and times out.

### Reading the constraints

A computer does very roughly **10⁷ to 10⁸ simple steps per second** in JavaScript. LeetCode problems print the input size limit, and that tells you which complexity they expect:

| If n is at most… | You can afford about… | Usually means… |
|---|---|---|
| 10 | O(n!) | try every ordering |
| 20 | O(2ⁿ) | try every subset, backtracking |
| 500 | O(n³) | three nested loops |
| 5,000 | O(n²) | two nested loops is fine |
| 100,000 to 1,000,000 | O(n log n) or O(n) | sort, or one pass with a Map / two pointers / sliding window |
| more than that | O(log n) or O(1) | binary search, or a formula |

**Use this in interviews.** Ask "how big can the array be?" If they say up to 10⁵, say: "then O(n²) is about 10 billion steps, too slow, so I'm aiming for O(n) or O(n log n)." That one sentence shows exactly the complexity awareness the ServiceNow interviewer asked for.

---

## 3. Eight rules for time complexity

### Rule 1: Steps one after another → add, keep the biggest

```js
function stats(arr) {
  let sum = 0;
  for (const x of arr) sum += x;              // n
  let max = -Infinity;
  for (const x of arr) max = Math.max(max, x); // n
  arr.sort((a, b) => a - b);                   // n log n
  return [sum, max, arr[0]];
}
```

`n + n + n log n`, and the biggest is **O(n log n)**.

This was your interview question: three separate passes is `n + n + n = 3n`, which is **O(n)**. Separate loops add. They don't multiply.

### Rule 2: A loop inside a loop → multiply

```js
for (let i = 0; i < n; i++) {     // n times
  for (let j = 0; j < n; j++) {   //   n times, for each i
    // O(1) work
  }
}
```

n × n = **O(n²)**.

Only multiply when the inner loop depends on the input. This is still O(n):

```js
for (let i = 0; i < n; i++) {
  for (let d = 0; d < 4; d++) {   // always 4 (e.g. up/down/left/right)
    // O(1)
  }
}
```

n × 4 = 4n = **O(n)**.

### Rule 3: An inner loop that starts at i + 1 is still O(n²)

```js
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    // compare arr[i] and arr[j]
  }
}
```

Trace it with n = 5:

| i | j values | inner steps |
|---|---|---|
| 0 | 1, 2, 3, 4 | 4 |
| 1 | 2, 3, 4 | 3 |
| 2 | 3, 4 | 2 |
| 3 | 4 | 1 |
| 4 | none | 0 |

Total = 4 + 3 + 2 + 1 = 10 = n(n − 1)/2. That's about n²/2, and halves are constants, so **O(n²)**. This "every pair" loop is exactly what your first attempt at the ServiceNow problem did.

### Rule 4: Halving (or doubling) each step → O(log n)

```js
let x = n;
let steps = 0;
while (x > 1) {
  x = Math.floor(x / 2);
  steps++;
}
```

Trace with n = 16: 16 → 8 → 4 → 2 → 1. That's **4 steps**, and log₂(16) = 4.

log₂ n means "how many times can I halve n before reaching 1". For n = 1,000,000 that's only about 20. That's why binary search is so fast.

The same applies when the loop variable doubles:

```js
for (let j = 1; j < n; j *= 2) { /* O(1) */ }   // O(log n)
```

And put inside an O(n) loop:

```js
for (let i = 0; i < n; i++) {           // n
  for (let j = 1; j < n; j *= 2) {}     //   × log n
}
```

That's **O(n log n)**.

### Rule 5: Two different inputs get two different letters

```js
function common(a, b) {
  for (const x of a) {          // a.length times
    if (b.includes(x)) { }      //   b.length each time
  }
}
```

This is **O(a × b)**, often written O(n · m). Don't call it O(n²) unless the two arrays are the same size. And if the loops are one after the other instead of nested, it's **O(n + m)**.

### Rule 6: Built-in methods are loops too

`b.includes(x)` above looks like one line, but inside it is a loop over b. **Every built-in that searches, copies or shifts an array is O(n).** This is the most common hidden cost in JavaScript. The full table is in [section 4](#4-what-javascript-built-ins-really-cost).

### Rule 7: Count total pointer moves, not loop nesting (amortised analysis)

This one trips people up. A `while` inside a `for` **looks** like O(n²):

```js
let left = 0;
for (let right = 0; right < n; right++) {
  while (/* window is invalid */) {
    left++;
  }
}
```

But ask how many times `left++` can run **in total, over the whole program**. `left` only ever moves forward and can't go past n, so at most n times in total, not n times per `right`.

- `right` moves n times in total
- `left` moves at most n times in total
- total work ≤ 2n → **O(n)**

That's why sliding window and two pointers are O(n). When you see nested loops, check whether the inner variable is **reset** each time (like `j = 0` or `j = i + 1`, which gives O(n²)) or **keeps going** from where it stopped (often O(n) total).

The same idea explains why `arr.push()` is O(1). Sometimes the array has to grow and copy everything, but that happens rarely enough that the average cost per push is constant. That's called **amortised O(1)**.

### Rule 8: Recursion = number of calls × work per call

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

Draw the call tree for fib(5):

```
                    fib(5)
              /              \
          fib(4)             fib(3)
         /      \            /     \
     fib(3)    fib(2)    fib(2)   fib(1)
     /    \     /   \     /   \
 fib(2) fib(1) f(1) f(0) f(1) f(0)
  /  \
f(1) f(0)
```

Each call makes two more calls, so the tree roughly doubles at every level, and there are about n levels. That gives about 2ⁿ calls, each doing O(1) work: **O(2ⁿ)**. On a laptop fib(35) takes about 0.1 seconds, but fib(50) takes a few minutes. Fifteen more levels means over a thousand times the work.

Notice fib(3) is computed twice and fib(2) three times. Save each answer the first time (memoisation):

```js
function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, v);
  return v;
}
```

Now each value from 0 to n is computed once: n calls × O(1) = **O(n)**. That's the whole idea behind dynamic programming: stop recomputing.

**Divide and conquer** (merge sort) works the same way. Split in half each time, so there are log n levels. At each level, the merging touches all n elements in total. So it's n work × log n levels = **O(n log n)**.

```
level 0:        [8 elements]            → merge work: 8
level 1:     [4]          [4]           → merge work: 8
level 2:   [2]  [2]     [2]  [2]        → merge work: 8
level 3:  [1][1][1][1] [1][1][1][1]     → merge work: 8
            log₂8 = 3 levels × 8 = n log n
```

---

## 4. What JavaScript built-ins really cost

Interviewers notice when you call something like `shift()` or `includes()` inside a loop. Know this table.

### Arrays

| Operation | Time | Extra space | Why |
|---|---|---|---|
| `arr[i]`, `arr.length` | O(1) | O(1) | direct index |
| `push(x)`, `pop()` | O(1) amortised | O(1) | works at the end |
| `shift()`, `unshift(x)` | **O(n)** | O(1) | every other element moves one slot |
| `splice(i, k, ...)` | **O(n)** | O(k) | elements after i move |
| `slice(a, b)` | O(b − a) | **O(b − a)** | makes a copy |
| `[...arr]`, `concat` | O(n) | **O(n)** | makes a copy |
| `indexOf`, `includes`, `find`, `findIndex`, `some`, `every` | **O(n)** | O(1) | linear search |
| `map`, `filter` | O(n) | O(n) | new array |
| `forEach`, `reduce` | O(n) | O(1)* | *plus whatever your callback creates |
| `reverse()` | O(n) | O(1) | in place |
| `sort()` | **O(n log n)** | O(n) in V8 | V8 uses TimSort |
| `join()` | O(total length) | O(total length) | builds a string |
| `Math.max(...arr)` | O(n) | O(n) | the spread copies into arguments. **Throws `RangeError` on large arrays** (in Node it fails somewhere between 100,000 and 200,000 items). Use a loop. |
| `new Array(n).fill(0)`, `Array.from({length: n})` | O(n) | O(n) | |

### Map, Set, objects

| Operation | Time |
|---|---|
| `map.get/set/has/delete`, `set.add/has/delete` | O(1) average |
| `obj[key]`, `key in obj` | O(1) average |
| `map.size` | O(1) |
| `Object.keys(obj)`, `Object.entries(obj)` | O(k), and creates a new array of k items |
| `new Set(arr)` | O(n) time, O(n) space |

### Strings

Strings in JS are **immutable**. Any operation that "changes" a string makes a new one.

| Operation | Time | Extra space |
|---|---|---|
| `s[i]`, `s.length` | O(1) | O(1) |
| `s.slice`, `s.substring` | O(k) | O(k) |
| `s.split('')`, `[...s]` | O(n) | O(n) |
| `s.includes(sub)`, `s.indexOf(sub)` | up to O(n · m) | O(1) |
| `s1 + s2` | O(n + m) | O(n + m) |
| `[...s].sort().join('')` | O(n log n) | O(n) |

For building a long string in a loop, push pieces into an array and `join('')` once at the end. Modern engines also optimise `+=`, but the array version is what you can clearly defend as O(n) total.

### The traps, all in one place

```js
// Looks O(n). Actually O(n²): includes is a loop.
for (const x of a) if (b.includes(x)) count++;
// Fix: const setB = new Set(b); then setB.has(x) → O(n + m)

// Looks O(n). Actually O(n²): shift moves every element each time.
while (queue.length) { const x = queue.shift(); }
// Fix: keep a head index: let head = 0; queue[head++]

// Looks O(n). Actually O(n²): copies the whole accumulator every step.
arr.reduce((acc, x) => [...acc, x * 2], []);
// Fix: arr.map(x => x * 2), or push into acc

// Looks O(log n). Actually O(n): slice copies half the array each call.
function bs(arr, t) { const mid = arr.length >> 1; return bs(arr.slice(0, mid), t); }
// Fix: pass lo and hi indices instead of slicing
```

---

## 5. Space complexity

Space complexity asks: **how much extra memory grows with n?**

In interviews, "space" usually means **auxiliary (extra) space**: memory you allocate on top of the input. The output array is often not counted either. If unsure, say which one you mean: "O(1) extra space, not counting the output."

### What counts

| Thing | Space |
|---|---|
| A few numbers or pointers (`let i, left, right, sum`) | O(1) |
| A new array, string, Map or Set that grows with n | O(n) |
| A 2D grid / DP table of rows × cols | O(rows × cols) |
| A copy made by `slice`, spread, `split` | size of the copy |
| **Recursion** | **O(maximum depth)**: every call waiting to return holds a stack frame |

### Recursion uses space even with no arrays

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

No arrays anywhere, but when sumTo(1000) is running, there are 1000 unfinished calls stacked up:

```
sumTo(1000)  waiting for sumTo(999)
  sumTo(999)  waiting for sumTo(998)
    ...
      sumTo(1)  waiting for sumTo(0)
        sumTo(0) → returns 0
```

Time O(n), **space O(n)**. A loop version uses O(1) space. Very deep recursion (around 10⁴ to 10⁵ calls in JS) also throws `RangeError: Maximum call stack size exceeded`. That's worth mentioning if n is large.

Naive fib(n): time O(2ⁿ), but space only **O(n)**. At any moment, only one path from the root to a leaf is on the stack, and the deepest path is n long. Time counts every call ever made. Space counts only what's alive at the same moment.

### Time vs space trade-off

Most optimisations spend memory to save time:

| Problem | Low memory | Fast |
|---|---|---|
| Does the array have a duplicate? | Nested loops: O(n²) time, O(1) space | Set: O(n) time, O(n) space |
| | Sort then check neighbours: O(n log n) time, O(1)–O(n) space | |
| Pair with target sum | Nested loops: O(n²), O(1) | Map: O(n), O(n) |
| ... **in a sorted array** | | Two pointers: O(n) time **and** O(1) space |

When there's a trade-off, say it: "I can do O(n) time with O(n) space using a Set, or O(n log n) with less memory by sorting. Which matters more here?" Interviewers like hearing that you see both.

---

## 6. Worked example: the ServiceNow problem

> Remove the shortest contiguous subarray so the rest is sorted (non-decreasing).

### Brute force: O(n³)

Try removing every possible subarray `[i..j]`, then check if what's left is sorted.

- How many (i, j) pairs? About n²/2 → O(n²)
- Checking sortedness of what's left: O(n)
- Total: O(n²) × O(n) = **O(n³)** time. O(1) space if you check in place, O(n) if you build the leftover array.

At n = 10⁵ that's 10¹⁵ steps. Impossible.

### Your first attempt: O(n²), but wrong

Counting out-of-order pairs with two nested loops is O(n²) and answers a different question. Lesson: get the approach right before worrying about complexity. A fast wrong answer scores nothing.

### Optimal: O(n) time, O(1) space

```js
function findLengthOfShortestSubarray(arr) {
  const n = arr.length;

  let left = 0;                                              // pass 1
  while (left + 1 < n && arr[left] <= arr[left + 1]) left++;
  if (left === n - 1) return 0;

  let right = n - 1;                                         // pass 2
  while (right > 0 && arr[right - 1] <= arr[right]) right--;

  let ans = Math.min(n - left - 1, right);
  let i = 0, j = right;                                      // pass 3
  while (i <= left && j < n) {
    if (arr[i] <= arr[j]) { ans = Math.min(ans, j - i - 1); i++; }
    else j++;
  }
  return ans;
}
```

How to justify it, step by step:

| Part | Max steps | Why |
|---|---|---|
| Pass 1 | n | `left` only moves forward, at most to n − 1 |
| Pass 2 | n | `right` only moves backward, at most to 0 |
| Pass 3 | 2n | each step moves `i` or `j` forward by 1. `i` moves at most n times and `j` at most n times, so 2n in total (Rule 7) |
| **Total** | **≤ 4n** | **O(n)** |

Space: `n, left, right, ans, i, j` are six numbers. Nothing grows with n, so **O(1)**.

---

## 7. The optimisation playbook

When you have a brute force, ask **"what am I recomputing or re-searching?"** Then match it to the table:

| If your brute force… | Use… | Before → after |
|---|---|---|
| searches the array again inside a loop (`includes`, inner loop looking for a value) | **Map / Set** to remember what you've seen | O(n²) → O(n), costs O(n) space |
| recomputes the sum of a range again and again | **Prefix sum** | O(n) per query → O(1) per query |
| recomputes a window's sum/count every time it moves by one | **Sliding window**: add the new element, remove the old one | O(n · k) → O(n) |
| checks pairs in a **sorted** array | **Two pointers** from both ends | O(n²) → O(n), O(1) space |
| scans a **sorted** array for one value | **Binary search** | O(n) → O(log n) |
| solves the same subproblem many times in recursion | **Memoisation / DP** | O(2ⁿ) → O(n) or O(n²) |
| looks back for the "next greater/smaller" element each time | **Monotonic stack** | O(n²) → O(n) |
| needs the k largest/smallest repeatedly | **Heap**, or bucket by count | O(n log n) → O(n log k) |
| sorts when only counts matter | **Counting array / Map** | O(n log n) → O(n) |

A good interview flow:

1. "Brute force is ___, which is O(___). With n up to ___, that's too slow."
2. "The repeated work is ___."
3. "If I use ___ I can avoid it, which makes it O(___) time and O(___) space."

---

## 8. How to say it out loud

Don't just say "O(n)". Say **why**, in one sentence each for time and space.

**One loop**
> "Time is O(n) because I go through the array once and each step is constant work: a Map lookup and an addition. Space is O(n) because in the worst case every element goes into the Map."

**Two pointers / sliding window**
> "It looks like a nested loop, but `left` only moves forward and never resets, so across the whole run it moves at most n times. Together with `right` that's at most 2n steps, so O(n)."

**Sort first**
> "Sorting is O(n log n), and the scan after is O(n). The sort dominates, so O(n log n) overall."

**Recursion**
> "There are n distinct subproblems, and with memoisation each is solved once in O(1), so O(n) time. Space is O(n) for the memo plus O(n) recursion depth, so O(n)."

**When asked "can you do better?"**
> "The lower bound here is O(n), because I have to look at every element at least once to know the answer. So O(n) time is optimal. I could check whether the space can come down."

The "I have to look at every element at least once" argument is how you show a solution can't get faster. Use it whenever you're already at O(n).

---

## 9. Practice plan

Work through these in order. Each set builds on the last.

| Set | What it trains | Where |
|---|---|---|
| Analyse: Easy (10) | single loops, nested loops, constants | [`exercises/01-easy.js`](./exercises/01-easy.js) |
| Analyse: Medium (11) | log n, hidden built-in costs, amortised pointers, recursion space | [`exercises/02-medium.js`](./exercises/02-medium.js) |
| Analyse: Hard (9) | exponential recursion, memo, harmonic sums, the ServiceNow solution | [`exercises/03-hard.js`](./exercises/03-hard.js) |
| Optimise (9 problems) | turning brute force into the fast version, with tests that time out on slow code | [`optimize/`](./optimize) |

**For each "Analyse" exercise:**

1. Trace it by hand with a small n (4 or 5). Write the steps in a table like the ones in this guide.
2. Write `Time: O(?)` and `Space: O(?)` in the comment.
3. Write one sentence of **why**, as you'd say it in an interview.
4. Only then check [`answers/`](./answers).

**For each "Optimise" problem:**

1. Read the brute force and write its complexity.
2. Find the repeated work (section 7).
3. Fill in the `fast` function. The comments give you the steps.
4. Run `npm test`. The large-input test fails if your solution is still too slow.
5. Run `npm run bench` to watch brute force and your version race as n grows.

Mark progress in [`../roadmap.md`](../roadmap.md).
