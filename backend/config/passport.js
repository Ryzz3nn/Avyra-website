const DiscordStrategy = require('passport-discord').Strategy;
const { webDB } = require('./database');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const result = await webDB.query('SELECT * FROM web_users WHERE id = $1', [id]);
            done(null, result.rows[0]);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ['identify', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists in database
            const existingUser = await webDB.query(
                'SELECT * FROM web_users WHERE discord_id = $1',
                [profile.id]
            );

            if (existingUser.rows.length > 0) {
                // User exists, update their info
                await webDB.query(
                    'UPDATE web_users SET discord_username = $1, discord_avatar = $2, last_login = CURRENT_TIMESTAMP WHERE discord_id = $3',
                    [profile.username, profile.avatar, profile.id]
                );
                return done(null, existingUser.rows[0]);
            } else {
                // Create new user
                const result = await webDB.query(
                    'INSERT INTO web_users (discord_id, discord_username, discord_avatar, discord_email) VALUES ($1, $2, $3, $4) RETURNING *',
                    [profile.id, profile.username, profile.avatar, profile.email]
                );

                return done(null, result.rows[0]);
            }
        } catch (error) {
            console.error('Error in Discord strategy:', error);
            return done(error, null);
        }
    }));
};

