// Runs one solution on a large input in a separate thread, so a slow
// solution can be stopped instead of freezing your terminal.
const { Worker } = require('node:worker_threads');
const path = require('node:path');

function runLarge(problem, useReference, timeoutMs) {
  return new Promise((resolve) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: { problem, useReference },
    });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ timedOut: true });
    }, timeoutMs);
    worker.once('message', (msg) => { clearTimeout(timer); worker.terminate(); resolve(msg); });
    worker.once('error', (err) => { clearTimeout(timer); resolve({ error: String(err && err.stack || err) }); });
  });
}

module.exports = { runLarge };
