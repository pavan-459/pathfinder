// Node event loop order: sync -> process.nextTick -> promise microtasks -> timers / check phases
// Run: node concepts/examples/event-loop.js
// Lines 1-5 always print in this order. Lines 6 and 7 can swap between runs: at the top level of a
// script, setTimeout(0) vs setImmediate depends on how fast the loop starts. Inside an I/O callback
// setImmediate always wins (see io-callback-order.js).
console.log('1 sync start');
setTimeout(() => console.log('6 setTimeout'), 0);
setImmediate(() => console.log('7 setImmediate'));
Promise.resolve().then(() => console.log('4 promise.then'));
process.nextTick(() => console.log('3 nextTick'));
queueMicrotask(() => console.log('5 queueMicrotask'));
console.log('2 sync end');
