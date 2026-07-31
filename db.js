const { Pool } = require('pg');
require('dotenv').config();

// Standardize configuration to prioritize DATABASE_URL provided by Railway
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required for Railway PostgreSQL
      }
    : {
        // Local fallback settings
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'btmkkp_portal',
        password: process.env.DB_PASSWORD || '2111',
        port: process.env.DB_PORT || 5433,
      }
);

// Test connection on server boot
pool.query('SELECT current_database(), inet_server_port(), version();')
    .then(res => {
        const dbName = res.rows[0].current_database;
        const dbPort = res.rows[0].inet_server_port;
        const version = res.rows[0].version.split(',')[0];

        console.log(`\n==================================================`);
        console.log(`>>> CONNECTED DATABASE : ${dbName}`);
        console.log(`>>> CONNECTED PORT     : ${dbPort}`);
        console.log(`>>> ENGINE VERSION     : ${version}`);
        console.log(`==================================================\n`);
    })
    .catch(err => {
        console.error(`\n❌ PostgreSQL Connection Error:`, err.message, `\n`);
    });

module.exports = {
    query: (text, params) => pool.query(text, params),
};
