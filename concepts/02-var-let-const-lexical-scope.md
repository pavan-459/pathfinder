# 2. var, let, const, hoisting and lexical scope

## The comparison table

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block `{ }` | Block `{ }` |
| Hoisted? | Yes, initialised to `undefined` | Yes, but **not initialised** (TDZ) | Yes, but **not initialised** (TDZ) |
| Read before declaration | `undefined` | `ReferenceError` | `ReferenceError` |
| Redeclare in same scope | Allowed | `SyntaxError` | `SyntaxError` |
| Reassign | Allowed | Allowed | `TypeError` |
| Top-level in a browser script | Becomes `window.x` | Doesn't | Doesn't |

**`const` is about the binding, not the value.** `const cfg = {}` means `cfg` always points to the same object, but you can still change `cfg.env`. Use `Object.freeze` for a shallow read-only object.

**Default to `const`, use `let` when you must reassign, avoid `var`.** That's the answer interviewers want, followed by the reason: block scope avoids accidental leaks and the loop-closure bug.

## Hoisting and the Temporal Dead Zone (TDZ)

During the creation phase, JavaScript registers every declaration in its scope before running any code.

- `var x` is registered **and set to `undefined`**.
- `let`/`const` are registered **but left uninitialised**. From the start of the block until the declaration line runs, the variable is in the **TDZ**, and touching it throws.
- Function **declarations** are hoisted with their body, so you can call them before they appear. Function **expressions** (`var f = function () {}`) follow the variable's rules.

```js
console.log(a);  // undefined   (var hoisted)
console.log(b);  // ReferenceError: Cannot access 'b' before initialization
var a = 1;
let b = 2;
```

Subtle one (asked a lot):

```js
let y = 1;
function f() {
  console.log(y);   // ReferenceError, NOT 1
  let y = 2;        // this inner y shadows the outer one for the WHOLE function body
}
```

## Lexical scope

**Lexical (static) scope** means a variable's visibility is decided by **where the code is written**, not where it is called from. When JavaScript looks up a name, it searches the current scope, then the scope the function was *defined* in, then outward to global. This is the **scope chain**.

```js
const x = 'global';
function outer() {
  const x = 'outer';
  function inner() { return x; }   // looks up x where inner was DEFINED
  return inner;
}
function caller() {
  const x = 'caller';
  return outer()();                // still 'outer', not 'caller'
}
caller();  // 'outer'
```

If JavaScript used *dynamic* scope, this would return `'caller'`. It doesn't.

**`this` is the exception:** `this` is decided by **how a function is called** (not lexical), except in arrow functions, which take `this` lexically from where they're defined.

## Closures

A closure is a function bundled with the variables of the scope it was created in. Those variables stay alive as long as the function does.

```js
function makeCounter() {
  let count = 0;            // private
  return () => ++count;
}
const a = makeCounter(), b = makeCounter();
a(); a();
a();  // 3
b();  // 1   (separate closure, separate count)
```

Real uses: private state, memoisation, factory functions, event handlers, React hooks (a "stale closure" in `useEffect` is a closure holding an old value).

## The loop + closure classic

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));  // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j));  // 0 1 2
```

`var` creates one `i` for the whole function; by the time the callbacks run, the loop has finished and `i` is 3. `let` creates a **new binding for each iteration**, so each callback closes over its own `j`. Before `let`, the fix was an IIFE: `((j) => () => j)(i)`.

## Run the quiz

`node concepts/examples/scope-quiz.js` runs nine predict-the-output questions on everything above. Write down your answers first; the expected output is in the comments.

## 30-second answer: "Difference between var, let and const?"

> "`var` is function-scoped and hoisted with `undefined`, so reading it early gives undefined and it leaks out of blocks. `let` and `const` are block-scoped and sit in the temporal dead zone until their declaration runs, so reading them early throws. `const` can't be reassigned, but an object it points to can still be mutated. I use `const` by default and `let` when I need to reassign; I avoid `var`, mainly because of the loop-closure bug where every callback sees the final value."
