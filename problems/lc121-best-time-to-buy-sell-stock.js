// =============================================================
//  LC 121 · Best Time to Buy and Sell Stock               [E]
//  Link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
//  Date: 21 Oct 2026. Asked at Marriott Tech Accelerator as
//  "explain your approach" (no code). Written up after the round.
// -------------------------------------------------------------
//  Pattern (say it BEFORE coding):
//    Single pass with a running minimum ("best so far" state).
//    Same idea as Kadane's maximum subarray on daily price changes.
//
//  Brute force + its complexity:
//    Try every buy day i and every later sell day j. O(n²) time, O(1) space.
//
//  What the brute force recomputes:
//    For each sell day it rescans all earlier days to find the cheapest buy.
//    That minimum can be carried forward instead of recomputed.
//
//  Approach in plain English:
//    1. Treat every day as a possible SELL day.
//    2. The best buy for that day is the lowest price BEFORE it, so keep minPrice.
//    3. If today is a new minimum, update minPrice (better day to buy).
//    4. Otherwise, check if selling today (price - minPrice) beats best.
//    5. Return best (starts at 0, so "never trade" is the default).
//
//  Why it's correct:
//    The optimal trade has some sell day. When the loop reaches it, minPrice is the
//    cheapest earlier price, i.e. the best buy for that day. Every day is checked.
//
//  Trap to mention: max(prices) - min(prices) is WRONG, because the max can come
//    before the min. [5, 10, 1, 3] would give 9, but the answer is 5.
//
//  Edge cases checked:
//    [x] empty   [x] one element   [x] already sorted / all same
//    [x] all decreasing   [ ] negatives (prices are >= 0)   [x] duplicates
//
//  Time:  O(n)  because each price is visited once
//  Space: O(1)  because only minPrice and best are stored
// =============================================================

function solve(prices) {
  let minPrice = Infinity;   // cheapest buy seen so far
  let best = 0;              // best profit seen so far
  for (const p of prices) {
    if (p < minPrice) minPrice = p;              // better day to buy
    else best = Math.max(best, p - minPrice);    // try selling today
  }
  return best;
}

// ---------- follow-ups interviewers ask next ----------

// "Also return which days to buy and sell." (-1 means no profitable trade)
function solveWithDays(prices) {
  let minIdx = 0, best = 0, buy = -1, sell = -1;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < prices[minIdx]) minIdx = i;
    else if (prices[i] - prices[minIdx] > best) {
      best = prices[i] - prices[minIdx];
      buy = minIdx; sell = i;
    }
  }
  return { profit: best, buy, sell };
}

// "What if you MUST make one trade, even at a loss?"
// Compute today's profit BEFORE updating the minimum, and start best at -Infinity.
function solveMustTrade(prices) {
  if (prices.length < 2) return null;  // no valid trade exists
  let minPrice = prices[0], best = -Infinity;
  for (let i = 1; i < prices.length; i++) {
    best = Math.max(best, prices[i] - minPrice);
    minPrice = Math.min(minPrice, prices[i]);
  }
  return best;
}

// "Unlimited trades?" (LC 122): collect every upward step.
function solveUnlimited(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++)
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  return profit;
}

// "At most k trades?" (LC 123 for k = 2, LC 188 in general): state-machine DP.
// buy[t] = best cash after the t-th buy; sell[t] = best cash after the t-th sell.
function solveAtMostK(k, prices) {
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);
  for (const p of prices)
    for (let t = 1; t <= k; t++) {
      buy[t] = Math.max(buy[t], sell[t - 1] - p);
      sell[t] = Math.max(sell[t], buy[t] + p);
    }
  return sell[k];
}

// Quick checks: run with `node problems/lc121-best-time-to-buy-sell-stock.js`
console.log(solve([7, 1, 5, 3, 6, 4])); // expected: 5
console.log(solve([7, 6, 4, 3, 1]));    // expected: 0

// Full checks, including a random comparison against the O(n²) brute force
const assert = require('node:assert');
const brute = (p) => { let b = 0; for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) b = Math.max(b, p[j] - p[i]); return b; };
for (const [p, e] of [[[2, 4, 1], 2], [[1], 0], [[], 0], [[3, 3, 3], 0], [[5, 10, 1, 3], 5], [[2, 1, 2, 1, 0, 1, 2], 2]]) assert.strictEqual(solve(p), e);
for (let t = 0; t < 500; t++) {
  const p = Array.from({ length: Math.floor(Math.random() * 15) }, () => Math.floor(Math.random() * 30));
  assert.strictEqual(solve(p), brute(p));
}
assert.deepStrictEqual(solveWithDays([7, 1, 5, 3, 6, 4]), { profit: 5, buy: 1, sell: 4 });
assert.deepStrictEqual(solveWithDays([7, 6, 4, 3, 1]), { profit: 0, buy: -1, sell: -1 });
assert.strictEqual(solveMustTrade([7, 6, 4, 3, 1]), -1);
assert.strictEqual(solveMustTrade([7, 1, 5, 3, 6, 4]), 5);
assert.strictEqual(solveMustTrade([5]), null);
assert.strictEqual(solveUnlimited([7, 1, 5, 3, 6, 4]), 7);
assert.strictEqual(solveUnlimited([1, 2, 3, 4, 5]), 4);
assert.strictEqual(solveAtMostK(2, [3, 3, 5, 0, 0, 3, 1, 4]), 6);
assert.strictEqual(solveAtMostK(2, [3, 2, 6, 5, 0, 3]), 7);
assert.strictEqual(solveAtMostK(1, [7, 1, 5, 3, 6, 4]), 5);
console.log('All checks passed');

module.exports = { solve, solveWithDays, solveMustTrade, solveUnlimited, solveAtMostK };
