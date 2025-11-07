const express = require('express');
const router = express.Router();
const { webDB } = require('../config/database');

// Middleware to protect the ingestion endpoint
const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.INGESTION_API_KEY) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
};

// POST /api/ingest - Receives player data from FiveM
router.post('/ingest', requireApiKey, async (req, res) => {
    const { discordId, citizenid, charinfo, job, money, playerName, playtime } = req.body;

    if (!discordId || !citizenid) {
        return res.status(400).json({ message: 'Missing required fields: discordId, citizenid' });
    }

    const upsertQuery = `
        INSERT INTO characters (discord_id, citizenid, charinfo, job, money, player_name, playtime, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (discord_id, citizenid)
        DO UPDATE SET
            charinfo = EXCLUDED.charinfo,
            job = EXCLUDED.job,
            money = EXCLUDED.money,
            player_name = EXCLUDED.player_name,
            playtime = EXCLUDED.playtime,
            last_updated = NOW();
    `;

    try {
        await webDB.query(upsertQuery, [discordId, citizenid, JSON.stringify(charinfo), JSON.stringify(job), JSON.stringify(money), playerName, playtime || 0]);
        res.status(200).json({ message: 'Player data updated successfully.' });
    } catch (err) {
        console.error('Error updating player data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
