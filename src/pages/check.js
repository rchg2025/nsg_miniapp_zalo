const fs = require('fs'); const content = fs.readFileSync('src/pages/index.tsx', 'utf8'); console.log(content.substring(content.indexOf('useEffect(() => {'), content.indexOf('const MajorCard')));
