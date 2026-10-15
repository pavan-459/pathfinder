// Run: npm run progress
// Counts ticked boxes in roadmap.md, per section.
const fs = require('node:fs');
const path = require('node:path');

const text = fs.readFileSync(path.join(__dirname, '..', 'roadmap.md'), 'utf8');
const sections = [];
let current = null;
for (const line of text.split('\n')) {
  if (line.startsWith('## ')) { current = { name: line.slice(3).trim(), done: 0, total: 0, revisit: 0 }; sections.push(current); continue; }
  const m = line.match(/^- \[( |x|X)\]/);
  if (!m || !current) continue;
  current.total++;
  if (m[1] !== ' ') current.done++;
  else if (/\(revisit\)/i.test(line)) current.revisit++;
}

let done = 0, total = 0, revisit = 0;
console.log('');
for (const s of sections) {
  done += s.done; total += s.total; revisit += s.revisit;
  const width = 20, filled = s.total ? Math.round((s.done / s.total) * width) : 0;
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  console.log(`${bar} ${String(s.done).padStart(2)}/${String(s.total).padEnd(2)}  ${s.name}${s.revisit ? `  · ${s.revisit} to revisit` : ''}`);
}
console.log(`\nTotal: ${done}/${total} done${revisit ? `, ${revisit} marked to revisit` : ''}.\n`);
