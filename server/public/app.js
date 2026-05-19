const API_BASE = '/api';

// Handle Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(el => {
        el.classList.remove('bg-gray-800', 'text-white');
        el.classList.add('text-gray-400');
    });
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-link[data-target="${tabId}"]`).classList.add('bg-gray-800', 'text-white');
    document.querySelector(`.tab-link[data-target="${tabId}"]`).classList.remove('text-gray-400');

    if(tabId === 'dashboard') loadDashboard();
    if(tabId === 'news') loadNews();
    if(tabId === 'majors') loadMajors();
    if(tabId === 'admissions') loadAdmissions();
}

// Modals
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        const [newsRes, majorsRes, admRes] = await Promise.all([
            fetch(`${API_BASE}/news`), fetch(`${API_BASE}/majors`), fetch(`${API_BASE}/admissions`)
        ]);
        const news = await newsRes.json();
        const majors = await majorsRes.json();
        const admissions = await admRes.json();

        document.getElementById('stat-news').innerText = news.length;
        document.getElementById('stat-majors').innerText = majors.length;
        document.getElementById('stat-admissions').innerText = admissions.length;

        // Bảng DS mới nhất
        const tb = document.getElementById('recent-admissions-list');
        tb.innerHTML = '';
        admissions.slice(0,5).forEach(a => {
            const date = new Date(a.created_at).toLocaleDateString();
            tb.innerHTML += `
             <tr class="border-b">
                <td class="py-2 px-4 font-medium">${a.student_name}</td>
                <td class="py-2 px-4">${a.phone}</td>
                <td class="py-2 px-4">${a.high_school}</td>
                <td class="py-2 px-4">${date}</td>
                <td class="py-2 px-4"><span class="bg-yellow-100 text-yellow-800 px-2 rounded font-semibold text-xs">${a.status}</span></td>
             </tr>`;
        });
    } catch(e) { console.log(e); }
}

// ==================== API CHUNG ====================
async function executeDelete(endpoint, id, callback) {
    if(!confirm("Bạn có chắc chắn xóa?")) return;
    try {
        await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
        callback();
    } catch(e) { alert("Lỗi xóa: " + e.message); }
}

async function executeStatusUpdate(id, status) {
    try {
        await fetch(`${API_BASE}/admissions/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status })
        });
        loadAdmissions(); // reload
    } catch(e) { alert(e.message); }
}

// ==================== NEWS SECTION ====================
async function loadNews() {
    const res = await fetch(`${API_BASE}/news`);
    const data = await res.json();
    const tb = document.getElementById('news-list');
    tb.innerHTML = '';
    data.forEach(n => {
        tb.innerHTML += `
        <tr>
            <td class="py-3 px-4 flex items-center">
                <img src="${n.image_url}" class="w-10 h-10 object-cover rounded mr-3" onerror="this.src='https://via.placeholder.com/40'">
                <span class="font-medium text-blue-600 line-clamp-1">${n.title}</span>
            </td>
            <td class="py-3 px-4">${n.category}</td>
            <td class="py-3 px-4 text-sm text-gray-500">${new Date(n.created_at).toLocaleDateString()}</td>
            <td class="py-3 px-4 text-right">
                <button onclick="executeDelete('news', ${n.id}, loadNews)" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
}
document.getElementById('newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        title: document.getElementById('news-title').value,
        category: document.getElementById('news-category').value,
        image_url: document.getElementById('news-image').value,
        content: document.getElementById('news-content').value,
    };
    await fetch(`${API_BASE}/news`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }});
    closeModal('newsModal');
    loadNews();
    e.target.reset();
});

// ==================== MAJORS SECTION ====================
async function loadMajors() {
    const res = await fetch(`${API_BASE}/majors`);
    const data = await res.json();
    const tb = document.getElementById('majors-list');
    tb.innerHTML = '';
    data.forEach(m => {
        tb.innerHTML += `
        <tr>
            <td class="py-3 px-4 font-bold text-gray-700">${m.code}</td>
            <td class="py-3 px-4 text-green-700 font-medium">${m.name}</td>
            <td class="py-3 px-4 text-right">
                <button onclick="executeDelete('majors', ${m.id}, loadMajors)" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
}
document.getElementById('majorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        code: document.getElementById('major-code').value,
        name: document.getElementById('major-name').value,
        description: document.getElementById('major-desc').value,
    };
    await fetch(`${API_BASE}/majors`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }});
    closeModal('majorModal');
    loadMajors();
    e.target.reset();
});

// ==================== ADMISSIONS SECTION ====================
async function loadAdmissions() {
    const res = await fetch(`${API_BASE}/admissions`);
    const data = await res.json();
    const tb = document.getElementById('admissions-list');
    tb.innerHTML = '';
    data.forEach(a => {
        const isPending = a.status === 'pending';
        tb.innerHTML += `
        <tr>
            <td class="py-3 px-4 text-sm">#${a.id}</td>
            <td class="py-3 px-4 font-medium">${a.student_name}</td>
            <td class="py-3 px-4">${a.phone}</td>
            <td class="py-3 px-4 text-sm"><span class="text-blue-600 block">${a.major_code}</span> <span class="text-gray-500 text-xs">${a.high_school}</span></td>
            <td class="py-3 px-4">
                <span class="${a.status === 'Đã Duyệt' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} px-2 py-1 rounded text-xs font-bold">
                    ${a.status}
                </span>
            </td>
            <td class="py-3 px-4 text-right">
                ${isPending ? `<button onclick="executeStatusUpdate(${a.id}, 'Đã Duyệt')" class="text-green-600 hover:bg-green-50 p-2 rounded mr-1"><i class="fa-solid fa-check"></i> Duyệt</button>` : ''}
                <button onclick="executeDelete('admissions', ${a.id}, loadAdmissions)" class="text-red-500 hover:bg-red-50 p-2 rounded"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
}

// Chạy lần đầu
document.addEventListener('DOMContentLoaded', loadDashboard);