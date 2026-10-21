// libuv's thread pool (default 4 threads) runs fs, dns.lookup, crypto and zlib work off the main thread.
// Start 8 CPU-heavy pbkdf2 hashes at once and watch them finish in groups.
// Run: node concepts/examples/libuv-threadpool.js
// Then: UV_THREADPOOL_SIZE=8 node concepts/examples/libuv-threadpool.js   (Windows: set UV_THREADPOOL_SIZE=8 first)
// Timings depend on your CPU cores; with fewer than 4 cores the grouping is less clear.
const crypto = require('crypto');
const start = Date.now();
console.log(`UV_THREADPOOL_SIZE = ${process.env.UV_THREADPOOL_SIZE || '4 (default)'}`);
for (let i = 1; i <= 8; i++) {
  crypto.pbkdf2('password', 'salt', 300000, 64, 'sha512', () => {
    console.log(`hash ${i} done after ${Date.now() - start} ms`);
  });
}
console.log('All 8 hashes started; the main thread is free while libuv works.');
