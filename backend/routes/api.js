const express = require('express');
const router = express.Router();
const { webDB } = require('../config/database');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You are not authenticated' });
}

// GET /api/user/characters - Get all characters for the logged-in user
router.get('/user/characters', isAuthenticated, async (req, res) => {
    const discordId = req.user.discord_id;

    if (!discordId) {
        return res.status(400).json({ message: 'Discord ID not found in session.' });
    }

    try {
        const query = 'SELECT * FROM characters WHERE discord_id = $1';
        const { rows } = await webDB.query(query, [discordId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No characters found for this user.' });
        }
        
        // The data is already stored as JSON, so we just return it.
        res.json({ characters: rows });

    } catch (err) {
        console.error('Error fetching character data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

