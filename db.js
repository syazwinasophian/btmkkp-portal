const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway public DB connection
  },
});

// Catches background disconnects so Node doesn't crash
pool.on('error', (err) => {
  console.error('⚠️ DB Pool Error:', err.message);
});

// Boot connection test
pool.query('SELECT NOW();')
  .then(() => console.log('✅ CONNECTED TO POSTGRESQL SUCCESSFULLY!'))
  .catch((err) => console.error('❌ Database Connection Error:', err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
module.exports = {
    query: (text, params) => pool.query(text, params),
};
