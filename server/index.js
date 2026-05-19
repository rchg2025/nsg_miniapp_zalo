const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db'); // Kết nối PostgreSQL

const app = express();
const port = process.env.PORT || 3001; // Cổng server sẽ chạy

// Middleware
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
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

// 3. API Đăng ký/Cập nhật thông tin người dùng từ Zalo
app.post('/api/users', async (req, res) => {
  const { zalo_id, name, avatar } = req.body;
  if (!zalo_id) {
    return res.status(400).json({ error: 'Thiếu zalo_id' });
  }
  
  try {
    // Upsert: Thêm mới nếu chưa có, cập nhật nếu đã tồn tại zalo_id
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

// Endpoint kiểm tra server có đang chạy không
app.get('/', (req, res) => {
  res.send('Zalo Webhook & NSG Backend Server đang chạy (Đã kết nối PostgreSQL)!');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
  console.log('Webhook URL của bạn sẽ là URL công khai của server này + /zalo-webhook');
});
