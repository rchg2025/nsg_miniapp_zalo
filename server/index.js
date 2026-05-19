const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const db = require('./db'); // Káº¿t ná»‘i PostgreSQL

const app = express();
const port = process.env.PORT || 3001; // Cá»•ng server sáº½ cháº¡y

// Middleware
app.use(cors()); // Cho phÃ©p Cross-Origin Resource Sharing
app.use(express.static(path.join(__dirname, 'public'))); // Serve the Admin Frontend UI
app.use(bodyParser.json({
  verify: (req, res, buf, encoding) => {
    // LÆ°u raw body Ä‘á»ƒ xÃ¡c thá»±c chá»¯ kÃ½ cá»§a Zalo
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  },
}));

// --- Cáº¤U HÃŒNH Cá»¦A Báº N ---
// Thay tháº¿ báº±ng App ID vÃ  Secret Key cá»§a Mini App cá»§a báº¡n
const ZALO_APP_ID = '683482533449307102'; 
const ZALO_SECRET_KEY = 'BXXadkS11DDnKZjZQHmP';

// Endpoint Ä‘á»ƒ Zalo xÃ¡c thá»±c Webhook URL (chá»‰ cháº¡y 1 láº§n khi báº¡n cáº¥u hÃ¬nh)
app.get('/zalo-webhook', (req, res) => {
  console.log('GET /zalo-webhook - YÃªu cáº§u xÃ¡c thá»±c tá»« Zalo');
  const challenge = req.query.challenge;
  if (challenge) {
    console.log('Challenge code:', challenge);
    res.status(200).send(challenge);
  } else {
    res.status(400).send('Missing challenge code');
  }
});

// Endpoint chÃ­nh Ä‘á»ƒ nháº­n sá»± kiá»‡n tá»« Zalo
app.post('/zalo-webhook', (req, res) => {
  const zaloSignature = req.header('X-Zalo-Signature');
  const timestamp = req.header('X-Zalo-Request-Timestamp');
  
  console.log('\n--- CÃ³ sá»± kiá»‡n má»›i tá»« Zalo ---');
  console.log('Timestamp:', timestamp);
  console.log('Signature:', zaloSignature);
  console.log('Ná»™i dung sá»± kiá»‡n (Body):', JSON.stringify(req.body, null, 2));

  // 1. XÃ¡c thá»±c chá»¯ kÃ½ (quan trá»ng Ä‘á»ƒ báº£o máº­t)
  const dataToVerify = ZALO_APP_ID + timestamp + req.rawBody;
  const generatedSignature = `mac=${crypto.createHmac('sha256', ZALO_SECRET_KEY).update(dataToVerify).digest('hex')}`;

  if (generatedSignature !== zaloSignature) {
    console.error('Lá»—i: Chá»¯ kÃ½ khÃ´ng há»£p lá»‡!');
    return res.status(403).send('Invalid signature');
  }
  
  console.log('âœ… Chá»¯ kÃ½ há»£p lá»‡!');

  // 2. Xá»­ lÃ½ sá»± kiá»‡n
  const event = req.body;
  
  // VÃ­ dá»¥: Xá»­ lÃ½ sá»± kiá»‡n "user_follow_oa"
  if (event.event_name === 'user_follow_oa') {
    const followerId = event.follower.id;
    console.log(`Sá»± kiá»‡n: NgÆ°á»i dÃ¹ng [${followerId}] vá»«a quan tÃ¢m OA.`);
    // Táº¡i Ä‘Ã¢y báº¡n cÃ³ thá»ƒ lÆ°u thÃ´ng tin ngÆ°á»i dÃ¹ng vÃ o database cá»§a mÃ¬nh
  }

  // VÃ­ dá»¥: Xá»­ lÃ½ sá»± kiá»‡n ngÆ°á»i dÃ¹ng gá»­i tin nháº¯n "hello"
  if (event.event_name === 'user_send_text' && event.message.text.toLowerCase() === 'hello') {
    const senderId = event.sender.id;
    console.log(`Sá»± kiá»‡n: NgÆ°á»i dÃ¹ng [${senderId}] Ä‘Ã£ gá»­i tin nháº¯n "hello".`);
    // Táº¡i Ä‘Ã¢y báº¡n cÃ³ thá»ƒ gá»i Zalo API Ä‘á»ƒ tráº£ lá»i tin nháº¯n
  }

  // Pháº£n há»“i cho Zalo Ä‘á»ƒ xÃ¡c nháº­n Ä‘Ã£ nháº­n sá»± kiá»‡n
  res.status(200).send('Event received');
});

// --- CÃC API CHO ZALO MINI APP (FRONTEND) Gá»ŒI Tá»šI ---

// ================= TIN Tá»¨C (NEWS) =================
// 1. API Láº¥y danh sÃ¡ch tin tá»©c
app.get('/api/news', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error("Lá»—i láº¥y danh sÃ¡ch tin tá»©c", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ThÃªm tin tá»©c má»›i
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

// Sá»­a tin tá»©c
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

// XÃ³a tin tá»©c
app.delete('/api/news/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NGÃ€NH Há»ŒC (MAJORS) =================
// 2. API Láº¥y danh sÃ¡ch ngÃ nh há»c
app.get('/api/majors', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM majors ORDER BY code ASC');
    res.json(rows);
  } catch (error) {
    console.error("Lá»—i láº¥y danh sÃ¡ch ngÃ nh há»c", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ThÃªm ngÃ nh há»c
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

// Cáº­p nháº­t ngÃ nh há»c
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

// XÃ³a ngÃ nh há»c
app.delete('/api/majors/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM majors WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NGÆ¯á»œI DÃ™NG (USERS) =================
// ================= ADMIN & THÀNH VIÊN =================
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUser && password === adminPass) {
    res.json({ success: true, token: 'fake-jwt-token-xyz' });
  } else {
    res.status(401).json({ success: false, error: 'Sai tài khoản hoặc mật khẩu' });
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

// 3. API ÄÄƒng kÃ½/Cáº­p nháº­t thÃ´ng tin ngÆ°á»i dÃ¹ng tá»« Zalo
app.post('/api/users', async (req, res) => {
  const { zalo_id, name, avatar } = req.body;
  if (!zalo_id) {
    return res.status(400).json({ error: 'Thiáº¿u zalo_id' });
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
    console.error("Lá»—i cáº­p nháº­t ngÆ°á»i dÃ¹ng", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ================= THÃ”NG BÃO (NOTIFICATIONS) =================
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

// ================= Sá»° KIá»†N (EVENTS) =================
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

// ================= ÄÄ‚NG KÃ TUYá»‚N SINH (ADMISSIONS) =================
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
  // Chá»§ yáº¿u dÃ¹ng Ä‘á»ƒ duyá»‡t (Duyá»‡t/Tá»« chá»‘i) Ä‘Äƒng kÃ½
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

// Endpoint kiá»ƒm tra server cÃ³ Ä‘ang cháº¡y khÃ´ng
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
module.exports = app;





