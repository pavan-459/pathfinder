const path = require('node:path');

// Loads your `fast` from the problem file, or the reference solution
// when USE_REFERENCE=1 (used to check that the tests themselves are right).
function load(problem, useReference) {
  if (useReference) {
    const ref = require(path.join(__dirname, '..', '..', 'reference', 'optimize-solutions.js'));
    return ref[problem];
  }
  return require(path.join(__dirname, '..', problem + '.js')).fast;
}

module.exports = { load };
