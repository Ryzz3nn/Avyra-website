const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Discord OAuth
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: `${process.env.WEBSITE_URL}?error=auth_failed` }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${process.env.WEBSITE_URL}?auth=success`);
    }
);

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect(process.env.WEBSITE_URL);
    });
});

// Check auth status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                discord_id: req.user.discord_id,
                username: req.user.discord_username,
                avatar: req.user.discord_avatar
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;

