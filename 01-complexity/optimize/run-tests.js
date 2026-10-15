// Lets `npm test -- O4` run just one problem.
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const only = process.argv[2];
const args = ['--test', path.join(__dirname, 'optimize.test.js')];
const env = { ...process.env, ONLY: only ? only.toUpperCase() : '' };
const r = spawnSync(process.execPath, args, { stdio: 'inherit', env });
process.exit(r.status ?? 1);
