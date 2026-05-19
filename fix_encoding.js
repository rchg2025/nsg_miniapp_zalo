const fs = require('fs');
const glob = require('glob'); // Not installed, I will use raw fs

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(dir + '/' + file).isDirectory()
      ? walkSync(dir + '/' + file, filelist)
      : filelist.concat(dir + '/' + file);
  });
  return filelist;
}

const files = walkSync('./src');
files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let raw = fs.readFileSync(file, 'binary');
    let str = Buffer.from(raw, 'binary').toString('utf8');
    // If it still looks weird, it might have been saved as utf8 after being decoded as latin1
    // A trick to fix powershell mangling:
    if (str.includes('Ã')) {
        let fixed = Buffer.from(str, 'latin1').toString('utf8');
        fs.writeFileSync(file, fixed, 'utf8');
        console.log("Fixed", file);
    }
  }
});
