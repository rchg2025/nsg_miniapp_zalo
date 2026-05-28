const fs = require('fs');
let s = fs.readFileSync('server/public/app.js', 'utf8');
let m_start = s.indexOf('banners.forEach((banner) => {');
let m_end = s.indexOf('tbody.appendChild(tr);');
let part = s.substring(m_start, m_end);
part = part.replace(/\\/g, '`');
// Fix any ``or `\
s = s.substring(0, m_start) + part + s.substring(m_end);
fs.writeFileSync('server/public/app.js', s);
console.log('DONE');
