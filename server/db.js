const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Hàm khởi tạo các bảng cơ bản nếu chưa có
const initDB = async () => {
  const client = await pool.connect();
  try {
    const createTablesQuery = `
      -- 1. Người dùng
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        zalo_id VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        phone VARCHAR(50),
        name VARCHAR(255),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 7. Cấu hình hệ thống
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        config_key VARCHAR(100) UNIQUE NOT NULL,
        config_value TEXT
      );

      -- 2. Tin tức
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        image_url VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 3. Ngành học
      CREATE TABLE IF NOT EXISTS majors (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        requirements TEXT
      );

      -- 4. Thông báo (Notifications)
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(100) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 5. Sự kiện (Events)
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 6. Danh sách đăng ký tuyển sinh
      CREATE TABLE IF NOT EXISTS admissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        date_of_birth DATE,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        major_code VARCHAR(50) NOT NULL,
        high_school VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        zalo_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTablesQuery);
    
    // Đảm bảo ALTER TABLE cho database cũ
    try { await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'"); } catch(e) {}
    try { await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)"); } catch(e) {}
    
    console.log("✅ Các bảng CSDL đã được khởi tạo/kiểm tra thành công.");
  } catch (err) {
    console.error("❌ Lỗi khởi tạo CSDL:", err);
  } finally {
    client.release();
  }
};

initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
