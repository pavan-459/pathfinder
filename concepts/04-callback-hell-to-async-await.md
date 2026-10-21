# 4. Callback hell, Promises and async/await

## What callback hell is

When each async step needs the result of the previous one, and every step takes a callback, the code nests deeper with each step:

```js
getUser(id, (err, user) => {
  if (err) return done(err);
  getBooking(user.bookingId, (err, booking) => {
    if (err) return done(err);
    getHotel(booking.hotelId, (err, hotel) => {
      if (err) return done(err);
      done(null, hotel.pricePerNight * booking.nights);
    });
  });
});
```

**Why it's a problem (say these, not just "it looks ugly"):**
1. **Readability:** logic flows rightward instead of top to bottom (the "pyramid of doom").
2. **Error handling is repeated at every level**, and forgetting one `if (err)` silently swallows a failure.
3. **Hard to compose:** running steps in parallel, adding retries or timeouts means more nesting and manual counters.
4. **Inversion of control:** you hand your continuation to someone else's function and trust it to call it exactly once. A buggy library might call it twice or never.

## Fix 1: named functions (flatten without changing the model)

Pull each callback out into a named function. It reduces nesting but still repeats error handling. Mention it as the first step people took historically.

## Fix 2: Promises

A Promise is an object representing a future value, in one of three states: **pending**, **fulfilled** or **rejected**. It settles once and only once, which fixes the inversion-of-control problem.

```js
const { promisify } = require('util');
const getUserP = promisify(getUser);   // converts error-first callbacks to promises

getUserP(id)
  .then(user => getBookingP(user.bookingId))
  .then(booking => getHotelP(booking.hotelId))
  .then(hotel => console.log(hotel.name))
  .catch(err => console.error(err));     // ONE handler catches a failure at any step
```

Returning a promise inside `.then` chains it, which keeps the code flat.

## Fix 3: async/await

Syntax on top of promises. `await` pauses the async function until the promise settles, without blocking the thread. Everything after an `await` resumes as a microtask.

```js
async function totalCost(userId) {
  try {
    const user = await getUserP(userId);
    const booking = await getBookingP(user.bookingId);
    const hotel = await getHotelP(booking.hotelId);
    return hotel.pricePerNight * booking.nights;
  } catch (err) {
    // one place for every step's errors
    throw err;
  }
}
```

## Don't serialise independent work

A common mistake with async/await is awaiting independent calls one after another:

```js
// Slow: each waits for the previous one
const a = await getHotelP('h1');
const b = await getHotelP('h2');

// Fast: start both, then wait for both
const [a, b] = await Promise.all([getHotelP('h1'), getHotelP('h2')]);
```

From `node concepts/examples/callback-hell.js`: `sequential awaits ~31ms vs Promise.all ~11ms` (three 10ms calls).

| Combinator | Resolves when | Rejects when | Use for |
|---|---|---|---|
| `Promise.all` | All fulfil | Any one rejects (fail fast) | Everything is required |
| `Promise.allSettled` | All settle | Never | Show what succeeded, report what failed |
| `Promise.race` | First settles | First settles with rejection | Timeouts |
| `Promise.any` | First fulfils | All reject | Fastest of several mirrors |

## Run it

`node concepts/examples/callback-hell.js` implements the same booking lookup four ways (callbacks, promises, async/await, parallel) against a fake async data layer and prints identical results, plus an error-path example.

## 30-second answer: "What is callback hell and how do you avoid it?"

> "It's deeply nested callbacks when each async step depends on the previous one. The real problems are repeated error handling at every level, code that's hard to compose for parallel work or retries, and trusting a callee to call your callback exactly once. Promises fix that: they settle once, chain flat, and one `.catch` handles every step. async/await is syntax on promises that reads top to bottom with try/catch. And for independent calls I use `Promise.all` so they run in parallel instead of one after another."
