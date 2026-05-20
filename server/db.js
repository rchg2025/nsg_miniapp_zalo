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
      -- 8. Danh mục chuyên mục (Tin tức / Sự kiện)
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 9. Hệ đào tạo (Cao đẳng, Trung cấp, Liên thông...)
      CREATE TABLE IF NOT EXISTS training_systems (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 10. Thành viên hệ thống (đăng nhập backend)
      CREATE TABLE IF NOT EXISTS system_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'editor',
        is_active BOOLEAN DEFAULT TRUE,
        is_superadmin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTablesQuery);
    
    // Đảm bảo ALTER TABLE cho database cũ
 
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)'); } catch(e) {}
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS duration VARCHAR(100)'); } catch(e) {}
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS tuition_fee NUMERIC'); } catch(e) {}
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS education_level VARCHAR(100)'); } catch(e) {}
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS subjects TEXT'); } catch(e) {}
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS career_prospects TEXT'); } catch(e) {}
    try { await client.query('ALTER TABLE majors ADD COLUMN IF NOT EXISTS website VARCHAR(255)'); } catch(e) {}
    
    try { await client.query('ALTER TABLE notifications ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)'); } catch(e) {}
   try { await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'"); } catch(e) {}
    try { await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)"); } catch(e) {}
    try { await client.query("ALTER TABLE system_users ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT FALSE"); } catch(e) {}
    try { await client.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS major_name VARCHAR(255)"); } catch(e) {}
    try { await client.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS id_card VARCHAR(30)"); } catch(e) {}
    try { await client.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS address TEXT"); } catch(e) {}
    try { await client.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS graduation_year VARCHAR(10)"); } catch(e) {}
    try { await client.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS notes TEXT"); } catch(e) {}
    try { await client.query("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS desired_education_level VARCHAR(100)"); } catch(e) {}

    // Tạo tài khoản superadmin nếu chưa tồn tại
    try {
      await client.query(
        `INSERT INTO system_users (username, password_hash, display_name, role, is_active, is_superadmin)
         VALUES ('qtv', '1449b25ad847b2772c6cb11fdf6c1087c719d7aec327dc4e980cdce8c384868f', 'Quản Trị Viên', 'superadmin', true, true)
         ON CONFLICT (username) DO NOTHING`
      );
    } catch(e) {}
    
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
