# Answers: Easy

Only read these after writing your own. If yours differs, re-trace with a small n before reading the explanation.

| # | Time | Space |
|---|---|---|
| E1 | O(n) | O(1) |
| E2 | O(1) | O(1) |
| E3 | O(n) | O(1) |
| E4 | O(n²) | O(1) |
| E5 | O(1) | O(1) |
| E6 | O(n) | O(n) |
| E7 | O(n) | O(k), k = distinct characters (≤ n) |
| E8 | O(√n) | O(1) |
| E9 | O(n) | O(1) |
| E10 | O(a + b) | O(a + b) |

---

**E1 `sumArray`: O(n) time, O(1) space**
One loop over n items, constant work each. `total` and `i` are two numbers no matter how big the array is.
> "One pass, constant work per element, so O(n). Only a running total, so O(1) extra space."

**E2 `getMiddle`: O(1), O(1)**
`arr.length` and `arr[index]` are direct lookups. The work doesn't change if the array has 10 items or 10 million.

**E3 `minAndMax`: O(n), O(1)**
Two loops **one after the other**: n + n = 2n → O(n). They'd only multiply if one were *inside* the other (Rule 1 vs Rule 2). Same idea as the three passes in the ServiceNow solution.

**E4 `countEvenSumPairs`: O(n²), O(1)**
For each of n values of `i`, the inner loop runs n times: n × n. Only a counter is stored.
Trace n = 3: (i, j) = (0,0) (0,1) (0,2) (1,0) … (2,2) → 9 = 3².

**E5 `sumFirstHundred`: O(1), O(1)**
The loop stops at 100 at most. With 1,000,000 items it still does 100 steps. A bounded loop is constant, even if the constant is big.
> Interview trap: don't say O(n) just because there's a loop. Ask "does the loop count grow with the input?"

**E6 `doubled`: O(n), O(n)**
`map` visits every item once and **creates a new array of n items**. That new array is the extra space. (If the interviewer says "don't count the output", it's O(1) extra. Say which one you mean.)

**E7 `charCounts`: O(n) time, O(k) space**
One pass, and each `Map.get`/`set` is O(1) average. The Map holds one entry per *distinct* character, k, which is at most n.
Bonus: if the string only has a–z, k ≤ 26, a fixed limit, so space is **O(1)**. Saying this in an interview shows you understand what space actually measures.

**E8 `isPrime`: O(√n), O(1)**
The loop runs while `i * i <= n`, so i goes up to √n. For n = 1,000,000 that's only 1,000 steps.

**E9 `sumEvenIndexes`: O(n), O(1)**
`i += 2` visits n/2 items. Halving the count is a constant factor, so still O(n). Compare with `i *= 2`, which **is** O(log n). Adding vs multiplying the loop variable is the difference.

**E10 `joinLists`: O(a + b), O(a + b)**
Two separate loops: a steps, then b steps. Use two letters because the sizes are independent. If a has 1,000,000 items and b has 3, "O(n)" would hide which one matters.
