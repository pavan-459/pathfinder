# Pathfinder

My preparation for product-company DSA interviews, in JavaScript.

It started from real interview feedback (ServiceNow, Oct 2026): practise arrays and strings, get faster at spotting patterns, and understand time and space complexity in depth. Everything here is built around those three things.

## How it's organised

| Folder | What's in it |
|---|---|
| [`01-complexity/`](./01-complexity) | **Start here.** In-depth guide to time and space complexity, 30 analysis exercises (easy → hard), and 9 "optimise the brute force" problems with tests |
| [`roadmap.md`](./roadmap.md) | The full plan: Module 1 plus 46 LeetCode problems in 5 phases, as a checklist |
| [`problems/`](./problems) | My solutions, one file per problem, each with pattern, approach, edge cases, and time/space |
| [`concepts/`](./concepts) | JS, Node.js and GraphQL theory from interview rounds (scope, event loop, libuv, N+1), with runnable examples |
| [`interviews/`](./interviews) | A log of every interview round: questions, mistakes, feedback, action items |

## Commands

Needs Node 20 or newer. No packages to install.

```bash
npm test               # check your optimise-problem solutions (unstarted ones are skipped)
npm test -- O4         # run tests for just one problem   (alias: npm run test:one -- O4)
npm run bench          # race brute force against your version as n doubles
npm run bench -- O4    # bench just one problem
npm run progress       # count ticked boxes in roadmap.md
```

The tests include a large input with a 1.5-second limit. An O(n²) solution fails it even if its answers are right, which is the point.

## Daily routine (2 hours)

1. **10 min**: re-read yesterday's solution and say its complexity out loud.
2. **90 min**: next items on the roadmap. Before coding, write the pattern and the brute-force complexity in the file header.
3. **20 min**: commit, tick the roadmap, and redo one problem marked *(revisit)*.

## Habits for every live round

1. Name the pattern before coding. If you can't, work a small example by hand first.
2. If your hand-worked example finds the answer a different way than your planned code, code the hand method.
3. After every brute force, ask: what am I recomputing?
4. State time and space for every solution, with one sentence of why.
5. Run the edge cases out loud: empty, one element, sorted, all same, decreasing, negatives.
