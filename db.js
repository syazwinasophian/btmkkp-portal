const { Pool } = require('pg');
require('dotenv').config();

// Force strict connection to PostgreSQL 18 (Port 5433)
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'btmkkp_portal',
    password: process.env.DB_PASSWORD || '2111',
    port: 5433, // Directly hardcoded to PostgreSQL 18
});

// Test connection and print active database instance on server boot
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