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
