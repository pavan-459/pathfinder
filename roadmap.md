# Roadmap

Tick a box (`[ ]` → `[x]`) when you have:
1. solved it **without looking at a solution**,
2. saved it in [`problems/`](./problems) using the [template](./problems/_template.js), with time and space filled in,
3. said the pattern out loud before coding.

If you needed a hint, leave it unticked and add **(revisit)** at the end of the line. Redo it from scratch three days later.

Run `npm run progress` to see your totals.

## Module 1 · Time & space complexity (Oct 16 – 19)

Guide: [`01-complexity/README.md`](./01-complexity/README.md)

- [ ] Read guide sections 1–3, then do [Easy](./01-complexity/exercises/01-easy.js) E1–E10
- [ ] Read guide sections 4–5, then do [Medium](./01-complexity/exercises/02-medium.js) M1–M11
- [ ] Read guide sections 6–8, then do [Hard](./01-complexity/exercises/03-hard.js) H1–H9
- [ ] O1 · has duplicate
- [ ] O2 · count common values
- [ ] O3 · range sum queries
- [ ] O4 · max window sum
- [ ] O5 · pair sum in sorted array
- [ ] O6 · first unique character
- [ ] O7 · count subarrays summing to k
- [ ] O8 · next greater element
- [ ] O9 · shortest subarray to remove (ServiceNow)

## Phase 1 · Two pointers & sorted arrays (Oct 20 – 27)

The ServiceNow problem was this pattern. Spot a sorted prefix/suffix and move two pointers instead of nesting loops.

- [ ] [LC 1574 · Shortest Subarray to be Removed to Make Array Sorted](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/) · Medium · _Prefix + suffix, two pointers_ · **Asked at ServiceNow** (revisit)
- [ ] [LC 88 · Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) · Easy · _Two pointers from the end_
- [ ] [LC 26 · Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) · Easy · _Read/write pointers_
- [ ] [LC 283 · Move Zeroes](https://leetcode.com/problems/move-zeroes/) · Easy · _Write pointer_
- [ ] [LC 125 · Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) · Easy · _Pointers from both ends_
- [ ] [LC 167 · Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) · Medium · _Pointers from both ends_
- [ ] [LC 11 · Container With Most Water](https://leetcode.com/problems/container-with-most-water/) · Medium · _Move the shorter side_
- [ ] [LC 15 · 3Sum](https://leetcode.com/problems/3sum/) · Medium · _Sort + two pointers_
- [ ] [LC 581 · Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/) · Medium · _Scan for boundaries_ · **Close cousin of 1574**
- [ ] [LC 42 · Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) · Hard · _Two pointers with max heights_

## Phase 2 · Strings & sliding window (Oct 28 – Nov 4)

More array and string practice, as the interviewer asked.

- [ ] [LC 242 · Valid Anagram](https://leetcode.com/problems/valid-anagram/) · Easy · _Frequency count_
- [ ] [LC 14 · Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/) · Easy · _Vertical scan_
- [ ] [LC 3 · Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) · Medium · _Variable sliding window_
- [ ] [LC 424 · Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) · Medium · _Window + max frequency_
- [ ] [LC 567 · Permutation in String](https://leetcode.com/problems/permutation-in-string/) · Medium · _Fixed window + counts_
- [ ] [LC 438 · Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) · Medium · _Fixed window + counts_
- [ ] [LC 49 · Group Anagrams](https://leetcode.com/problems/group-anagrams/) · Medium · _Hash by sorted key_
- [ ] [LC 5 · Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) · Medium · _Expand around center_
- [ ] [LC 76 · Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) · Hard · _Window + need/missing count_

## Phase 3 · Hashing & prefix sum (Nov 5 – 12)

Trading space for time: O(n²) brute force down to O(n) with a Map.

- [ ] [LC 1 · Two Sum](https://leetcode.com/problems/two-sum/) · Easy · _Complement lookup_
- [ ] [LC 128 · Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) · Medium · _Set, start only at sequence heads_
- [ ] [LC 347 · Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) · Medium · _Count + buckets_
- [ ] [LC 560 · Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) · Medium · _Prefix sum + Map_
- [ ] [LC 974 · Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k/) · Medium · _Prefix remainders_
- [ ] [LC 525 · Contiguous Array](https://leetcode.com/problems/contiguous-array/) · Medium · _Prefix sum, map first index_
- [ ] [LC 238 · Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) · Medium · _Left and right products_
- [ ] [LC 53 · Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) · Medium · _Kadane_
- [ ] [LC 56 · Merge Intervals](https://leetcode.com/problems/merge-intervals/) · Medium · _Sort + merge_
- [ ] [LC 75 · Sort Colors](https://leetcode.com/problems/sort-colors/) · Medium · _Dutch flag, three pointers_

## Phase 4 · Binary search & stack (Nov 13 – 20)

Optimisation beyond linear scans: O(log n) search and monotonic stacks.

- [ ] [LC 704 · Binary Search](https://leetcode.com/problems/binary-search/) · Easy · _Classic template_
- [ ] [LC 35 · Search Insert Position](https://leetcode.com/problems/search-insert-position/) · Easy · _Lower bound_
- [ ] [LC 74 · Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) · Medium · _Treat grid as one array_
- [ ] [LC 153 · Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) · Medium · _Compare mid with right_
- [ ] [LC 33 · Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) · Medium · _Find the sorted half_
- [ ] [LC 20 · Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) · Easy · _Stack_
- [ ] [LC 155 · Min Stack](https://leetcode.com/problems/min-stack/) · Medium · _Stack of (value, min)_
- [ ] [LC 496 · Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) · Easy · _Monotonic stack_
- [ ] [LC 739 · Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) · Medium · _Monotonic stack of indices_

## Phase 5 · Dynamic programming (Nov 21 – 30)

State and recurrence in words first, then code.

- [ ] [LC 70 · Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) · Easy · _dp[i] = dp[i-1] + dp[i-2]_
- [ ] [LC 198 · House Robber](https://leetcode.com/problems/house-robber/) · Medium · _Skip or take_
- [ ] [LC 322 · Coin Change](https://leetcode.com/problems/coin-change/) · Medium · _Min coins per amount_
- [ ] [LC 300 · Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) · Medium · _dp ending at i_
- [ ] [LC 62 · Unique Paths](https://leetcode.com/problems/unique-paths/) · Medium · _Grid: top + left_
- [ ] [LC 64 · Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) · Medium · _Grid: min(top, left) + cost_
- [ ] [LC 221 · Maximal Square](https://leetcode.com/problems/maximal-square/) · Medium · _1 + min of three neighbours_ · **Reported at ServiceNow**
- [ ] [LC 1143 · Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) · Medium · _Two-string table_
