const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const db = require('./db'); // Kết nối PostgreSQL

const app = express();
const port = process.env.PORT || 3001; // Cổng server sẽ chạy

// Middleware
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.use(express.static(path.join(__dirname, 'public'))); // Serve the Admin Frontend UI
app.use(bodyParser.json({
  verify: (req, res, buf, encoding) => {
    // Lưu raw body để xác thực chữ ký của Zalo
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  },
}));

// --- CẤU HÌNH CỦA BẠN ---
// Thay thế bằng App ID và Secret Key của Mini App của bạn
const ZALO_APP_ID = '683482533449307102'; 
const ZALO_SECRET_KEY = 'BXXadkS11DDnKZjZQHmP';

// Endpoint để Zalo xác thực Webhook URL (chỉ chạy 1 lần khi bạn cấu hình)
app.get('/zalo-webhook', (req, res) => {
  console.log('GET /zalo-webhook - Yêu cầu xác thực từ Zalo');
  const challenge = req.query.challenge;
  if (challenge) {
    console.log('Challenge code:', challenge);
    res.status(200).send(challenge);
  } else {
    res.status(400).send('Missing challenge code');
  }
});

// Endpoint chính để nhận sự kiện từ Zalo
app.post('/zalo-webhook', (req, res) => {
  const zaloSignature = req.header('X-Zalo-Signature');
  const timestamp = req.header('X-Zalo-Request-Timestamp');
  
  console.log('\n--- Có sự kiện mới từ Zalo ---');
  console.log('Timestamp:', timestamp);
  console.log('Signature:', zaloSignature);
  console.log('Nội dung sự kiện (Body):', JSON.stringify(req.body, null, 2));

  // 1. Xác thực chữ ký (quan trọng để bảo mật)
  const dataToVerify = ZALO_APP_ID + timestamp + req.rawBody;
  const generatedSignature = `mac=${crypto.createHmac('sha256', ZALO_SECRET_KEY).update(dataToVerify).digest('hex')}`;

  if (generatedSignature !== zaloSignature) {
    console.error('Lỗi: Chữ ký không hợp lệ!');
    return res.status(403).send('Invalid signature');
  }
  
  console.log('✅ Chữ ký hợp lệ!');

  // 2. Xử lý sự kiện
  const event = req.body;
  
  // Ví dụ: Xử lý sự kiện "user_follow_oa"
  if (event.event_name === 'user_follow_oa') {
    const followerId = event.follower.id;
    console.log(`Sự kiện: Người dùng [${followerId}] vừa quan tâm OA.`);
    // Tại đây bạn có thể lưu thông tin người dùng vào database của mình
  }

  // Ví dụ: Xử lý sự kiện người dùng gửi tin nhắn "hello"
  if (event.event_name === 'user_send_text' && event.message.text.toLowerCase() === 'hello') {
    const senderId = event.sender.id;
    console.log(`Sự kiện: Người dùng [${senderId}] đã gửi tin nhắn "hello".`);
    // Tại đây bạn có thể gọi Zalo API để trả lời tin nhắn
  }

  // Phản hồi cho Zalo để xác nhận đã nhận sự kiện
  res.status(200).send('Event received');
});

// --- CÁC API CHO ZALO MINI APP (FRONTEND) GỌI TỚI ---

// ================= TIN TỨC (NEWS) =================
// 1. API Lấy danh sách tin tức
app.get('/api/news', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy danh sách tin tức", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Thêm tin tức mới
app.post('/api/news', async (req, res) => {
  const { title, content, image_url, category } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO news (title, content, image_url, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, image_url, category]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sửa tin tức
app.put('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, image_url, category } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE news SET title = $1, content = $2, image_url = $3, category = $4 WHERE id = $5 RETURNING *',
      [title, content, image_url, category, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa tin tức
app.delete('/api/news/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NGÀNH HỌC (MAJORS) =================
// 2. API Lấy danh sách ngành học
app.get('/api/majors', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM majors ORDER BY code ASC');
    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy danh sách ngành học", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Thêm ngành học
app.post('/api/majors', async (req, res) => {
  const { code, name, description, requirements } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO majors (code, name, description, requirements) VALUES ($1, $2, $3, $4) RETURNING *',
      [code, name, description, requirements]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật ngành học
app.put('/api/majors/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, description, requirements } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE majors SET code = $1, name = $2, description = $3, requirements = $4 WHERE id = $5 RETURNING *',
      [code, name, description, requirements, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa ngành học
app.delete('/api/majors/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM majors WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NGƯỜI DÙNG (USERS) =================
// ================= ADMIN & TH�NH VI�N =================
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUser && password === adminPass) {
    res.json({ success: true, token: 'fake-jwt-token-xyz' });
  } else {
    res.status(401).json({ success: false, error: 'Sai t�i kho?n ho?c m?t kh?u' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. API Đăng ký/Cập nhật thông tin người dùng từ Zalo
app.post('/api/users', async (req, res) => {
  const { zalo_id, name, avatar } = req.body;
  if (!zalo_id) {
    return res.status(400).json({ error: 'Thiếu zalo_id' });
  }
  
  try {
    const query = `
      INSERT INTO users (zalo_id, name, avatar) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (zalo_id) 
      DO UPDATE SET name = $2, avatar = $3 
      RETURNING *;
    `;
    const { rows } = await db.query(query, [zalo_id, name, avatar]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Lỗi cập nhật người dùng", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ================= THÔNG BÁO (NOTIFICATIONS) =================
app.get('/api/notifications', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/notifications', async (req, res) => {
  const { title, message, type } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO notifications (title, message, type) VALUES ($1, $2, $3) RETURNING *',
      [title, message, type || 'info']
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/notifications/:id', async (req, res) => {
  const { title, message, type, is_read } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE notifications SET title=$1, message=$2, type=$3, is_read=$4 WHERE id=$5 RETURNING *',
      [title, message, type, is_read, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM notifications WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= SỰ KIỆN (EVENTS) =================
app.get('/api/events', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM events ORDER BY event_date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/events', async (req, res) => {
  const { title, description, event_date, location, image_url } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO events (title, description, event_date, location, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, event_date, location, image_url]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/events/:id', async (req, res) => {
  const { title, description, event_date, location, image_url } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE events SET title=$1, description=$2, event_date=$3, location=$4, image_url=$5 WHERE id=$6 RETURNING *',
      [title, description, event_date, location, image_url, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/events/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= ĐĂNG KÝ TUYỂN SINH (ADMISSIONS) =================
app.get('/api/admissions', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM admissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/admissions', async (req, res) => {
  const { student_name, date_of_birth, phone, email, major_code, high_school, zalo_id } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO admissions (student_name, date_of_birth, phone, email, major_code, high_school, zalo_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [student_name, date_of_birth, phone, email, major_code, high_school, zalo_id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admissions/:id', async (req, res) => {
  // Chủ yếu dùng để duyệt (Duyệt/Từ chối) đăng ký
  const { status } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE admissions SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admissions/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM admissions WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Endpoint kiểm tra server có đang chạy không
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Kh?i d?ng server

// ================= CATEGORIES =================
app.get('/api/categories', async (req, res) => {
  try { const { rows } = await db.query('SELECT * FROM categories ORDER BY id ASC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/categories', async (req, res) => {
  const { name, slug } = req.body;
  try { const { rows } = await db.query('INSERT INTO categories (name, slug) VALUES (\, \) RETURNING *', [name, slug]); res.json(rows[0]); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/categories/:id', async (req, res) => {
  try { await db.query('DELETE FROM categories WHERE id=', [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= TRAINING SYSTEMS =================
app.get('/api/training_systems', async (req, res) => {
  try { const { rows } = await db.query('SELECT * FROM training_systems ORDER BY id ASC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/training_systems', async (req, res) => {
  const { name, description } = req.body;
  try { const { rows } = await db.query('INSERT INTO training_systems (name, description) VALUES (\, \) RETURNING *', [name, description]); res.json(rows[0]); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/training_systems/:id', async (req, res) => {
  try { await db.query('DELETE FROM training_systems WHERE id=', [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= SYSTEM USERS (Backend Login) =================
const crypto = require('crypto');
function hashPassword(p) { return crypto.createHash('sha256').update(p).digest('hex'); }
app.get('/api/system_users', async (req, res) => {
  try { const { rows } = await db.query('SELECT id, username, display_name, role, is_active, created_at FROM system_users ORDER BY id ASC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/system_users', async (req, res) => {
  const { username, password, display_name, role } = req.body;
  try {
    const h = hashPassword(password);
    const { rows } = await db.query('INSERT INTO system_users (username, password_hash, display_name, role) VALUES (\, \, \, \) RETURNING id, username, display_name, role, is_active', [username, h, display_name, role || 'editor']);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/system_users/:id', async (req, res) => {
  const { display_name, role, is_active, password } = req.body;
  try {
    let q, params;
    if (password) {
      q = 'UPDATE system_users SET display_name=\, role=\, is_active=\, password_hash=\ WHERE id=\ RETURNING id, username, display_name, role, is_active';
      params = [display_name, role, is_active, hashPassword(password), req.params.id];
    } else {
      q = 'UPDATE system_users SET display_name=\, role=\, is_active=\ WHERE id=\ RETURNING id, username, display_name, role, is_active';
      params = [display_name, role, is_active, req.params.id];
    }
    const { rows } = await db.query(q, params);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/system_users/:id', async (req, res) => {
  try { await db.query('DELETE FROM system_users WHERE id=', [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= UPLOAD (Google Drive) =================
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const upload = multer({ dest: '/tmp/uploads/' });

async function getGoogleDriveClient() {
  const { rows } = await db.query('SELECT config_value FROM settings WHERE config_key = ', ['google_service_account_json']);
  if (!rows.length || !rows[0].config_value) throw new Error('Google Service Account JSON not configured in settings');
  const credentials = JSON.parse(rows[0].config_value);
  const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
  return google.drive({ version: 'v3', auth });
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const drive = await getGoogleDriveClient();
    const { rows: folderRows } = await db.query('SELECT config_value FROM settings WHERE config_key = ', ['google_drive_folder_id']);
    const folderId = folderRows.length ? folderRows[0].config_value : null;
    const fileMetadata = { name: req.file.originalname, ...(folderId && { parents: [folderId] }) };
    const media = { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) };
    const uploaded = await drive.files.create({ requestBody: fileMetadata, media, fields: 'id, webViewLink, webContentLink' });
    // Make file publicly readable
    await drive.permissions.create({ fileId: uploaded.data.id, requestBody: { role: 'reader', type: 'anyone' } });
    const url = 'https://drive.google.com/uc?export=view&id=' + uploaded.data.id;
    fs.unlink(req.file.path, () => {});
    res.json({ url, id: uploaded.data.id });
  } catch (err) {
    try { fs.unlink(req.file.path, () => {}); } catch(e) {}
    res.status(500).json({ error: err.message });
  }
});


// Login for system users
app.post('/api/system_users/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });
  try {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const result = await pool.query(
      'SELECT id, username, display_name, role, is_active FROM system_users WHERE username = \ AND password_hash = ',
      [username, hash]
    );
    if (!result.rows.length) return res.status(401).json({ success: false, message: 'Sai ten dang nhap hoac mat khau' });
    const user = result.rows[0];
    if (!user.is_active) return res.status(403).json({ success: false, message: 'Tai khoan bi vo hieu hoa' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server dang l?ng nghe t?i http://localhost:${port}`);
});
module.exports = app;








