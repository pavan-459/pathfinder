# 3. Output prediction drills

Cover the answers, write your prediction, then check. Every answer was produced by running the code in Node 22.

**How to talk through these on a call:** say which rule applies before giving the output. "This is a `var` in a loop with `setTimeout`, so all callbacks share one `i`, which is 3 when they run." Saying the rule matters more than being fast.

---

### Q1 — var vs let in a loop
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);
```
<details><summary>Answer</summary>

`3 3 3 0 1 2` — one shared `i` vs a fresh `j` per iteration.
</details>

### Q2 — sync, microtasks, macrotasks, async/await
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C')).then(() => console.log('D'));
(async () => { console.log('E'); await null; console.log('F'); })();
console.log('G');
```
<details><summary>Answer</summary>

`A E G C F D B`
- Sync: A, then E (an async function runs synchronously until its first `await`), then G.
- Microtasks in the order they were queued: C, F. D is only queued after C runs, so it comes after F.
- Macrotask last: B.
</details>

### Q3 — async function ordering (very common)
```js
async function a1() { console.log('a1 start'); await a2(); console.log('a1 end'); }
async function a2() { console.log('a2'); }
console.log('script start');
setTimeout(() => console.log('setTimeout'), 0);
a1();
new Promise(r => { console.log('promise executor'); r(); })
  .then(() => console.log('then1')).then(() => console.log('then2'));
console.log('script end');
```
<details><summary>Answer</summary>

```
script start
a1 start
a2
promise executor
script end
a1 end
then1
then2
setTimeout
```
The Promise executor runs synchronously. Run: `node concepts/examples/async-order.js`
</details>

### Q4 — Node-specific queues
```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('sync');
```
<details><summary>Answer</summary>

`sync nextTick promise`, then `timeout` and `immediate` in **either order**. `process.nextTick` runs before promise microtasks. At the top level of a script, timeout vs immediate is not guaranteed. Inside an I/O callback, `immediate` always comes first. Run: `node concepts/examples/event-loop.js` and `node concepts/examples/io-callback-order.js`
</details>

### Q5 — Array methods (the array from the interview style)
```js
const arr = [100, 56, 96, 156, 196, 10, 100];
console.log(Math.max(...arr), Math.min(...arr), arr.reduce((a, b) => a + b, 0));
console.log(arr.filter(n => n > 100), arr.indexOf(100), arr.lastIndexOf(100));
console.log([...arr].sort());
console.log([...arr].sort((a, b) => a - b));
console.log(Math.max(arr), Math.max());
```
<details><summary>Answer</summary>

```
196 10 714
[ 156, 196 ] 0 6
[ 10, 100, 100, 156, 196, 56, 96 ]     <- default sort compares as strings
[ 10, 56, 96, 100, 100, 156, 196 ]
NaN -Infinity
```
</details>

### Q6 — Coercion
```js
console.log(typeof null, [] == false, null == undefined, null === undefined);
console.log(NaN === NaN, 0.1 + 0.2 === 0.3, '5' + 3, '5' - 3);
```
<details><summary>Answer</summary>

`object true true false` and `false false 53 2`. `+` with a string concatenates; `-` always converts to numbers.
</details>

### Q7 — Shallow copy
```js
const a = { x: 1, inner: { y: 1 } };
const b = { ...a };
b.x = 2; b.inner.y = 2;
console.log(a.x, a.inner.y);
```
<details><summary>Answer</summary>

`1 2` — spread copies the top level only; `inner` is shared. Use `structuredClone(a)` for a deep copy.
</details>

### Q8 — `||` vs `??`
```js
console.log(0 || 'default', 0 ?? 'default', '' || 'x', '' ?? 'x', null ?? 'x');
```
<details><summary>Answer</summary>

`default 0 x  x` (the fourth value is an empty string). `||` falls back on any falsy value; `??` only on `null`/`undefined`.
</details>

### Q9 — `map(parseInt)`
```js
console.log(['1', '2', '3'].map(parseInt));
```
<details><summary>Answer</summary>

`[1, NaN, NaN]` — `map` passes `(value, index)`, so it calls `parseInt('2', 1)` and `parseInt('3', 2)`, which are invalid.
</details>

### Q10 — `this` in callbacks
```js
const hotel = {
  name: 'Marriott',
  regular() { return [1].map(function () { return this && this.name; })[0]; },
  arrow()   { return [1].map(() => this.name)[0]; },
};
console.log(hotel.regular(), hotel.arrow());
```
<details><summary>Answer</summary>

`undefined Marriott` — the regular callback is called without an object, so `this` isn't `hotel`. The arrow function takes `this` from `arrow()`, which was called as `hotel.arrow()`.
</details>

More: `node concepts/examples/scope-quiz.js` (scope and hoisting set).
