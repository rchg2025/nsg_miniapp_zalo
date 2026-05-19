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
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        zalo_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        image_url VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS majors (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        requirements TEXT
      );
    `;
    await client.query(createTablesQuery);
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
