// Inside an I/O callback, setImmediate (check phase) always runs before setTimeout(0) (timers phase, next loop).
// Run: node concepts/examples/io-callback-order.js
require('fs').readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
