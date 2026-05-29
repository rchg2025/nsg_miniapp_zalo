const fs = require('fs');
let c = fs.readFileSync('server/public/app.js', 'utf8');
const start = c.indexOf('async function fetchBanners()');
const end = c.indexOf('function openBannerModal()');
const oldCode = c.substring(start, end);

const newCode = `async function fetchBanners() {
  try {
    const res = await fetch(API_BASE + '/banners');
    const banners = await res.json();
    _bannersList = banners;
    filterBanners();
  } catch (err) {
    alert('Lỗi tải danh sách banner');
  }
}

function filterBanners() {
  const tbody = document.getElementById('banners-tbody');
  const qObj = document.getElementById('banner-search');
  const statusObj = document.getElementById('banner-filter-status');
  
  const q = (qObj?.value || '').toLowerCase();
  const status = statusObj?.value || 'all';

  if (!_bannersList) return;

  const filtered = _bannersList.filter(b => {
    const text = ((b.title || '') + ' ' + (b.link_url || '')).toLowerCase();
    if (q && !text.includes(q)) return false;
    if (status !== 'all' && b.status !== status) return false;
    return true;
  });

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">Không tìm thấy banner nào</td></tr>';
    return;
  }

  filtered.forEach((banner) => {
    const statusBadge = banner.status === 'active' 
      ? '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Hoạt động</span>'
      : '<span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Tạm ẩn</span>';
    
    const tr = document.createElement('tr');
    tr.className = 'border-b hover:bg-gray-50';
    tr.innerHTML = \`
      <td class="p-4">
        <img src="\${banner.image_url}" onerror="this.src='https://placehold.co/120x60?text=Error'" class="w-24 h-12 object-cover rounded shadow-sm">
      </td>
      <td class="p-4 font-medium">\${banner.title || ''}</td>
      <td class="p-4 text-sm text-gray-500 truncate max-w-[200px]">
        <a href="\${banner.link_url}" target="_blank" class="text-blue-500 hover:underline">\${banner.link_url ? banner.link_url : 'Trống'}</a>
      </td>
      <td class="p-4 text-center">\${banner.display_order || 0}</td>
      <td class="p-4">\${statusBadge}</td>
      <td class="p-4 text-right">
        <button onclick="editBanner('\${banner.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="Sửa"><i class="fa fa-edit"></i></button>
        <button onclick="deleteBanner('\${banner.id}')" class="text-red-600 hover:text-red-800" title="Xóa"><i class="fa fa-trash"></i></button>
      </td>
    \`;
    tbody.appendChild(tr);
  });
}

`;

if(oldCode && oldCode.trim() !== '') {
    c = c.replace(oldCode, newCode);
    fs.writeFileSync('server/public/app.js', c, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Could not find old code');
}
