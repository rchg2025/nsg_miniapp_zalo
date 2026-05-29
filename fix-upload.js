const fs = require('fs');
let c = fs.readFileSync('server/public/app.js', 'utf8');

const oldCode = `      document.getElementById(targetInputId).value = data.url;
      if (nameEl) nameEl.textContent = '✓ ' + file.name;`;

const newCode = `      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = data.url;
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        targetInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (nameEl) nameEl.textContent = '✓ ' + file.name;`;

c = c.replace(oldCode, newCode);
fs.writeFileSync('server/public/app.js', c, 'utf8');
console.log('Upload fixed');
