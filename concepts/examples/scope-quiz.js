// Scope, hoisting and lexical scope quiz. Predict each line, then run: node concepts/examples/scope-quiz.js
const log = (...a) => console.log(...a);

// a) var is function-scoped, let is block-scoped
{ var v = 1; let l = 2; }
log('a', typeof v, typeof l);                       // number undefined

// b) const stops reassignment, not mutation
const cfg = { env: 'dev' };
cfg.env = 'prod';
log('b', cfg.env);                                  // prod
try { eval('const k = 1; k = 2;'); } catch (e) { log('b2', e.name); }   // TypeError

// c) lexical scope: a function sees variables where it was DEFINED, not where it is CALLED
const x = 'global';
function outer() { const x = 'outer'; function inner() { return x; } return inner; }
function caller() { const x = 'caller'; return outer()(); }
log('c', caller());                                 // outer

// d) the inner `let y` shadows the outer y for the whole function, so reading it early hits the TDZ
let y = 1;
function f() { try { return y; } catch (e) { return e.name; } let y = 2; }
log('d', f());                                      // ReferenceError

// e) var ignores block boundaries
function g() { if (true) { var z = 5; } return z; }
log('e', g());                                      // 5

// f) let cannot be redeclared in the same scope
try { eval('let r = 1; let r = 2;'); } catch (e) { log('f', e.name); }  // SyntaxError

// g) the classic var-in-loop closure bug, fixed with an IIFE (or just use let)
const fns = [];
for (var i = 0; i < 3; i++) fns.push(((j) => () => j)(i));
log('g', fns.map(fn => fn()).join(','));            // 0,1,2

// h) function declarations are fully hoisted; function expressions are not
log('h', typeof decl, typeof expr);                 // function undefined
function decl() {}
var expr = function () {};

// i) regular callback loses `this`; arrow callback keeps the method's `this`
const hotel = {
  name: 'Marriott',
  regular() { return [1].map(function () { return this && this.name; })[0]; },
  arrow() { return [1].map(() => this.name)[0]; },
};
log('i', hotel.regular(), hotel.arrow());           // undefined Marriott
