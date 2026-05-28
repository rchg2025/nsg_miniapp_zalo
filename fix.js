const fs = require('fs');
let content = fs.readFileSync('server/public/app.js', 'utf8');

const sIdx = content.indexOf('tr.innerHTML = \\\\');
if (sIdx > -1) {
  const endMarker = '\\\\;';
  let eIdx = content.indexOf(endMarker, sIdx);
  if (eIdx > -1) {
     eIdx += endMarker.length;
     let replacement = 'tr.innerHTML = \\\n' +
        '        <td class="p-4">\\n' +
        '          <img src="\" onerror="this.src=\\'https://placehold.co/120x60?text=Error\\'" class="w-24 h-12 object-cover rounded shadow-sm">\\n' +
        '        </td>\\n' +
        '        <td class="p-4 font-medium">\</td>\\n' +
        '        <td class="p-4 text-sm text-gray-500 truncate max-w-[200px]">\\n' +
        '          <a href="\" target="_blank" class="text-blue-500 hover:underline">\</a>\\n' +
        '        </td>\\n' +
        '        <td class="p-4 text-center">\</td>\\n' +
        '        <td class="p-4">\</td>\\n' +
        '        <td class="p-4 text-right">\\n' +
        '          <button onclick="editBanner(\)" class="text-blue-600 hover:text-blue-800 mr-3" title="Sửa"><i class="fa fa-edit"></i></button>\\n' +
        '          <button onclick="deleteBanner(\)" class="text-red-600 hover:text-red-800" title="Xóa"><i class="fa fa-trash"></i></button>\\n' +
        '        </td>\\n' +
        '      \;';
     content = content.substring(0, sIdx) + replacement + content.substring(eIdx);
     fs.writeFileSync('server/public/app.js', content, 'utf8');
     console.log('Replaced by robust index');
  } else console.log('endMarker not found');
} else {
  console.log('sIdx not found');
}
