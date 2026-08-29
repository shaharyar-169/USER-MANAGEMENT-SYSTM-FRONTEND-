const fs = require('fs');
const css = fs.readFileSync('src/components/admin/ActivityLog.css', 'utf8');

const start = css.indexOf('/* Performed by meta (used in activity-meta-row) */');
const end = css.indexOf('/* ============================================\n   LOADING SKELETON');

if (start === -1 || end === -1) {
  console.log('Not found');
  process.exit(1);
}

const oldSection = css.substring(start, end);
console.log('FOUND SECTION LENGTH:', oldSection.length);
console.log('---START---');
console.log(oldSection.substring(0, 200));
console.log('---END---');
console.log(oldSection.substring(oldSection.length - 200));