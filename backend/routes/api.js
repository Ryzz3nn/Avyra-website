const express = require('express');
const router = express.Router();

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
        // Fetch data from VPS API
        const response = await fetch(`${process.env.VPS_API_URL}/api/player/${discordId}`, {
            headers: {
                'x-api-key': process.env.VPS_API_KEY
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({ message: 'No characters found for this user.' });
            }
            throw new Error(`VPS API returned status ${response.status}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error('Error fetching character data from VPS:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

