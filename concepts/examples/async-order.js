// async/await ordering: code before the first await runs synchronously; code after it is a microtask.
// Run: node concepts/examples/async-order.js
async function a1() { console.log('a1 start'); await a2(); console.log('a1 end'); }
async function a2() { console.log('a2'); }
console.log('script start');
setTimeout(() => console.log('setTimeout'), 0);
a1();
new Promise(r => { console.log('promise executor'); r(); }).then(() => console.log('then1')).then(() => console.log('then2'));
console.log('script end');
