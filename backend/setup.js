require('dotenv').config();
const { webDB } = require('./config/database');

const createCharactersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS characters (
            id SERIAL PRIMARY KEY,
            discord_id VARCHAR(255) NOT NULL,
            citizenid VARCHAR(255) NOT NULL,
            charinfo JSONB,
            job JSONB,
            money JSONB,
            playtime INT DEFAULT 0,
            player_name VARCHAR(255),
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(discord_id, citizenid)
        );
    `;

    try {
        await webDB.query(query);
        console.log('✅ "characters" table created or already exists.');
    } catch (err) {
        console.error('❌ Error creating "characters" table:', err);
    } finally {
        await webDB.end();
    }
};

createCharactersTable();

