const fs = require('fs');
let s = fs.readFileSync('server/public/app.js', 'utf8');
const start = s.indexOf('LOGIN');
const end = s.indexOf('SIDEBAR', start);
console.log(s.substring(start - 100, end + 100));
