const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.process ? process.env.DATABASE_URL : process.env.DATABASE_URL;

const poolConfig = connectionString
  ? {
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false, // Accepts Railway's SSL certs
      },
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'btmkkp_portal',
      password: process.env.DB_PASSWORD || '2111',
      port: process.env.DB_PORT || 5433,
    };

const pool = new Pool(poolConfig);

// CRITICAL: Prevent idle pool connection drops from crashing the Node.js process
pool.on('error', (err, client) => {
    console.error('⚠️ Unexpected error on idle PostgreSQL client:', err.message);
});

// Test connection on startup
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
