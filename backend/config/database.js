const { Pool } = require('pg');
require('dotenv').config();

// Website Database (Neon PostgreSQL for authentication)
const webDB = new Pool({
    connectionString: process.env.WEB_DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// FiveM Database (MySQL - for player data)
// Note: If your FiveM database is also PostgreSQL, adjust accordingly
let fivemDB;
if (process.env.FIVEM_DB_TYPE === 'postgres') {
    fivemDB = new Pool({
        connectionString: process.env.FIVEM_DB_URL,
        ssl: process.env.FIVEM_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
} else {
    // MySQL connection for FiveM (fallback)
    const mysql = require('mysql2/promise');
    fivemDB = mysql.createPool({
        host: process.env.FIVEM_DB_HOST || 'localhost',
        user: process.env.FIVEM_DB_USER || 'root',
        password: process.env.FIVEM_DB_PASSWORD || '',
        database: process.env.FIVEM_DB_NAME || 'qbox',
        port: process.env.FIVEM_DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

// Test connections
webDB.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Website database (Neon) connection failed:', err.message);
    } else {
        console.log('✅ Website database (Neon) connected successfully');
    }
});

if (fivemDB.query) {
    fivemDB.query('SELECT 1', (err, res) => {
        if (err) {
            console.error('❌ FiveM database connection failed:', err.message);
        } else {
            console.log('✅ FiveM database connected successfully');
        }
    });
}

module.exports = {
    webDB,
    fivemDB
};

