const fs = require('fs');
let c = fs.readFileSync('src/components/bottom-navigation.tsx', 'utf8');
c = c.replace(/label: `Tin t.*?`\r\n/m, 'label: "Tin tức",\r\n');
c = c.replace(/,\s+\\{\s+\\s*id: "profile",.+2?\\}/m, '');
fs.writeFileSync('src/components/bottom-navigation.tsx', c);