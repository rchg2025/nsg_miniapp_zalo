const API_BASE = '/api';

// =========== LOGIN & AUTH ===========
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        showApp();
    } else {
        showLogin();
    }
});

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    
    try {
        const res = await fetch(API_BASE + '/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            showApp();
        } else {
            errorEl.innerText = data.error || 'Đăng nhập thất bại';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.innerText = 'Lỗi kết nối máy chủ';
        errorEl.classList.remove('hidden');
    }
});

function showLogin() {
    if(document.getElementById('login-container')) document.getElementById('login-container').style.display = 'flex';
    if(document.getElementById('app-container')) document.getElementById('app-container').style.display = 'none';
}

function showApp() {
    if(document.getElementById('login-container')) document.getElementById('login-container').style.display = 'none';
    if(document.getElementById('app-container')) document.getElementById('app-container').style.display = 'flex';
    loadDashboard();
}

function logout() {
    localStorage.removeItem('adminToken');
    showLogin();
}

// Extracted to avoid replacing all
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(el => {
        el.classList.remove('bg-gray-800', 'text-white');
        el.classList.add('text-gray-400');
    });
    
    document.getElementById(tabId)?.classList.add('active');
    const activeTab = document.querySelector('.tab-link[data-target="' + tabId + '"]');
    if(activeTab) {
        activeTab.classList.add('bg-gray-800', 'text-white');
        activeTab.classList.remove('text-gray-400');
    }

    if(tabId === 'dashboard') loadDashboard();
    if(tabId === 'users') fetchUsers();
    if(tabId === 'settings') loadSettings();
}

let allUsers = [];

async function fetchUsers() {
    try {
        const res = await fetch(API_BASE + '/users');
        const users = await res.json();
        allUsers = users;
        const tbody = document.getElementById('users-tbody');
        if(!tbody) return;
        
        let html = '';
        users.forEach(u => {
            const roleText = u.role === 'admin' ? '<span class="text-red-600 font-bold">Admin</span>' : (u.role === 'manager' ? '<span class="text-purple-600 font-bold">Quản lý</span>' : 'Thành viên');
            html += '<tr class="border-b hover:bg-gray-50">';
            html += '<td class="p-4"><img src="' + (u.avatar || 'https://via.placeholder.com/40') + '" class="w-10 h-10 rounded-full"></td>';
            html += '<td class="p-4 font-medium text-gray-800">' + (u.name || '(Chưa cập nhật)') + '</td>';
            html += '<td class="p-4 text-gray-600">' + u.zalo_id + '</td>';
            html += '<td class="p-4 text-gray-600">' + (u.phone || '(Chưa có)') + '</td>';
            html += '<td class="p-4">' + roleText + '</td>';
            html += '<td class="p-4 text-right">';
            html += '<button onclick="openEditUser(' + u.id + ')" class="text-blue-500 hover:text-blue-700 mr-3"><i class="fa fa-edit"></i> Sửa</button>';
            html += '<button onclick="deleteUser(' + u.id + ')" class="text-red-500 hover:text-red-700"><i class="fa fa-trash"></i> Xóa</button>';
            html += '</td>';
            html += '</tr>';
        });
        tbody.innerHTML = html;
        
        const statUsers = document.getElementById('stat-users');
        if(statUsers) statUsers.innerText = users.length;
    } catch (e) { console.error('Lỗi lấy danh sách user', e); }
}

function openEditUser(id) {
    const u = allUsers.find(x => x.id === id);
    if(!u) return;
    document.getElementById('edit-user-id').value = u.id;
    document.getElementById('edit-user-name').value = u.name || '';
    document.getElementById('edit-user-phone').value = u.phone || '';
    document.getElementById('edit-user-role').value = u.role || 'user';
    document.getElementById('user-modal').classList.remove('hidden');
}

async function saveUser() {
    const id = document.getElementById('edit-user-id').value;
    const name = document.getElementById('edit-user-name').value;
    const phone = document.getElementById('edit-user-phone').value;
    const role = document.getElementById('edit-user-role').value;

    try {
        await fetch(API_BASE + '/users/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, role })
        });
        document.getElementById('user-modal').classList.add('hidden');
        fetchUsers();
    } catch(e) { alert('Lỗi: ' + e); }
}

async function deleteUser(id) {
    if(!confirm('Bạn có chắc muốn xóa thành viên này?')) return;
    try {
        await fetch(API_BASE + '/users/' + id, { method: 'DELETE' });
        fetchUsers();
    } catch(e) { alert('Lỗi: ' + e); }
}

async function loadSettings() {
    try {
        const res = await fetch(API_BASE + '/settings');
        const s = await res.json();
        document.getElementById('setting-drive-folder').value = s.drive_folder_id || '';
        document.getElementById('setting-drive-json').value = s.drive_json_key || '';
        document.getElementById('setting-smtp-host').value = s.smtp_host || '';
        document.getElementById('setting-smtp-port').value = s.smtp_port || '';
        document.getElementById('setting-smtp-user').value = s.smtp_user || '';
        document.getElementById('setting-smtp-pass').value = s.smtp_pass || '';
    } catch(e) {}
}

async function saveSettings() {
    const drive_folder_id = document.getElementById('setting-drive-folder').value;
    const drive_json_key = document.getElementById('setting-drive-json').value;
    const smtp_host = document.getElementById('setting-smtp-host').value;
    const smtp_port = document.getElementById('setting-smtp-port').value;
    const smtp_user = document.getElementById('setting-smtp-user').value;
    const smtp_pass = document.getElementById('setting-smtp-pass').value;

    try {
        await fetch(API_BASE + '/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drive_folder_id, drive_json_key, smtp_host, smtp_port, smtp_user, smtp_pass })
        });
        alert('Lưu cấu hình thành công!');
    } catch(e) { alert('Lỗi lưu cấu hình!'); }
}

async function fetchUsers() {
    try {
        const res = await fetch(API_BASE + '/users');
        const users = await res.json();
        const tbody = document.getElementById('users-tbody');
        if(!tbody) return;
        
        let html = '';
        users.forEach(u => {
            html += '<tr class="border-b hover:bg-gray-50">';
            html += '<td class="p-4"><img src="' + (u.avatar || 'https://via.placeholder.com/40') + '" class="w-10 h-10 rounded-full"></td>';
            html += '<td class="p-4 font-medium text-gray-800">' + (u.name || '(Chưa cập nhật)') + '</td>';
            html += '<td class="p-4 text-gray-600">' + u.zalo_id + '</td>';
            html += '<td class="p-4 text-gray-600">' + (u.phone || '(Chưa có)') + '</td>';
            html += '<td class="p-4"><span class="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">Hoạt động</span></td>';
            html += '</tr>';
        });
        tbody.innerHTML = html;
        
        const statUsers = document.getElementById('stat-users');
        if(statUsers) statUsers.innerText = users.length;
    } catch (e) {
        console.error('Lỗi lấy danh sách user', e);
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        fetchUsers();
    } catch (e) { console.error(e) }
}

