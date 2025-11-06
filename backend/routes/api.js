const express = require('express');
const router = express.Router();
const { webDB, fivemDB } = require('../config/database');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Get user profile
router.get('/user/profile', isAuthenticated, async (req, res) => {
    try {
        const discordId = req.user.discord_id;
        
        // Find player in FiveM database by Discord identifier
        const [players] = await fivemDB.query(
            `SELECT * FROM players WHERE JSON_CONTAINS(identifiers, JSON_QUOTE(?))`,
            [`discord:${discordId}`]
        );

        if (players.length === 0) {
            return res.json({
                discord: {
                    id: req.user.discord_id,
                    username: req.user.discord_username,
                    avatar: `https://cdn.discordapp.com/avatars/${req.user.discord_id}/${req.user.discord_avatar}.png`
                },
                fivem: null,
                message: 'No FiveM account linked'
            });
        }

        const player = players[0];

        res.json({
            discord: {
                id: req.user.discord_id,
                username: req.user.discord_username,
                avatar: `https://cdn.discordapp.com/avatars/${req.user.discord_id}/${req.user.discord_avatar}.png`
            },
            fivem: {
                server_id: player.citizenid,
                name: player.name,
                license: player.license
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Get user characters
router.get('/user/characters', isAuthenticated, async (req, res) => {
    try {
        const discordId = req.user.discord_id;
        
        // Find all characters for this Discord user
        const [players] = await fivemDB.query(
            `SELECT * FROM players WHERE JSON_CONTAINS(identifiers, JSON_QUOTE(?))`,
            [`discord:${discordId}`]
        );

        if (players.length === 0) {
            return res.json({ characters: [], total: 0 });
        }

        const characters = players.map(player => {
            let charinfo = {};
            let job = {};
            let money = {};
            
            try {
                charinfo = typeof player.charinfo === 'string' ? JSON.parse(player.charinfo) : player.charinfo;
                job = typeof player.job === 'string' ? JSON.parse(player.job) : player.job;
                money = typeof player.money === 'string' ? JSON.parse(player.money) : player.money;
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }

            return {
                citizenid: player.citizenid,
                firstname: charinfo.firstname || 'Unknown',
                lastname: charinfo.lastname || '',
                dob: charinfo.birthdate || 'Unknown',
                gender: charinfo.gender || 0,
                job: {
                    name: job.label || 'Unemployed',
                    grade: job.grade?.name || '0'
                },
                money: {
                    cash: money.cash || 0,
                    bank: money.bank || 0
                },
                last_updated: player.last_updated
            };
        });

        res.json({
            characters,
            total: characters.length
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

// Get user stats
router.get('/user/stats', isAuthenticated, async (req, res) => {
    try {
        const discordId = req.user.discord_id;
        
        // Get all characters
        const [players] = await fivemDB.query(
            `SELECT * FROM players WHERE JSON_CONTAINS(identifiers, JSON_QUOTE(?))`,
            [`discord:${discordId}`]
        );

        if (players.length === 0) {
            return res.json({
                total_characters: 0,
                total_playtime: 0,
                total_money: 0
            });
        }

        let totalMoney = 0;
        let totalPlaytime = 0;

        players.forEach(player => {
            try {
                const money = typeof player.money === 'string' ? JSON.parse(player.money) : player.money;
                totalMoney += (money.cash || 0) + (money.bank || 0);
            } catch (e) {}

            // If you have playtime tracking, add it here
            // totalPlaytime += player.playtime || 0;
        });

        res.json({
            total_characters: players.length,
            total_playtime: totalPlaytime, // in minutes
            total_money: totalMoney,
            first_joined: players[0].created_at || null
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;

