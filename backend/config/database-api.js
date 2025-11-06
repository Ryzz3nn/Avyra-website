// Neon Data API Client (REST-based - perfect for Netlify/Serverless)
require('dotenv').config();

const NEON_API_URL = process.env.NEON_API_URL; // Your Neon REST API endpoint
const NEON_API_KEY = process.env.NEON_API_KEY; // Your Neon API key

// Helper function to execute queries via Data API
async function executeQuery(sql, params = []) {
    try {
        const response = await fetch(NEON_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NEON_API_KEY}`
            },
            body: JSON.stringify({
                query: sql,
                params: params
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Neon Data API Error:', error);
        throw error;
    }
}

// Website Database (Neon Data API)
const webDB = {
    query: async (sql, params = []) => {
        const result = await executeQuery(sql, params);
        return {
            rows: result.rows || [],
            rowCount: result.rowCount || 0
        };
    }
};

// FiveM Database (MySQL - keep as is)
let fivemDB;
if (process.env.FIVEM_DB_TYPE === 'mysql') {
    const mysql = require('mysql2/promise');
    fivemDB = mysql.createPool({
        host: process.env.FIVEM_DB_HOST || '127.0.0.1',
        user: process.env.FIVEM_DB_USER || 'root',
        password: process.env.FIVEM_DB_PASSWORD || '',
        database: process.env.FIVEM_DB_NAME || 'qbox_fef415',
        port: process.env.FIVEM_DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

// Test connections
(async () => {
    try {
        await webDB.query('SELECT NOW()');
        console.log('✅ Website database (Neon Data API) connected successfully');
    } catch (err) {
        console.error('❌ Website database (Neon Data API) connection failed:', err.message);
    }

    if (fivemDB) {
        try {
            await fivemDB.query('SELECT 1');
            console.log('✅ FiveM database connected successfully');
        } catch (err) {
            console.error('❌ FiveM database connection failed:', err.message);
        }
    }
})();

module.exports = {
    webDB,
    fivemDB
};

