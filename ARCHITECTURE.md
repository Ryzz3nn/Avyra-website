# Avyra Website Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PLAYER'S BROWSER                        │
│                  (Visits avyra.com or localhost)                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        WEBSITE SERVER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Frontend (HTML/CSS/JS)                                  │  │
│  │  - index.html, script.js, style.css                      │  │
│  │  - Player views website here                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Backend (Node.js/Express)                               │  │
│  │  - server.js                                             │  │
│  │  - Discord OAuth authentication                          │  │
│  │  - API endpoints for player data                         │  │
│  └──────────────┬───────────────────────┬───────────────────┘  │
│                 │                       │                       │
│                 │                       │                       │
└─────────────────┼───────────────────────┼───────────────────────┘
                  │                       │
                  │                       │
         Connection to             Connection to
      Website Database          FiveM Server Database
                  │                       │
                  ▼                       ▼
┌──────────────────────────┐  ┌────────────────────────────────────┐
│  Website Database        │  │  FiveM Server                      │
│  (avyra_web)             │  │                                    │
│                          │  │  ┌──────────────────────────────┐ │
│  Tables:                 │  │  │  QBCore/QBox Database        │ │
│  - web_users             │  │  │  (qbox)                      │ │
│    (Discord login data)  │  │  │                              │ │
│                          │  │  │  Tables:                     │ │
│  Located:                │  │  │  - players                   │ │
│  - On website server     │  │  │  - player_vehicles           │ │
│  - Stores who logged in  │  │  │  - etc.                      │ │
│                          │  │  └──────────────────────────────┘ │
└──────────────────────────┘  │                                    │
                               │  Located:                          │
                               │  - On FiveM server                 │
                               │  - Backend reads player data       │
                               └────────────────────────────────────┘
```

## Data Flow

### 1. Player Logs In
```
Player clicks "Login" 
  → Backend redirects to Discord OAuth
  → Discord authenticates player
  → Backend saves Discord info in WEBSITE database (web_users table)
  → Player is logged in
```

### 2. Player Views Their Data
```
Player visits dashboard
  → Frontend asks: "GET /api/user/characters"
  → Backend checks: Is player logged in? (check web_users in Website DB)
  → Backend queries: FIVEM database for character data
  → Backend returns: Character info to frontend
  → Frontend displays: Player's characters, money, job, etc.
```

## Database Setup

### Website Database (avyra_web)
**Location:** Same server as website
**Purpose:** Store login/session data
**Access:** Full (READ/WRITE)

**How to create:**
1. On your website server, create database:
```sql
CREATE DATABASE avyra_web;
```

2. Run setup script:
```bash
cd backend
npm run setup
```

### FiveM Database (qbox)
**Location:** FiveM server (can be remote)
**Purpose:** Read player/character data
**Access:** READ ONLY (recommended)

**How to connect:**
1. If FiveM server is on different machine:
   - Allow remote MySQL connections
   - Configure firewall to allow port 3306
   - Use FiveM server IP in `.env`

2. If FiveM server is on same machine as website:
   - Use `localhost` in `.env`

## Security Notes

### Remote Database Access
If your FiveM database is on a different server, you need to:

1. **Allow remote MySQL access:**
```sql
-- On FiveM server
CREATE USER 'website_user'@'website_server_ip' IDENTIFIED BY 'strong_password';
GRANT SELECT ON qbox.* TO 'website_user'@'website_server_ip';
FLUSH PRIVILEGES;
```

2. **Configure MySQL:**
Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```
# Comment out or change:
# bind-address = 127.0.0.1
bind-address = 0.0.0.0
```

3. **Firewall:**
```bash
# Allow website server IP
ufw allow from website_server_ip to any port 3306
```

### Recommended: SSH Tunnel (Most Secure)
Instead of exposing MySQL, use SSH tunnel:

```bash
# On website server, create tunnel:
ssh -L 3307:localhost:3306 user@fivem-server-ip -N

# Then in .env use:
FIVEM_DB_HOST=localhost
FIVEM_DB_PORT=3307
```

## Configuration Summary

### Your .env file should have:

```env
# Website Database (localhost if on same server as website)
WEB_DB_HOST=localhost
WEB_DB_USER=root
WEB_DB_NAME=avyra_web

# FiveM Database
FIVEM_DB_HOST=192.168.1.100  # or localhost if same server
FIVEM_DB_USER=website_readonly
FIVEM_DB_NAME=qbox
```

## Quick Setup Checklist

- [ ] Website has its own database (avyra_web)
- [ ] Backend can connect to website database
- [ ] Backend can connect to FiveM database (local or remote)
- [ ] Discord OAuth configured
- [ ] Run `npm run setup` to create web_users table
- [ ] Test login flow
- [ ] Test data retrieval from FiveM database

