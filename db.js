const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('⚠️ DB Pool Warning:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
