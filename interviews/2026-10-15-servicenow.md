# ServiceNow · Software Engineer · Round 1

**Date:** 15 Oct 2026, 11:00 IST (ran over an hour)
**Format:** Zoom, one interviewer. Intro, then DSA, then React.
**Outcome:** waiting

## What they said they were scoring

Thought process and approach, understanding of the question, and handling of edge cases. Wrong syntax or code that doesn't fully run is fine.

## Questions

### 1. Shortest subarray to remove so the rest is sorted (LeetCode 1574, Medium)

Given an array, remove one contiguous subarray so the remaining elements are non-decreasing. Return the minimum length removed.

- `[1, 2, 6, 4, 5, 7]` → 1 (remove `[6]`)
- `[1, 2, 3, 10, 4, 5]` → 1 (remove `[10]`)

**What I did**
- First approach: nested loops counting out-of-order pairs. O(n²), and it answers a different question. For `[1,2,3,10,4,5]` it returns 2 (10>4, 10>5), but the answer is 1.
- On paper I split the array into a sorted part `[1,2,3,10]` and `[4,5]`, compared across them (1<5, 2<4, …), and listed the candidates `[1,4,5]`, `[1,2,4,5]`, `[1,2,3,4,5]`. That's the correct algorithm, worked out by hand, but my code didn't follow it.
- After a hint, explained the two-pointer approach fully: sorted prefix, sorted suffix, join them with two pointers.
- Complexity: got to O(n) (three passes, pointers only move forward).

**Correct solution:** O(n) time, O(1) space. See [`01-complexity/README.md` section 6](../01-complexity/README.md#6-worked-example-the-servicenow-problem).

### 2. React hooks

Explained `useState`, `useEffect`, `useMemo`, `useReducer`.

Follow-up:
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => { setCount(count + 1); setCount(count + 1); }}>
      {count}
    </button>
  );
}
```
What happens on click?

- **Correct answer:** goes up by **1** per click, not 2. `count` is fixed for that render, so both calls say "set to count + 1". React batches them into one re-render.
- To add 2: `setCount(c => c + 1); setCount(c => c + 1);` (the updater form gets the latest queued value).
- I first said it would go up by 2, then explained the updater form correctly, but got the syntax slightly wrong.

## Feedback (from the interviewer, when I asked)

- Practise more DSA on **arrays and strings**, and get better at **identifying patterns**.
- **Picked up hints early** and understood quickly. **Good problem-solving skills.**
- Need to understand **time and space complexity in depth**, and **code optimisation**.

## What went well

- Asked about the interview process up front, so I knew what was being scored.
- Was honest about only 3 months of LeetCode; she said that was fine.
- Broke the problem down by hand and found the right structure.
- Recovered quickly after one hint.

## What to fix

1. **Name the pattern before writing code.** Here: "sorted prefix + sorted suffix → two pointers".
2. **Code what my hands did.** When the hand-worked example and the planned code disagree, trust the hand method.
3. **Know complexity cold**: be able to justify every O() in one sentence. → [Module 1](../01-complexity/README.md)
4. **React state:** if the new value depends on the old one, always use `setX(x => ...)`.

## Action items

- [ ] Complete Module 1 (complexity) by Oct 19
- [ ] Redo LC 1574 from scratch without notes
- [ ] Work through roadmap phases in order, 2 hrs/day
