import codecs
content = codecs.open('server/public/app.js', 'r', 'utf8').read()
start_idx = content.find('tr.innerHTML = \\\\')
end_idx = content.find('\\\\;', start_idx) + 2

replacement = '''tr.innerHTML = \
        <td class=\"p-4\">
          <img src=\"\\" onerror=\"this.src='https://placehold.co/120x60?text=Error'\" class=\"w-24 h-12 object-cover rounded shadow-sm\">
        </td>
        <td class=\"p-4 font-medium\">\</td>
        <td class=\"p-4 text-sm text-gray-500 truncate max-w-[200px]\">
          <a href=\"\\" target=\"_blank\" class=\"text-blue-500 hover:underline\">\</a>
        </td>
        <td class=\"p-4 text-center\">\</td>
        <td class=\"p-4\">\</td>
        <td class=\"p-4 text-right\">
          <button onclick=\"editBanner(\)\" class=\"text-blue-600 hover:text-blue-800 mr-3\" title=\"Sửa\"><i class=\"fa fa-edit\"></i></button>
          <button onclick=\"deleteBanner(\)\" class=\"text-red-600 hover:text-red-800\" title=\"Xóa\"><i class=\"fa fa-trash\"></i></button>
        </td>
      \;'''

if start_idx != -1 and end_idx > start_idx + 2:
    new_content = content[:start_idx] + replacement + content[end_idx:]
    codecs.open('server/public/app.js', 'w', 'utf8').write(new_content)
    print('Done replacing.')
else:
    print('Pattern not found')
