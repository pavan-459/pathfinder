// =============================================================
//  Complexity: EASY (10 exercises)
//  Guide sections: 1, 2, 3 (rules 1–2)
// -------------------------------------------------------------
//  For each one:
//    1. Trace it by hand with a small n (4 or 5).
//    2. Fill in Time and Space.
//    3. Write one sentence of WHY, the way you'd say it in an interview.
//  Space = EXTRA memory you create (not the input itself).
//  Check answers/01-easy.md only after you've written yours.
// =============================================================


// E1 ----------------------------------------------------------
function sumArray(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
// Time:  O(    )
// Space: O(    )
// Why:


// E2 ----------------------------------------------------------
function getMiddle(arr) {
  return arr[Math.floor(arr.length / 2)];
}
// Time:  O(    )
// Space: O(    )
// Why:


// E3 ----------------------------------------------------------
function minAndMax(arr) {
  let min = Infinity;
  for (const x of arr) if (x < min) min = x;

  let max = -Infinity;
  for (const x of arr) if (x > max) max = x;

  return [min, max];
}
// Time:  O(    )
// Space: O(    )
// Why:   (Hint: two loops. Do they multiply or add?)


// E4 ----------------------------------------------------------
function countEvenSumPairs(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if ((arr[i] + arr[j]) % 2 === 0) count++;
    }
  }
  return count;
}
// Time:  O(    )
// Space: O(    )
// Why:


// E5 ----------------------------------------------------------
function sumFirstHundred(arr) {
  let total = 0;
  for (let i = 0; i < 100 && i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
// Time:  O(    )
// Space: O(    )
// Why:   (Hint: what happens to the work when arr has 1,000,000 items?)


// E6 ----------------------------------------------------------
function doubled(arr) {
  return arr.map(x => x * 2);
}
// Time:  O(    )
// Space: O(    )
// Why:


// E7 ----------------------------------------------------------
function charCounts(s) {
  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  return counts;
}
// Time:  O(    )
// Space: O(    )
// Why:
// Bonus: what is the space if s only ever contains lowercase a–z?


// E8 ----------------------------------------------------------
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
// Time:  O(    )   (Hint: the loop stops when i * i > n. So how big can i get?)
// Space: O(    )
// Why:


// E9 ----------------------------------------------------------
function sumEvenIndexes(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i += 2) {
    total += arr[i];
  }
  return total;
}
// Time:  O(    )
// Space: O(    )
// Why:


// E10 ---------------------------------------------------------
function joinLists(a, b) {
  const result = [];
  for (const x of a) result.push(x);
  for (const y of b) result.push(y);
  return result;
}
// Time:  O(    )   (Hint: a and b can be different sizes. Use two letters.)
// Space: O(    )
// Why:


module.exports = {
  sumArray, getMiddle, minAndMax, countEvenSumPairs, sumFirstHundred,
  doubled, charCounts, isPrime, sumEvenIndexes, joinLists,
};
