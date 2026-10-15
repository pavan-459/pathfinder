const { parentPort, workerData } = require('node:worker_threads');
const { load } = require('./load');
const cases = require('./cases');

const { problem, useReference } = workerData;
const fn = load(problem, useReference);
const { args, expected } = cases[problem].large();
const start = performance.now();
const result = fn(...args);
const ms = performance.now() - start;
parentPort.postMessage({ result, expected, ms, n: Array.isArray(args[0]) || typeof args[0] === 'string' ? args[0].length : null });
