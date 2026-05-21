const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');
const multer = require('multer');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const db = require('./db'); // Kết nối PostgreSQL

// Multer: lưu file tạm vào thư mục hệ thống
const upload = multer({ dest: os.tmpdir() });

const app = express();
const port = process.env.PORT || 3001; // Cổng server sẽ chạy

// NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
async function sendEmail(to, subject, html) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Bỏ qua gửi email vì chưa cấu hình SMTP_USER và SMTP_PASS.');
      return false;
    }
    const mailOptions = { from: `"Hệ thống Tuyển sinh" <${process.env.SMTP_USER}>`, to, subject, html };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
}

// OTP store (in-memory): key = username, value = { otp, expires }
const otpStore = new Map();

function getOtpEmailTemplate(displayName, otp) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã OTP - NSG Admin</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;background-color:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#b91c1c 0%,#7f1d1d 100%);padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:36px 40px 28px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
                    <tr>
                      <td style="width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;text-align:center;vertical-align:middle;">
                        <span style="font-size:36px;line-height:72px;">🛡️</span>
                      </td>
                    </tr>
                  </table>
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">TRƯỜNG NSG</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:4px;text-transform:uppercase;">Hệ Thống Quản Trị</p>
                </td>
              </tr>
              <tr>
                <td style="background:rgba(0,0,0,0.2);padding:12px 40px;text-align:center;">
                  <p style="margin:0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:600;">🔐 Yêu cầu đặt lại mật khẩu</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 40px 28px;">
            <p style="margin:0 0 8px;font-size:15px;color:#111827;">Xin chào <strong style="color:#b91c1c;">${displayName}</strong>,</p>
            <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
              Chúng tôi nhận được yêu cầu <strong>đặt lại mật khẩu</strong> cho tài khoản quản trị của bạn trên hệ thống NSG.<br>
              Sử dụng mã OTP bên dưới để xác nhận và tiếp tục. Mã chỉ có hiệu lực trong <strong style="color:#b91c1c;">10 phút</strong>.
            </p>

            <!-- OTP BOX -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #fca5a5;border-radius:14px;overflow:hidden;">
                    <tr>
                      <td style="padding:10px 48px 6px;text-align:center;">
                        <p style="margin:0;font-size:11px;color:#dc2626;font-weight:700;letter-spacing:3px;text-transform:uppercase;">MÃ XÁC NHẬN OTP</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 48px 12px;text-align:center;">
                        <p style="margin:0;font-size:48px;font-weight:900;color:#991b1b;letter-spacing:14px;font-family:'Courier New',Courier,monospace;">${otp}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 48px 14px;text-align:center;">
                        <p style="margin:0;font-size:12px;color:#6b7280;">⏱ Hiệu lực: <strong>10 phút</strong> kể từ khi gửi</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- STEPS -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#374151;">📋 Hướng dẫn sử dụng:</p>
                  <table cellpadding="0" cellspacing="0">
                    <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;">1️⃣ &nbsp;Quay lại trang đăng nhập quản trị NSG</td></tr>
                    <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;">2️⃣ &nbsp;Nhấn <strong>"Quên mật khẩu?"</strong> và nhập tên đăng nhập</td></tr>
                    <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;">3️⃣ &nbsp;Nhập mã OTP <strong style="color:#b91c1c;">${otp}</strong> vào ô xác nhận</td></tr>
                    <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;">4️⃣ &nbsp;Tạo mật khẩu mới và hoàn tất</td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- WARNING -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;">
                  <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                    ⚠️ <strong>Lưu ý bảo mật quan trọng:</strong> Không chia sẻ mã OTP này với bất kỳ ai kể cả nhân viên NSG.
                    Đội ngũ quản trị sẽ <strong>không bao giờ</strong> yêu cầu mã OTP qua điện thoại hay chat.
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
              Nếu bạn <strong>không thực hiện</strong> yêu cầu này, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn và không có thay đổi nào được thực hiện.
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#374151;">Trường Cao đẳng Bách khoa Nam Sài Gòn</p>
                  <p style="margin:0;font-size:12px;color:#9ca3af;">Đây là email tự động. Vui lòng không trả lời email này.</p>
                </td>
                <td align="right">
                  <p style="margin:0;font-size:11px;color:#d1d5db;">admin.nsg.edu.vn</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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
  const { code, name, description, requirements, image_url, image, duration, tuition_fee, education_level, subjects, career_prospects, website } = req.body;
  const imgUrl = image_url || image || null;
  try {
    const { rows } = await db.query(
      'INSERT INTO majors (code, name, description, requirements, image_url, duration, tuition_fee, education_level, subjects, career_prospects, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [code, name, description, requirements, imgUrl, duration, tuition_fee || null, education_level, subjects, career_prospects, website]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật ngành học
app.put('/api/majors/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, description, requirements, image_url, image, duration, tuition_fee, education_level, subjects, career_prospects, website } = req.body;
  const imgUrl = image_url || image || null;
  try {
    const { rows } = await db.query(
      'UPDATE majors SET code=$1, name=$2, description=$3, requirements=$4, image_url=$5, duration=$6, tuition_fee=$7, education_level=$8, subjects=$9, career_prospects=$10, website=$11 WHERE id=$12 RETURNING *',
      [code, name, description, requirements, imgUrl, duration, tuition_fee || null, education_level, subjects, career_prospects, website, id]
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

// Cập nhật thông tin người dùng Zalo từ trang Admin
app.put('/api/users/:id', async (req, res) => {
  const { name, phone, role } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE users SET name=$1, phone=$2, role=$3 WHERE id=$4 RETURNING *',
      [name, phone || null, role || 'user', req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
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
  const { title, message, type, image_url } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO notifications (title, message, type, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, message, type || 'info', image_url || null]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/notifications/:id', async (req, res) => {
  const { title, message, type, is_read, image_url } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE notifications SET title=$1, message=$2, type=$3, is_read=$4, image_url=$5 WHERE id=$6 RETURNING *',
      [title, message, type || 'info', is_read || false, image_url || null, req.params.id]
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
  const { student_name, date_of_birth, phone, email, major_code, major_name, high_school, zalo_id, id_card, address, graduation_year, notes, desired_education_level } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO admissions (student_name, date_of_birth, phone, email, major_code, major_name, high_school, zalo_id, id_card, address, graduation_year, notes, desired_education_level) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
      [student_name, date_of_birth || null, phone, email, major_code, major_name || null, high_school || null, zalo_id || null, id_card || null, address || null, graduation_year || null, notes || null, desired_education_level || null]
    );

    const newAd = rows[0];

    // Gửi email cho admin/editor
    if (process.env.ADMIN_EMAILS) {
      const adminHtml = `
        <h3>Có đăng ký xét tuyển mới!</h3>
        <ul>
          <li><strong>Họ tên:</strong> ${student_name}</li>
          <li><strong>SDT:</strong> ${phone}</li>
          <li><strong>Email:</strong> ${email || 'Không có'}</li>
          <li><strong>Ngành đăng ký:</strong> ${major_name || major_code}</li>
          <li><strong>CMND/CCCD:</strong> ${id_card || 'Không có'}</li>
        </ul>
        <p>Vui lòng đăng nhập hệ thống Admin để xem và xử lý!</p>
      `;
      sendEmail(process.env.ADMIN_EMAILS, 'Thông báo đăng ký xét tuyển mới', adminHtml);
    }

    // Gửi email xác nhận cho học viên (nếu có email)
    if (email) {
      const studentHtml = `
        <h3>Chào ${student_name},</h3>
        <p>Hệ thống đã ghi nhận thông tin đăng ký xét tuyển ngành <strong>${major_name || major_code}</strong> của bạn thành công.</p>
        <p>Hồ sơ của bạn hiện đang ở trạng thái <strong>Chờ xử lý</strong>.</p>
        <p>Ban tuyển sinh sẽ sớm liên hệ hoặc thông báo kết quả cho bạn qua email này hoặc số điện thoại ${phone}.</p>
        <br/><p>Trân trọng,<br/>Phòng Tuyển sinh Trường NSG.</p>
      `;
      sendEmail(email, 'Xác nhận đăng ký xét tuyển NSG', studentHtml);
    }

    res.json(newAd);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/admissions/:id', async (req, res) => {
  // Chủ yếu dùng để duyệt (Duyệt/Từ chối) đăng ký
  const { status, reject_reason } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE admissions SET status=$1, reject_reason=$2 WHERE id=$3 RETURNING *',
      [status, reject_reason || null, req.params.id]
    );
    
    const ad = rows[0];

    // Gửi email trạng thái mới cho học viên (nếu có email)
    if (ad.email) {
      let statusStr = status === 'approved' ? 'Được duyệt (Trúng tuyển)' : status === 'rejected' ? 'Từ chối' : 'Chờ xử lý';
      let htmlContent = `
        <h3>Chào ${ad.student_name},</h3>
        <p>Ban tuyển sinh Trường NSG xin thông báo đến bạn kết quả xét tuyển đối với hồ sơ đăng ký ngành <strong>${ad.major_name || ad.major_code}</strong>.</p>
        <p>Trạng thái hiện tại: <strong style="color: ${status === 'approved' ? 'green' : 'red'};">${statusStr}</strong></p>
      `;
      if (status === 'rejected' && reject_reason) {
         htmlContent += `<p><strong>Lý do:</strong> ${reject_reason}</p>`;
      }
      if (status === 'approved') {
         htmlContent += `<p>Vui lòng chuẩn bị các giấy tờ cũng như hoàn tất các hồ sơ cần thiết trong thời gian sớm nhất theo hướng dẫn của trường!</p>`;
      }
      htmlContent += `<br/><p>Trân trọng,<br/>Phòng Tuyển sinh Trường NSG.</p>`;

      sendEmail(ad.email, 'Cập nhật trạng thái hồ sơ đăng ký', htmlContent);
    }

    res.json(ad);
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
  try { const { rows } = await db.query('INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *', [name, slug]); res.json(rows[0]); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/categories/:id', async (req, res) => {
  try { await db.query('DELETE FROM categories WHERE id=$1', [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= TRAINING SYSTEMS =================
app.get('/api/training_systems', async (req, res) => {
  try { const { rows } = await db.query('SELECT * FROM training_systems ORDER BY id ASC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/training_systems', async (req, res) => {
  const { name, description } = req.body;
  try { const { rows } = await db.query('INSERT INTO training_systems (name, description) VALUES ($1, $2) RETURNING *', [name, description]); res.json(rows[0]); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/training_systems/:id', async (req, res) => {
  try { await db.query('DELETE FROM training_systems WHERE id=$1', [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= SYSTEM USERS =================
function hashPassword(p) { return crypto.createHash('sha256').update(p).digest('hex'); }
app.get('/api/system_users', async (req, res) => {
  try { const { rows } = await db.query('SELECT id, username, display_name, email, role, is_active, created_at FROM system_users WHERE is_superadmin IS NOT TRUE ORDER BY id ASC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/system_users', async (req, res) => {
  const { username, password, display_name, email, role, is_active } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const hash = hashPassword(password);
    const { rows } = await db.query(
      'INSERT INTO system_users (username, password_hash, display_name, email, role, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, username, display_name, email, role, is_active',
      [username, hash, display_name || username, email || null, role || 'editor', is_active !== false]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/system_users/:id', async (req, res) => {
  const { username, password, display_name, email, role, is_active } = req.body;
  try {
    if (password) {
      const hash = hashPassword(password);
      await db.query('UPDATE system_users SET username=$1, password_hash=$2, display_name=$3, email=$4, role=$5, is_active=$6 WHERE id=$7',
        [username, hash, display_name, email || null, role, is_active, req.params.id]);
    } else {
      await db.query('UPDATE system_users SET username=$1, display_name=$2, email=$3, role=$4, is_active=$5 WHERE id=$6',
        [username, display_name, email || null, role, is_active, req.params.id]);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/system_users/:id', async (req, res) => {
  try { await db.query('DELETE FROM system_users WHERE id=$1', [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/system_users/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Thiếu tên đăng nhập hoặc mật khẩu' });
  try {
    const hash = hashPassword(password);
    const result = await db.query(
      'SELECT id, username, display_name, role, is_active FROM system_users WHERE username=$1 AND password_hash=$2',
      [username, hash]
    );
    if (!result.rows.length) return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    const user = result.rows[0];
    if (!user.is_active) return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ================= QUÊN MẬT KHẨU (OTP) =================

// Bước 1: Gửi OTP đến email
app.post('/api/system_users/forgot-password', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, message: 'Thiếu tên đăng nhập' });
  try {
    const result = await db.query(
      'SELECT id, username, email, display_name FROM system_users WHERE username=$1 AND is_active=true',
      [username]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
    const user = result.rows[0];
    if (!user.email) return res.status(400).json({ success: false, message: 'Tài khoản này chưa được liên kết với email. Vui lòng liên hệ quản trị viên.' });

    // Tạo OTP 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 phút
    otpStore.set(username, { otp, expires });

    const emailSent = await sendEmail(
      user.email,
      'Mã OTP đặt lại mật khẩu - Hệ thống NSG',
      getOtpEmailTemplate(user.display_name || user.username, otp)
    );

    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Không thể gửi email. Vui lòng kiểm tra cấu hình SMTP hoặc liên hệ quản trị viên.' });
    }

    // Che bớt email để bảo mật: user@example.com → us***@example.com
    const maskedEmail = user.email.replace(/^(.{2})(.+)(@.+)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
    res.json({ success: true, message: `Mã OTP đã được gửi đến ${maskedEmail}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Bước 2: Xác minh OTP
app.post('/api/system_users/verify-otp', (req, res) => {
  const { username, otp } = req.body;
  if (!username || !otp) return res.status(400).json({ success: false, message: 'Thiếu thông tin xác nhận' });

  const stored = otpStore.get(username);
  if (!stored) return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
  if (Date.now() > stored.expires) {
    otpStore.delete(username);
    return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' });
  }
  if (stored.otp !== otp) return res.status(400).json({ success: false, message: 'Mã OTP không đúng. Vui lòng kiểm tra lại.' });

  res.json({ success: true, message: 'Xác thực OTP thành công' });
});

// Bước 3: Đặt lại mật khẩu
app.post('/api/system_users/reset-password', async (req, res) => {
  const { username, otp, newPassword } = req.body;
  if (!username || !otp || !newPassword) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });

  const stored = otpStore.get(username);
  if (!stored) return res.status(400).json({ success: false, message: 'Phiên đặt lại mật khẩu không hợp lệ. Vui lòng bắt đầu lại.' });
  if (Date.now() > stored.expires) {
    otpStore.delete(username);
    return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' });
  }
  if (stored.otp !== otp) return res.status(400).json({ success: false, message: 'Phiên xác thực không hợp lệ' });
  if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });

  try {
    const hash = hashPassword(newPassword);
    await db.query('UPDATE system_users SET password_hash=$1 WHERE username=$2', [hash, username]);
    otpStore.delete(username);
    res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= SETTINGS =================

// Map giữa key frontend và key trong DB
const SETTINGS_KEY_MAP = {
  google_folder_id: 'google_drive_folder_id',
  google_sa_json: 'google_service_account_json',
  smtp_host: 'smtp_host',
  smtp_user: 'smtp_user',
  smtp_pass: 'smtp_pass'
};

app.get('/api/settings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT config_key, config_value FROM settings');
    // Chuyển về object key frontend
    const result = {};
    const reverseMap = Object.fromEntries(Object.entries(SETTINGS_KEY_MAP).map(([k, v]) => [v, k]));
    for (const row of rows) {
      const frontendKey = reverseMap[row.config_key] || row.config_key;
      result[frontendKey] = row.config_value;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const entries = Object.entries(req.body || {});
    for (const [frontendKey, value] of entries) {
      if (value === undefined || value === null) continue;
      const dbKey = SETTINGS_KEY_MAP[frontendKey] || frontendKey;
      await db.query(
        `INSERT INTO settings (config_key, config_value) VALUES ($1, $2)
         ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value`,
        [dbKey, String(value)]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPLOAD (Google Drive) =================

app.get('/api/settings/test-drive-connection', async (req, res) => {
  try {
    const { google } = require('googleapis');
    const { rows } = await db.query('SELECT config_value FROM settings WHERE config_key=$1', ['google_service_account_json']);
    if (!rows.length || !rows[0].config_value) return res.status(400).json({ success: false, message: 'Chưa cấu hình JSON Service Account' });
    const credentials = JSON.parse(rows[0].config_value);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
    const drive = google.drive({ version: 'v3', auth });
    
    const { rows: fr } = await db.query('SELECT config_value FROM settings WHERE config_key=$1', ['google_drive_folder_id']);
    const folderId = fr.length ? fr[0].config_value : null;
    
    // Test list files in shared/team drive
    const q = folderId ? `'${folderId}' in parents` : '';
    await drive.files.list({ pageSize: 1, q, supportsAllDrives: true, includeItemsFromAllDrives: true });
    
    res.json({ success: true, message: 'Kết nối Google Drive thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi: ' + err.message });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const { rows } = await db.query('SELECT config_value FROM settings WHERE config_key=$1', ['google_service_account_json']);
    if (!rows.length || !rows[0].config_value) return res.status(400).json({ error: 'Google Drive not configured' });
    const credentials = JSON.parse(rows[0].config_value);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
    const drive = google.drive({ version: 'v3', auth });

    const { rows: fr } = await db.query('SELECT config_value FROM settings WHERE config_key=$1', ['google_drive_folder_id']);
    const folderId = fr.length ? fr[0].config_value : null;

    // Detect if folderId belongs to a Shared/Team Drive
    let driveId = null;
    if (folderId) {
      try {
        const folderInfo = await drive.files.get({ fileId: folderId, fields: 'driveId', supportsAllDrives: true });
        driveId = folderInfo.data.driveId || null;
      } catch (_) {}
    }

    const meta = { name: req.file.originalname };
    if (folderId) meta.parents = [folderId];
    const media = { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) };

    const uploadParams = { requestBody: meta, media, fields: 'id', supportsAllDrives: true };
    if (driveId) uploadParams.driveId = driveId;

    const uploaded = await drive.files.create(uploadParams);
    const fileId = uploaded.data.id;

    // Try to set public permission (may fail on Team Drives - handled gracefully)
    try {
      await drive.permissions.create({
        fileId,
        requestBody: { role: 'reader', type: 'anyone' },
        supportsAllDrives: true
      });
    } catch (permErr) {
      console.warn('Permission set skipped (Team Drive restriction):', permErr.message);
    }

    fs.unlink(req.file.path, () => {});
    // Direct view URL — works for personal and shared drives
    const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    res.json({ url: directUrl, fileId });
  } catch (e) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Upload error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});

