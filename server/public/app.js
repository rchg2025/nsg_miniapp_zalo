const API_BASE = 'https://nsg-miniapp-zalo-ipia.vercel.app/api';
let currentUser = null;
let _admissionsList = [];
let _majorsList = [];
let _newsList = [];

// ===================== AUTH =====================

function toggleLoginPassword() {
  const input = document.getElementById('password');
  const icon = document.getElementById('toggle-pw-icon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text');
  const btn = document.getElementById('login-btn');
  errEl.classList.add('hidden');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Đang đăng nhập...</span>';
  try {
    const res = await fetch(API_BASE + '/system_users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      errText.textContent = data.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Đăng Nhập</span>';
      return;
    }
    currentUser = data.user;
    localStorage.setItem('admin_session', JSON.stringify(currentUser));
    document.getElementById('admin-name').textContent = currentUser.display_name || currentUser.username;
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    applyRoleVisibility();
    loadDashboard();
  } catch (err) {
    errText.textContent = 'Không thể kết nối máy chủ. Vui lòng thử lại sau.';
    errEl.classList.remove('hidden');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Đăng Nhập</span>';
  }
});

function applyRoleVisibility() {
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');
  const adminOnlyNavs = ['nav-system-users', 'nav-settings'];
  adminOnlyNavs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.parentElement.style.display = isAdmin ? '' : 'none';
  });
}

function logout() {
  currentUser = null;
  localStorage.removeItem('admin_session');
  document.getElementById('app-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

// ===================== FORGOT PASSWORD =====================

let _forgotUsername = '';
let _forgotOtp = '';
let _resendTimer = null;

function openForgotPassword() {
  document.getElementById('forgot-modal').classList.remove('hidden');
  resetForgotModal();
}

function closeForgotPassword() {
  document.getElementById('forgot-modal').classList.add('hidden');
  if (_resendTimer) { clearInterval(_resendTimer); _resendTimer = null; }
}

function resetForgotModal() {
  _forgotUsername = '';
  _forgotOtp = '';
  // Show step 1
  ['forgot-step-1','forgot-step-2','forgot-step-3','forgot-step-success'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('forgot-step-1').classList.remove('hidden');
  document.getElementById('forgot-username').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  document.getElementById('forgot-error-1').classList.add('hidden');
  document.getElementById('forgot-error-2').classList.add('hidden');
  document.getElementById('forgot-error-3').classList.add('hidden');
  // OTP inputs
  document.querySelectorAll('.otp-digit').forEach(el => el.value = '');
  setForgotStep(1);
}

function setForgotStep(step) {
  const titles = ['', 'Quên Mật Khẩu', 'Xác Nhận OTP', 'Mật Khẩu Mới'];
  const subs = ['', 'Nhập tên đăng nhập để nhận mã OTP', 'Nhập mã OTP đã được gửi đến email', 'Tạo mật khẩu mới cho tài khoản'];
  document.getElementById('forgot-modal-title').textContent = titles[step] || 'Quên Mật Khẩu';
  document.getElementById('forgot-modal-subtitle').textContent = subs[step] || '';
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById('step-dot-' + i);
    if (i < step) {
      dot.style.background = '#16a34a';
      dot.innerHTML = '<i class="fa-solid fa-check" style="font-size:11px"></i>';
    } else if (i === step) {
      dot.style.background = '#dc2626';
      dot.textContent = i;
    } else {
      dot.style.background = '#d1d5db';
      dot.style.color = '#9ca3af';
      dot.textContent = i;
    }
  }
}

function forgotGoBack(fromStep) {
  ['forgot-step-1','forgot-step-2','forgot-step-3'].forEach(id => document.getElementById(id).classList.add('hidden'));
  const targetStep = fromStep; // going back means showing fromStep (the previous one)
  document.getElementById('forgot-step-' + fromStep).classList.remove('hidden');
  setForgotStep(fromStep);
}

async function submitForgotStep1() {
  const username = document.getElementById('forgot-username').value.trim();
  const errEl = document.getElementById('forgot-error-1');
  const btn = document.getElementById('forgot-btn-1');
  errEl.classList.add('hidden');
  if (!username) { errEl.textContent = 'Vui lòng nhập tên đăng nhập'; errEl.classList.remove('hidden'); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
  try {
    const res = await fetch(API_BASE + '/system_users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      errEl.textContent = data.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      errEl.classList.remove('hidden');
    } else {
      _forgotUsername = username;
      document.getElementById('forgot-otp-sent-msg').textContent = data.message;
      document.getElementById('forgot-step-1').classList.add('hidden');
      document.getElementById('forgot-step-2').classList.remove('hidden');
      setForgotStep(2);
      // Focus first OTP digit
      const digits = document.querySelectorAll('.otp-digit');
      if (digits[0]) digits[0].focus();
      startResendTimer();
    }
  } catch (err) {
    errEl.textContent = 'Không thể kết nối máy chủ. Vui lòng thử lại.';
    errEl.classList.remove('hidden');
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi mã OTP';
}

async function submitForgotStep2() {
  const otp = Array.from(document.querySelectorAll('.otp-digit')).map(el => el.value).join('');
  const errEl = document.getElementById('forgot-error-2');
  const btn = document.getElementById('forgot-btn-2');
  errEl.classList.add('hidden');
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    errEl.textContent = 'Vui lòng nhập đủ 6 chữ số OTP';
    errEl.classList.remove('hidden');
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xác nhận...';
  try {
    const res = await fetch(API_BASE + '/system_users/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: _forgotUsername, otp })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      errEl.textContent = data.message || 'Mã OTP không đúng';
      errEl.classList.remove('hidden');
    } else {
      _forgotOtp = otp;
      if (_resendTimer) { clearInterval(_resendTimer); _resendTimer = null; }
      document.getElementById('forgot-step-2').classList.add('hidden');
      document.getElementById('forgot-step-3').classList.remove('hidden');
      setForgotStep(3);
      document.getElementById('new-password').focus();
    }
  } catch (err) {
    errEl.textContent = 'Không thể kết nối máy chủ. Vui lòng thử lại.';
    errEl.classList.remove('hidden');
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Xác nhận';
}

async function submitForgotStep3() {
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errEl = document.getElementById('forgot-error-3');
  const btn = document.getElementById('forgot-btn-3');
  errEl.classList.add('hidden');
  if (!newPassword || newPassword.length < 6) {
    errEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
    errEl.classList.remove('hidden');
    return;
  }
  if (newPassword !== confirmPassword) {
    errEl.textContent = 'Xác nhận mật khẩu không khớp';
    errEl.classList.remove('hidden');
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang cập nhật...';
  try {
    const res = await fetch(API_BASE + '/system_users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: _forgotUsername, otp: _forgotOtp, newPassword })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      errEl.textContent = data.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      errEl.classList.remove('hidden');
    } else {
      document.getElementById('forgot-step-3').classList.add('hidden');
      document.getElementById('forgot-step-success').classList.remove('hidden');
    }
  } catch (err) {
    errEl.textContent = 'Không thể kết nối máy chủ. Vui lòng thử lại.';
    errEl.classList.remove('hidden');
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Đặt lại mật khẩu';
}

async function resendOtp() {
  if (!_forgotUsername) return;
  const btn = document.getElementById('resend-btn');
  btn.disabled = true;
  try {
    const res = await fetch(API_BASE + '/system_users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: _forgotUsername })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('forgot-otp-sent-msg').textContent = data.message;
      document.querySelectorAll('.otp-digit').forEach(el => el.value = '');
      document.getElementById('forgot-error-2').classList.add('hidden');
      startResendTimer();
    }
  } catch (e) {}
}

function startResendTimer() {
  if (_resendTimer) clearInterval(_resendTimer);
  let secs = 60;
  const btn = document.getElementById('resend-btn');
  const timerEl = document.getElementById('resend-timer');
  btn.disabled = true;
  timerEl.textContent = ` (${secs}s)`;
  _resendTimer = setInterval(() => {
    secs--;
    timerEl.textContent = ` (${secs}s)`;
    if (secs <= 0) {
      clearInterval(_resendTimer);
      _resendTimer = null;
      btn.disabled = false;
      timerEl.textContent = '';
    }
  }, 1000);
}

// OTP input: auto-advance and allow backspace navigation
document.addEventListener('DOMContentLoaded', function() {
  const digits = document.querySelectorAll('.otp-digit');
  digits.forEach((input, idx) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && idx < digits.length - 1) digits[idx + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) digits[idx - 1].focus();
      if (e.key === 'Enter') submitForgotStep2();
    });
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((ch, i) => { if (digits[i]) digits[i].value = ch; });
      if (digits[Math.min(pasted.length, digits.length - 1)]) digits[Math.min(pasted.length, digits.length - 1)].focus();
    });
  });
});

// ===================== NAVIGATION =====================

const TAB_TITLES = {
  dashboard: 'Bảng Điều Khiển',
  'zalo-users': 'Thành Viên Zalo',
  'system-users': 'Thành Viên Hệ Thống',
  news: 'Quản Lý Tin Tức',
  majors: 'Quản Lý Ngành Học',
  categories: 'Danh Mục',
  admissions: 'Đăng Ký Tuyển Sinh',
  settings: 'Cấu Hình Hệ Thống'
};

const TAB_LOADERS = {
  dashboard: loadDashboard,
  'zalo-users': fetchZaloUsers,
  'system-users': fetchSysUsers,
  news: fetchNews,
  majors: fetchAdminMajors,
  categories: () => { fetchCategories(); fetchTraining(); },
  admissions: fetchAdmissions,
  settings: loadSettings
};

const ADMIN_ONLY_TABS = ['system-users', 'settings'];

function switchTab(tabId) {
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');
  if (ADMIN_ONLY_TABS.includes(tabId) && !isAdmin) return false;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('[id^="nav-"]').forEach(el => {
    el.classList.remove('bg-gray-800', 'text-white');
    el.classList.add('text-gray-400');
  });
  const tab = document.getElementById(tabId);
  const nav = document.getElementById('nav-' + tabId);
  if (tab) tab.classList.add('active');
  if (nav) { nav.classList.add('bg-gray-800', 'text-white'); nav.classList.remove('text-gray-400'); }
  document.getElementById('page-title').textContent = TAB_TITLES[tabId] || '';
  if (TAB_LOADERS[tabId]) TAB_LOADERS[tabId]();
  return false;
}

function switchSubTab(subTabId, btn) {
  const parent = btn.closest('.tab-content');
  parent.querySelectorAll('.sub-tab-content').forEach(el => el.classList.remove('active'));
  parent.querySelectorAll('.sub-tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(subTabId).classList.add('active');
  btn.classList.add('active');
}

// ===================== DASHBOARD =====================

async function loadDashboard() {
  try {
    const [usersRes, newsRes, majorsRes, admissionsRes] = await Promise.all([
      fetch(API_BASE + '/users'),
      fetch(API_BASE + '/news'),
      fetch(API_BASE + '/majors'),
      fetch(API_BASE + '/admissions')
    ]);
    const [users, news, majors, admissions] = await Promise.all([
      usersRes.json(), newsRes.json(), majorsRes.json(), admissionsRes.json()
    ]);
    document.getElementById('stat-users').textContent = Array.isArray(users) ? users.length : '-';
    document.getElementById('stat-news').textContent = Array.isArray(news) ? news.length : '-';
    document.getElementById('stat-majors').textContent = Array.isArray(majors) ? majors.length : '-';
    document.getElementById('stat-admissions').textContent = Array.isArray(admissions) ? admissions.length : '-';
    // Cache for dashboard admission list
    if (Array.isArray(majors)) _majorsList = majors;
    if (Array.isArray(admissions)) {
      _admissionsList = admissions.map(a => {
        if (!a.major_name && a.major_code) {
          const major = _majorsList.find(m => m.code === a.major_code || m.id == a.major_code);
          if (major) a.major_name = major.name;
        }
        return a;
      });
    }
    // Populate major filter dropdown
    const majorSel = document.getElementById('dash-adm-major');
    if (majorSel && Array.isArray(majors)) {
      let opts = '<option value="all">Tất cả ngành</option>';
      majors.forEach(m => { opts += `<option value="${esc(m.name)}">${esc(m.name)}</option>`; });
      majorSel.innerHTML = opts;
    }
    loadDashAdmissions();
  } catch (e) { console.warn('Dashboard load error:', e); }
}

// ===================== DASHBOARD ADMISSIONS =====================
let _dashAdmPage = 1;
let _dashAdmFiltered = [];
const DASH_ADM_PAGE_SIZE = 10;

function loadDashAdmissions() { filterDashAdmissions(); }

function filterDashAdmissions() {
  const q = (document.getElementById('dash-adm-search')?.value || '').toLowerCase();
  const status = document.getElementById('dash-adm-status')?.value || 'all';
  const major = document.getElementById('dash-adm-major')?.value || 'all';
  _dashAdmFiltered = _admissionsList.filter(a => {
    const txt = [a.student_name, a.phone, a.major_name, a.major_code].join(' ').toLowerCase();
    if (q && !txt.includes(q)) return false;
    if (status !== 'all' && a.status !== status) return false;
    if (major !== 'all' && (a.major_name || a.major_code) !== major) return false;
    return true;
  });
  _dashAdmPage = 1;
  renderDashAdmissions();
}

function renderDashAdmissions() {
  const tbody = document.getElementById('dash-adm-tbody');
  if (!tbody) return;
  const total = _dashAdmFiltered.length;
  const totalPages = Math.ceil(total / DASH_ADM_PAGE_SIZE) || 1;
  if (_dashAdmPage > totalPages) _dashAdmPage = totalPages;
  const start = (_dashAdmPage - 1) * DASH_ADM_PAGE_SIZE;
  const page = _dashAdmFiltered.slice(start, start + DASH_ADM_PAGE_SIZE);
  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-3 text-center text-gray-400">Chưa có đăng ký tuyển sinh</td></tr>';
  } else {
    tbody.innerHTML = page.map(a => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-3 font-medium">${esc(a.student_name || '')}</td>
        <td class="p-3">${esc(a.phone || '')}</td>
        <td class="p-3">${esc(a.major_name || a.major_code || '')}</td>
        <td class="p-3"><span class="px-2 py-1 rounded text-xs font-semibold ${a.status === 'approved' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">${a.status === 'approved' ? 'Đã duyệt' : a.status === 'rejected' ? 'Từ chối' : 'Chờ xử lý'}</span></td>
        <td class="p-3 text-gray-500">${fmtDate(a.created_at)}</td>
        <td class="p-3 text-right"><button onclick="viewAdmission(${a.id})" class="text-blue-600 hover:underline text-sm">Chi tiết</button></td>
      </tr>`).join('');
  }
  const pag = document.getElementById('dash-adm-pagination');
  if (pag) {
    pag.innerHTML = `
      <span>Hiển thị ${total ? start + 1 : 0}–${Math.min(start + DASH_ADM_PAGE_SIZE, total)} / ${total} hồ sơ</span>
      <div class="flex gap-2">
        <button onclick="dashAdmGoPage(${_dashAdmPage - 1})" ${_dashAdmPage <= 1 ? 'disabled' : ''} class="px-3 py-1 rounded border ${_dashAdmPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}">← Trước</button>
        <span class="px-3 py-1">Trang ${_dashAdmPage} / ${totalPages}</span>
        <button onclick="dashAdmGoPage(${_dashAdmPage + 1})" ${_dashAdmPage >= totalPages ? 'disabled' : ''} class="px-3 py-1 rounded border ${_dashAdmPage >= totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}">Sau →</button>
      </div>`;
  }
}

function dashAdmGoPage(page) {
  const totalPages = Math.ceil(_dashAdmFiltered.length / DASH_ADM_PAGE_SIZE) || 1;
  if (page < 1 || page > totalPages) return;
  _dashAdmPage = page;
  renderDashAdmissions();
}

// ===================== ZALO USERS =====================

async function fetchZaloUsers() {
  const tbody = document.getElementById('zalo-users-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/users');
    const users = await res.json();
    if (!users.length) { tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-gray-400">Chưa có thành viên</td></tr>'; return; }
    tbody.innerHTML = users.map(u => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-4"><img src="${u.avatar || 'https://placehold.co/40x40'}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='https://placehold.co/40x40'"></td>
        <td class="p-4 font-medium">${esc(u.name || u.display_name || '')}</td>
        <td class="p-4 text-xs text-gray-500">${esc(u.zalo_id || u.id || '')}</td>
        <td class="p-4">${esc(u.phone || '')}</td>
        <td class="p-4"><span class="px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}">${esc(u.role || 'user')}</span></td>
        <td class="p-4 text-sm text-gray-500">${fmtDate(u.created_at)}</td>
        <td class="p-4 text-right"><button onclick="openZaloUserModal(${JSON.stringify(u).replace(/"/g,'&quot;')})" class="text-blue-600 hover:underline text-sm mr-2">Sửa</button></td>
      </tr>`).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

function openZaloUserModal(user) {
  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-user-name').value = user.name || user.display_name || '';
  document.getElementById('edit-user-phone').value = user.phone || '';
  document.getElementById('edit-user-role').value = user.role || 'user';
  document.getElementById('zalo-user-modal').classList.remove('hidden');
}

async function saveZaloUser() {
  const id = document.getElementById('edit-user-id').value;
  const payload = {
    name: document.getElementById('edit-user-name').value,
    phone: document.getElementById('edit-user-phone').value,
    role: document.getElementById('edit-user-role').value
  };
  try {
    await fetch(API_BASE + '/users/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    document.getElementById('zalo-user-modal').classList.add('hidden');
    fetchZaloUsers();
  } catch (e) { alert('Lỗi lưu thành viên'); }
}

// ===================== SYSTEM USERS =====================

async function fetchSysUsers() {
  const tbody = document.getElementById('sys-users-tbody');
  tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/system_users');
    if (!res.ok) { tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu: ' + res.status + '</td></tr>'; return; }
    const users = await res.json();
    if (!Array.isArray(users) || !users.length) { tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-400">Chưa có tài khoản</td></tr>'; return; }
    tbody.innerHTML = users.map(u => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-4 font-medium">${esc(u.username)}</td>
        <td class="p-4">${esc(u.display_name || '')}</td>
        <td class="p-4"><span class="px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">${esc(u.role)}</span></td>
        <td class="p-4"><span class="px-2 py-1 rounded text-xs font-semibold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">${u.is_active ? 'Hoạt động' : 'Vô hiệu'}</span></td>
        <td class="p-4 text-sm text-gray-500">${fmtDate(u.created_at)}</td>
        <td class="p-4 text-right">
          <button onclick="openSysUserModal(${JSON.stringify(u).replace(/"/g,'&quot;')})" class="text-blue-600 hover:underline text-sm mr-2">Sửa</button>
          <button onclick="deleteSysUser(${u.id})" class="text-red-600 hover:underline text-sm">Xóa</button>
        </td>
      </tr>`).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

function openSysUserModal(user) {
  user = user || {};
  document.getElementById('sys-user-id').value = user.id || '';
  document.getElementById('sys-user-username').value = user.username || '';
  document.getElementById('sys-user-password').value = '';
  document.getElementById('sys-user-display').value = user.display_name || '';
  document.getElementById('sys-user-email').value = user.email || '';
  document.getElementById('sys-user-role').value = user.role || 'editor';
  document.getElementById('sys-user-active').value = user.is_active !== false ? 'true' : 'false';
  document.getElementById('sys-user-modal').classList.remove('hidden');
}

async function saveSysUser() {
  const id = document.getElementById('sys-user-id').value;
  const payload = {
    username: document.getElementById('sys-user-username').value.trim(),
    display_name: document.getElementById('sys-user-display').value.trim(),
    email: document.getElementById('sys-user-email').value.trim() || null,
    role: document.getElementById('sys-user-role').value,
    is_active: document.getElementById('sys-user-active').value === 'true'
  };
  const pw = document.getElementById('sys-user-password').value;
  if (pw) payload.password = pw;
  if (!payload.username) { alert('Vui lòng nhập tên đăng nhập'); return; }
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? API_BASE + '/system_users/' + id : API_BASE + '/system_users';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    document.getElementById('sys-user-modal').classList.add('hidden');
    fetchSysUsers();
  } catch (e) { alert('Lỗi lưu tài khoản'); }
}

async function deleteSysUser(id) {
  if (!confirm('Xóa tài khoản này?')) return;
  await fetch(API_BASE + '/system_users/' + id, { method: 'DELETE' });
  fetchSysUsers();
}

// ===================== NEWS =====================

async function fetchNews() {
  const tbody = document.getElementById('news-tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/news');
    const news = await res.json();
    if (!news.length) { tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-gray-400">Chưa có tin tức</td></tr>'; return; }
    _newsList = news;
    tbody.innerHTML = news.map(n => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-4">
          ${(n.image_url || n.image)
            ? `<img src="${esc(n.image_url || n.image)}" class="w-16 h-10 object-cover rounded" onerror="this.parentElement.innerHTML='<span class=\'text-xs text-gray-400\'>Ch\u01b0a c\u00f3 ảnh</span>'">`
            : '<span class="text-xs text-gray-400">Chưa có ảnh</span>'}
        </td>
        <td class="p-4 font-medium max-w-xs truncate">${esc(n.title)}</td>
        <td class="p-4"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">${esc(n.category || '')}</span></td>
        <td class="p-4 text-sm text-gray-500">${fmtDate(n.created_at)}</td>
        <td class="p-4 text-right">
          <button onclick="previewNews(${n.id})" class="text-gray-500 hover:underline text-sm mr-2">Xem</button>
          <button onclick="editNews(${n.id})" class="text-blue-600 hover:underline text-sm mr-2">Sửa</button>
          <button onclick="deleteNews(${n.id})" class="text-red-600 hover:underline text-sm">Xóa</button>
        </td>
      </tr>`).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

function editNews(id) { const n = _newsList.find(x => x.id == id); if (n) openNewsModal(n); }

function previewNews(id) {
  const n = _newsList.find(x => x.id == id);
  if (!n) return;
  document.getElementById('news-preview-title').textContent = n.title || '';
  document.getElementById('news-preview-body').innerHTML = `
    ${(n.image_url || n.image) ? `<img src="${esc(n.image_url || n.image)}" class="w-full h-48 object-cover rounded-lg mb-4" onerror="this.style.display='none'">` : ''}
    <div class="flex gap-2 mb-3">
      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">${esc(n.category || '')}</span>
      <span class="text-xs text-gray-400">${fmtDate(n.created_at)}</span>
    </div>
    <div class="prose text-sm text-gray-700 leading-relaxed">${n.content || '<em>Không có nội dung</em>'}</div>
  `;
  document.getElementById('news-preview-modal').classList.remove('hidden');
}

function openNewsModal(news) {
  news = news || {};
  document.getElementById('news-id').value = news.id || '';
  document.getElementById('news-title').value = news.title || '';
  document.getElementById('news-category').value = news.category || 'Tin Tức';
  document.getElementById('news-image').value = news.image_url || news.image || '';
  document.getElementById('news-content').value = news.content || '';
  document.getElementById('news-drop-name').textContent = '';
  // Show modal first so Jodit has visible DOM
  document.getElementById('news-modal').classList.remove('hidden');
  // Set Jodit value after modal is visible
  setTimeout(() => {
    if (window.newsEditor) window.newsEditor.value = news.content || '';
  }, 80);
}

async function saveNews() {
  const id = document.getElementById('news-id').value;
  const payload = {
    title: document.getElementById('news-title').value.trim(),
    category: document.getElementById('news-category').value,
    image_url: document.getElementById('news-image').value.trim(),
    content: (window.newsEditor ? window.newsEditor.value : document.getElementById('news-content').value).trim()
  };
  if (!payload.title) { alert('Vui lòng nhập tiêu đề'); return; }
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? API_BASE + '/news/' + id : API_BASE + '/news';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    document.getElementById('news-modal').classList.add('hidden');
    fetchNews();
  } catch (e) { alert('Lỗi lưu tin tức'); }
}

async function deleteNews(id) {
  if (!confirm('Xóa tin tức này?')) return;
  await fetch(API_BASE + '/news/' + id, { method: 'DELETE' });
  fetchNews();
}

// ===================== MAJORS =====================

async function fetchAdminMajors() {
  const tbody = document.getElementById('majors-tbody');
  tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/majors');
    if (!res.ok) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu (' + res.status + ')</td></tr>'; return; }
    const majors = await res.json();
    if (!Array.isArray(majors) || !majors.length) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">Chưa có ngành học</td></tr>'; return; }
    _majorsList = majors;
    tbody.innerHTML = majors.map(m => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-4 font-mono text-sm">${esc(m.code || '')}</td>
        <td class="p-4 font-medium">
          <div class="flex items-center gap-2">
            ${m.image_url ? `<img src="${esc(m.image_url)}" class="w-10 h-10 rounded object-cover flex-shrink-0" onerror="this.style.display='none'">` : '<div class="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 text-lg">📚</div>'}
            <span>${esc(m.name)}</span>
          </div>
        </td>
        <td class="p-4 text-sm text-gray-600 max-w-xs truncate">${esc(stripHtml(m.description || ''))}</td>
        <td class="p-4 text-right">
          <button onclick="previewMajor(${m.id})" class="text-gray-500 hover:underline text-sm mr-2">Xem</button>
          <button onclick="editMajor(${m.id})" class="text-blue-600 hover:underline text-sm mr-2">Sửa</button>
          <button onclick="deleteMajor(${m.id})" class="text-red-600 hover:underline text-sm">Xóa</button>
        </td>
      </tr>`).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

function editMajor(id) {
  const m = _majorsList.find(x => x.id == id);
  if (m) openMajorModal(m);
}

function previewMajor(id) {
  const m = _majorsList.find(x => x.id == id);
  if (!m) return;
  const modal = document.getElementById('major-preview-modal');
  document.getElementById('major-preview-title').textContent = m.name || '';
  document.getElementById('major-preview-body').innerHTML = `
    <div class="space-y-3 text-sm">
      <div class="grid grid-cols-2 gap-3">
        <div><span class="font-semibold text-gray-600">Mã ngành:</span><br>${esc(m.code || '')}</div>
        <div><span class="font-semibold text-gray-600">Hệ đào tạo:</span><br>${esc(m.education_level || '')}</div>
        <div><span class="font-semibold text-gray-600">Thời gian:</span><br>${esc(m.duration || '')}</div>
        <div><span class="font-semibold text-gray-600">Học phí:</span><br>${esc(m.tuition_fee || '')}</div>
      </div>
      ${m.image_url ? `<div><img src="${esc(m.image_url)}" class="w-full max-h-40 object-cover rounded" onerror="this.style.display='none'"></div>` : ''}
      ${m.description ? `<div><span class="font-semibold text-gray-600">Mô tả:</span><div class="mt-1 prose prose-sm max-w-none border rounded p-3 bg-gray-50 max-h-40 overflow-y-auto">${m.description}</div></div>` : ''}
      ${m.subjects ? `<div><span class="font-semibold text-gray-600">Môn thi:</span><br>${esc(m.subjects)}</div>` : ''}
      ${m.career_prospects ? `<div><span class="font-semibold text-gray-600">Triển vọng nghề:</span><div class="mt-1 prose prose-sm max-w-none border rounded p-3 bg-gray-50 max-h-32 overflow-y-auto">${m.career_prospects}</div></div>` : ''}
    </div>
  `;
  modal.classList.remove('hidden');
}

async function populateMajorLevelSelect(selectedValue) {
  const sel = document.getElementById('major-level');
  try {
    const res = await fetch(API_BASE + '/training_systems');
    const list = await res.json();
    sel.innerHTML = '<option value="">-- Chọn hệ đào tạo --</option>';
    list.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = t.name;
      if (t.name === selectedValue) opt.selected = true;
      sel.appendChild(opt);
    });
  } catch (e) {
    console.warn('Không tải được danh mục hệ đào tạo:', e);
  }
}

function openMajorModal(major) {
  major = major || {};
  document.getElementById('major-id').value = major.id || '';
  document.getElementById('major-code').value = major.code || '';
  document.getElementById('major-name').value = major.name || '';
  document.getElementById('major-image').value = major.image_url || major.image || '';
  document.getElementById('major-duration').value = major.duration || '';
  document.getElementById('major-tuition').value = major.tuition_fee || '';
  populateMajorLevelSelect(major.education_level || '');
  document.getElementById('major-subjects').value = major.subjects || '';
  document.getElementById('major-career').value = major.career_prospects || '';
  document.getElementById('major-website').value = major.website || '';
  document.getElementById('major-description').value = major.description || '';
  document.getElementById('major-requirements').value = major.requirements || '';
  document.getElementById('major-drop-name').textContent = '';
  // Hiển thị modal trước để Jodit có DOM visible
  document.getElementById('major-modal').classList.remove('hidden');
  // Sau đó mới set nội dung Jodit (cần modal visible để render đúng)
  setTimeout(() => {
    if (window.majorDescEditor) window.majorDescEditor.value = major.description || '';
    if (window.majorCareerEditor) window.majorCareerEditor.value = major.career_prospects || '';
  }, 80);
}

async function saveMajor() {
  const id = document.getElementById('major-id').value;
  const payload = {
    code: document.getElementById('major-code').value.trim(),
    name: document.getElementById('major-name').value.trim(),
    image: document.getElementById('major-image').value.trim(),
    
      description: (window.majorDescEditor ? window.majorDescEditor.value : document.getElementById('major-description').value).trim(),
      duration: document.getElementById('major-duration').value.trim(),
      tuition_fee: document.getElementById('major-tuition').value.trim(),
      education_level: document.getElementById('major-level').value.trim(),
      subjects: document.getElementById('major-subjects').value.trim(),
      career_prospects: (window.majorCareerEditor ? window.majorCareerEditor.value : document.getElementById('major-career').value).trim(),
      website: document.getElementById('major-website').value.trim(),
    requirements: document.getElementById('major-requirements').value.trim()
  };
  if (!payload.name) { alert('Vui lòng nhập tên ngành'); return; }
  if (!payload.code) { alert('Vui lòng nhập mã ngành'); return; }
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? API_BASE + '/majors/' + id : API_BASE + '/majors';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Lỗi lưu ngành học: ' + (err.error || res.status));
      return;
    }
    document.getElementById('major-modal').classList.add('hidden');
    fetchAdminMajors();
  } catch (e) { alert('Lỗi lưu ngành học: ' + e.message); }
}

async function deleteMajor(id) {
  if (!confirm('Xóa ngành học này?')) return;
  await fetch(API_BASE + '/majors/' + id, { method: 'DELETE' });
  fetchAdminMajors();
}

// ===================== CATEGORIES =====================

async function fetchCategories() {
  const tbody = document.getElementById('categories-tbody');
  tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/categories');
    const cats = await res.json();
    if (!cats.length) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">Chưa có chuyên mục</td></tr>'; return; }
    tbody.innerHTML = cats.map(c => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-4 font-medium">${esc(c.name)}</td>
        <td class="p-4 font-mono text-sm text-gray-500">${esc(c.slug || '')}</td>
        <td class="p-4 text-sm text-gray-500">${fmtDate(c.created_at)}</td>
        <td class="p-4 text-right">
          <button onclick="deleteCategory(${c.id})" class="text-red-600 hover:underline text-sm">Xóa</button>
        </td>
      </tr>`).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

async function saveCategory() {
  const payload = {
    name: document.getElementById('cat-name').value.trim(),
    slug: document.getElementById('cat-slug').value.trim()
  };
  if (!payload.name) { alert('Vui lòng nhập tên chuyên mục'); return; }
  try {
    await fetch(API_BASE + '/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    document.getElementById('category-modal').classList.add('hidden');
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-slug').value = '';
    fetchCategories();
  } catch (e) { alert('Lỗi lưu chuyên mục'); }
}

async function deleteCategory(id) {
  if (!confirm('Xóa chuyên mục này?')) return;
  await fetch(API_BASE + '/categories/' + id, { method: 'DELETE' });
  fetchCategories();
}

// ===================== TRAINING SYSTEMS =====================

async function fetchTraining() {
  const tbody = document.getElementById('training-tbody');
  tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/training_systems');
    const list = await res.json();
    if (!list.length) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">Chưa có hệ đào tạo</td></tr>'; return; }
    tbody.innerHTML = list.map(t => `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-4 font-medium">${esc(t.name)}</td>
        <td class="p-4 text-sm text-gray-600">${esc(t.description || '')}</td>
        <td class="p-4 text-sm text-gray-500">${fmtDate(t.created_at)}</td>
        <td class="p-4 text-right">
          <button onclick="deleteTraining(${t.id})" class="text-red-600 hover:underline text-sm">Xóa</button>
        </td>
      </tr>`).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

async function saveTraining() {
  const payload = {
    name: document.getElementById('training-name').value.trim(),
    description: document.getElementById('training-description').value.trim()
  };
  if (!payload.name) { alert('Vui lòng nhập tên hệ đào tạo'); return; }
  try {
    await fetch(API_BASE + '/training_systems', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    document.getElementById('training-modal').classList.add('hidden');
    document.getElementById('training-name').value = '';
    document.getElementById('training-description').value = '';
    fetchTraining();
  } catch (e) { alert('Lỗi lưu hệ đào tạo'); }
}

async function deleteTraining(id) {
  if (!confirm('Xóa hệ đào tạo này?')) return;
  await fetch(API_BASE + '/training_systems/' + id, { method: 'DELETE' });
  fetchTraining();
}

// ===================== ADMISSIONS =====================

async function fetchAdmissions() {
  const tbody = document.getElementById('admissions-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-gray-400 text-center">Đang tải...</td></tr>';
  try {
    const res = await fetch(API_BASE + '/admissions');
    const list = await res.json();
    if (!Array.isArray(list) || !list.length) { tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-gray-400">Chưa có đăng ký</td></tr>'; return; }
    
    if (!_majorsList || !_majorsList.length) {
      try {
        const mRes = await fetch(API_BASE + '/majors');
        const mList = await mRes.json();
        if (Array.isArray(mList)) _majorsList = mList;
      } catch(e) {}
    }

    // Map major_name from _majorsList if possible
    _admissionsList = list.map(a => {
      if (!a.major_name && a.major_code) {
        const major = _majorsList.find(m => m.code === a.major_code || m.id == a.major_code);
        if (major) a.major_name = major.name;
      }
      return a;
    });
    
    renderAdmissions(_admissionsList);
  } catch (e) { tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-red-500 text-center">Lỗi tải dữ liệu</td></tr>'; }
}

function renderAdmissions(list) {
  const tbody = document.getElementById('admissions-tbody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-gray-400">Không tìm thấy kết quả</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(a => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-4 font-medium">${esc(a.student_name || '')}</td>
      <td class="p-4">${esc(a.phone || '')}</td>
      <td class="p-4">${esc(a.id_card || '')}</td>
      <td class="p-4">${esc(a.major_name || a.major_code || '')}</td>
      <td class="p-4"><span class="px-2 py-1 rounded text-xs font-semibold ${a.status === 'approved' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">${a.status === 'approved' ? 'Đã duyệt' : a.status === 'rejected' ? 'Từ chối' : 'Chờ xử lý'}</span></td>
      <td class="p-4 text-sm text-gray-500">${fmtDate(a.created_at)}</td>
      <td class="p-4 text-right flex gap-2 justify-end">
        <button onclick="viewAdmission(${a.id})" class="text-blue-600 hover:underline text-sm">Chi tiết</button>
        <button onclick="updateAdmissionStatus(${a.id},'approved')" class="text-green-600 hover:underline text-sm">Duyệt</button>
        <button onclick="updateAdmissionStatus(${a.id},'rejected')" class="text-red-600 hover:underline text-sm">Từ chối</button>
      </td>
    </tr>`).join('');
}

function filterAdmissions() {
  const searchTrm = document.getElementById('admission-search').value.toLowerCase();
  const statusFilter = document.getElementById('admission-filter-status').value;
  const fromDate = document.getElementById('admission-filter-from').value;
  const toDate = document.getElementById('admission-filter-to').value;

  const filtered = _admissionsList.filter(a => {
    // Search
    const textToSearch = [a.student_name, a.phone, a.id_card, a.major_name, a.major_code].join(' ').toLowerCase();
    if (searchTrm && !textToSearch.includes(searchTrm)) return false;

    // Status
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;

    // Date
    if (fromDate || toDate) {
      // created_at format is ISO string like 2023-10-12T05:22:11
      const createdDate = new Date(a.created_at);
      createdDate.setHours(0, 0, 0, 0); // truncate hours for date compare

      if (fromDate) {
        const fromD = new Date(fromDate);
        fromD.setHours(0, 0, 0, 0);
        if (createdDate < fromD) return false;
      }
      if (toDate) {
        const toD = new Date(toDate);
        toD.setHours(23, 59, 59, 999);
        if (createdDate > toD) return false;
      }
    }
    
    return true;
  });

  renderAdmissions(filtered);
}

function exportAdmissionsToExcel() {
  if (!_admissionsList || !_admissionsList.length) {
    alert('Không có dữ liệu để xuất');
    return;
  }
  
  // Get filtered items straight from DOM or by re-running filter:
  // Quickest way is to just re-evaluate the filter on _admissionsList
  const searchTrm = document.getElementById('admission-search').value.toLowerCase();
  const statusFilter = document.getElementById('admission-filter-status').value;
  const fromDate = document.getElementById('admission-filter-from').value;
  const toDate = document.getElementById('admission-filter-to').value;

  const filtered = _admissionsList.filter(a => {
    const textToSearch = [a.student_name, a.phone, a.id_card, a.major_name, a.major_code].join(' ').toLowerCase();
    if (searchTrm && !textToSearch.includes(searchTrm)) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (fromDate || toDate) {
      const createdDate = new Date(a.created_at);
      if (fromDate && createdDate < new Date(fromDate)) return false;
      if (toDate && createdDate > new Date(toDate + 'T23:59:59')) return false;
    }
    return true;
  });

  if (!filtered.length) {
    alert('Không có dữ liệu phù hợp với bộ lọc hiện tại');
    return;
  }

  const dataToExport = filtered.map(a => ({
    'Họ và tên': a.student_name || '',
    'Ngày sinh': a.date_of_birth ? new Date(a.date_of_birth).toLocaleDateString('vi-VN') : '',
    'Số điện thoại': a.phone || '',
    'CMND/CCCD': a.id_card || '',
    'Email': a.email || '',
    'Trường THPT': a.high_school || '',
    'Ngành đăng ký': a.major_name || a.major_code || '',
    'Ngày đăng ký': new Date(a.created_at).toLocaleString('vi-VN'),
    'Trạng thái': a.status === 'approved' ? 'Đã duyệt' : a.status === 'rejected' ? 'Từ chối' : 'Chờ xử lý',
    'Zalo ID': a.zalo_id || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dang_Ky_Tuyen_Sinh");
  
  XLSX.writeFile(workbook, "Danh_Sach_Tuyen_Sinh_NSG.xlsx");
}

function viewAdmission(id) {
  const a = _admissionsList.find(x => x.id == id);
  if (!a) return;
  const statusLabel = a.status === 'approved' ? 'Đã duyệt' : a.status === 'rejected' ? 'Từ chối' : 'Chờ xử lý';
  document.getElementById('admission-detail-body').innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      <div><span class="font-semibold text-gray-600">Họ tên:</span><br>${esc(a.student_name || '')}</div>
      <div><span class="font-semibold text-gray-600">SĐT:</span><br>${esc(a.phone || '')}</div>
      <div><span class="font-semibold text-gray-600">CMND/CCCD:</span><br>${esc(a.id_card || '')}</div>
      <div><span class="font-semibold text-gray-600">Ngày sinh:</span><br>${fmtDate(a.date_of_birth)}</div>
      <div><span class="font-semibold text-gray-600">Email:</span><br>${esc(a.email || '')}</div>
      <div><span class="font-semibold text-gray-600">Zalo ID:</span><br>${esc(a.zalo_id || '')}</div>
      <div><span class="font-semibold text-gray-600">Ngành đăng ký:</span><br>${esc(a.major_name || a.major_code || '')}</div>
      <div><span class="font-semibold text-gray-600">Mã ngành:</span><br>${esc(a.major_code || '')}</div>
      <div><span class="font-semibold text-gray-600">Hệ đào tạo:</span><br>${esc(a.desired_education_level || '')}</div>
      <div><span class="font-semibold text-gray-600">Trường THPT:</span><br>${esc(a.high_school || '')}</div>
      <div><span class="font-semibold text-gray-600">Năm tốt nghiệp:</span><br>${esc(a.graduation_year || '')}</div>
      <div><span class="font-semibold text-gray-600">Trạng thái:</span><br><span class="px-2 py-1 rounded text-xs font-semibold ${a.status === 'approved' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">${statusLabel}</span></div>
      <div><span class="font-semibold text-gray-600">Ngày đăng ký:</span><br>${fmtDate(a.created_at)}</div>
      <div class="col-span-2"><span class="font-semibold text-gray-600">Địa chỉ:</span><br>${esc(a.address || '')}</div>
      <div class="col-span-2"><span class="font-semibold text-gray-600">Ghi chú:</span><br>${esc(a.notes || '')}</div>
      ${a.reject_reason ? `<div class="col-span-2"><span class="font-semibold text-red-600">Lý do từ chối:</span><br><span class="text-red-600">${esc(a.reject_reason)}</span></div>` : ''}
    </div>
  `;
  document.getElementById('admission-detail-approve').onclick = () => { updateAdmissionStatus(a.id, 'approved'); document.getElementById('admission-detail-modal').classList.add('hidden'); };
  document.getElementById('admission-detail-reject').onclick = () => { updateAdmissionStatus(a.id, 'rejected'); document.getElementById('admission-detail-modal').classList.add('hidden'); };
  document.getElementById('admission-detail-modal').classList.remove('hidden');
}

window.updateAdmissionStatus = async function(id, status) {
  let reject_reason = null;
  if (status === 'rejected') {
    reject_reason = prompt('Vui lòng nhập lý do từ chối hồ sơ này (bắt buộc):');
    if (reject_reason === null || reject_reason.trim() === '') {
      alert('Bạn phải nhập lý do từ chối.');
      return;
    }
  }
  
  if (!confirm(`Bạn có chắc muốn chuyển trạng thái hồ sơ thành: ${status === 'approved' ? 'Đã duyệt' : 'Từ chối'}? Hệ thống sẽ gửi email thông báo tới học viên.`)) return;
  
  try {
    const res = await fetch(API_BASE + '/admissions/' + id, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ status, reject_reason: reject_reason ? reject_reason.trim() : null }) 
    });
    
    if (res.ok) {
      alert('Đã cập nhật trạng thái và gửi email thành công');
      fetchAdmissions();
    } else {
      const data = await res.json();
      alert('Lỗi: ' + (data.error || 'Cập nhật thất bại'));
    }
  } catch (e) { alert('Lỗi cập nhật trạng thái'); }
}

// ===================== SETTINGS =====================

async function loadSettings() {
  try {
    const res = await fetch(API_BASE + '/settings');
    const settings = await res.json();
    if (settings.google_folder_id) document.getElementById('set-google-folder-id').value = settings.google_folder_id;
    if (settings.google_sa_json) document.getElementById('set-google-sa-json').value = settings.google_sa_json;
    if (settings.smtp_host) document.getElementById('set-smtp-host').value = settings.smtp_host;
    if (settings.smtp_user) document.getElementById('set-smtp-user').value = settings.smtp_user;
  } catch (e) { console.warn('Settings load error:', e); }
}

async function saveSettings() {
  const payload = {
    google_folder_id: document.getElementById('set-google-folder-id').value.trim(),
    google_sa_json: document.getElementById('set-google-sa-json').value.trim(),
    smtp_host: document.getElementById('set-smtp-host').value.trim(),
    smtp_user: document.getElementById('set-smtp-user').value.trim(),
    smtp_pass: document.getElementById('set-smtp-pass').value
  };
  try {
    await fetch(API_BASE + '/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    alert('Đã lưu cấu hình!');
  } catch (e) { alert('Lỗi lưu cấu hình'); }
}

// ===================== GOOGLE DRIVE UPLOAD =====================

async function uploadFileToDrive(file, targetInputId, dropNameId) {
  const nameEl = document.getElementById(dropNameId);
  if (nameEl) nameEl.textContent = 'Đang upload...';
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(API_BASE + '/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) {
      document.getElementById(targetInputId).value = data.url;
      if (nameEl) nameEl.textContent = '✓ ' + file.name;
    } else {
      if (nameEl) nameEl.textContent = 'Upload thất bại';
    }
  } catch (e) {
    if (nameEl) nameEl.textContent = 'Lỗi upload: ' + e.message;
  }
}

function handleDragOver(event, zoneId) {
  event.preventDefault();
  document.getElementById(zoneId).classList.add('dragover');
}

function handleDragLeave(event, zoneId) {
  document.getElementById(zoneId).classList.remove('dragover');
}

function handleDrop(event, inputId, zoneId, dropNameId) {
  event.preventDefault();
  document.getElementById(zoneId).classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    uploadFileToDrive(file, inputId, dropNameId);
  }
}

function handleFileSelect(event, inputId, zoneId, dropNameId) {
  document.getElementById(zoneId).classList.remove('dragover');
  const file = event.target.files[0];
  if (file) uploadFileToDrive(file, inputId, dropNameId);
}

// ===================== HELPERS =====================

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function stripHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function fmtDate(val) {
  if (!val) return '-';
  try { return new Date(val).toLocaleDateString('vi-VN'); } catch { return val; }
}

let newsEditor, majorDescEditor, majorCareerEditor;
window.addEventListener('load', () => {
  if(typeof Jodit !== 'undefined') {
    newsEditor = Jodit.make('#news-content', { height: 400 });
    majorDescEditor = Jodit.make('#major-description', { height: 300 });
    majorCareerEditor = Jodit.make('#major-career', { height: 300 });
  }
});

// ===================== AUTO RESTORE SESSION =====================
(function() {
  try {
    const saved = localStorage.getItem('admin_session');
    if (saved) {
      currentUser = JSON.parse(saved);
      document.getElementById('admin-name').textContent = currentUser.display_name || currentUser.username;
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('app-container').style.display = 'flex';
      applyRoleVisibility();
      loadDashboard();
    }
  } catch(e) {
    localStorage.removeItem('admin_session');
  }
})();
