-- Create web_users table for Discord authentication (PostgreSQL/Neon)
CREATE TABLE IF NOT EXISTS web_users (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    discord_username VARCHAR(255),
    discord_avatar VARCHAR(255),
    discord_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for discord_id
CREATE INDEX IF NOT EXISTS idx_discord_id ON web_users(discord_id);

-- Create function to auto-update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating last_login
DROP TRIGGER IF EXISTS trigger_update_last_login ON web_users;
CREATE TRIGGER trigger_update_last_login
BEFORE UPDATE ON web_users
FOR EACH ROW
EXECUTE FUNCTION update_last_login();


