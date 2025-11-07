-- This script is for PostgreSQL.

-- Create web_users table for storing Discord authentication data
CREATE TABLE IF NOT EXISTS web_users (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    discord_username VARCHAR(255),
    discord_avatar VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to update the last_login timestamp
CREATE OR REPLACE FUNCTION update_last_login_func()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that executes the function before an update on web_users
DROP TRIGGER IF EXISTS on_user_update ON web_users; -- Drop existing trigger to avoid errors on re-run
CREATE TRIGGER on_user_update
BEFORE UPDATE ON web_users
FOR EACH ROW
EXECUTE FUNCTION update_last_login_func();

-- Create characters table to store synced data from the FiveM server
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


