const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000, // Supaya tak hang lama kalau DB offline
});

// Tangkap error latar belakang supaya Node.js tak crash
pool.on('error', (err) => {
  console.error('⚠️ DB Pool Background Error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
