const { Pool } = require('pg');
require('dotenv').config();

// Website Database (Neon PostgreSQL)
const webDB = new Pool({
    connectionString: process.env.WEB_DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test Neon database connection
webDB.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Website database (Neon) connection failed:', err.message);
    } else {
        console.log('✅ Website database (Neon) connected successfully');
    }
});

module.exports = {
    webDB
};

