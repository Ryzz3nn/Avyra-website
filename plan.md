# Avyra Website - Discord/CFX Authentication Plan

## Overview
Implement Discord OAuth authentication integrated with CFX (FiveM) to verify users and display their in-game data.

## Authentication Flow
- [x] User clicks "Player Login" button
- [x] Redirect to Discord OAuth page
- [x] User authorizes the application
- [ ] Backend receives Discord token and user info
- [ ] Backend queries CFX API to match Discord ID with FiveM identifiers
- [ ] Backend fetches player data from FiveM server database
- [ ] Create/update user session
- [x] Redirect back to website with authenticated session
- [ ] Display player dashboard with their data

## Backend Requirements

### 1. Setup Node.js/Express Backend
- [ ] Initialize Node.js project
- [ ] Install dependencies (express, passport, discord.js, etc.)
- [ ] Create basic server structure
- [ ] Setup environment variables (.env)

### 2. Discord OAuth Integration
- [ ] Register Discord application at https://discord.com/developers
- [ ] Get Client ID and Client Secret
- [ ] Implement Discord OAuth flow using Passport.js
- [ ] Store Discord user info (ID, username, avatar)

### 3. CFX Integration
- [ ] Connect to FiveM server database (MySQL/MariaDB)
- [ ] Query player data by Discord identifier
- [ ] Fetch character information:
  - Character name(s)
  - Job/gang information
  - Bank balance
  - Inventory/vehicles
  - Play time
  - Last seen
  - Any other relevant stats

### 4. Session Management
- [ ] Implement session storage (Redis or database)
- [ ] Create JWT tokens for authentication
- [ ] Setup cookie handling
- [ ] Implement logout functionality

### 5. API Endpoints
- [ ] `GET /auth/discord` - Initiate Discord OAuth
- [ ] `GET /auth/discord/callback` - Handle OAuth callback
- [ ] `GET /auth/logout` - Logout user
- [ ] `GET /api/user/profile` - Get current user profile
- [ ] `GET /api/user/characters` - Get user's characters
- [ ] `GET /api/user/stats` - Get user's stats

## Frontend Updates

### 1. Authentication State Management
- [ ] Add user state management (logged in/out)
- [ ] Update login button to show user info when logged in
- [ ] Add logout functionality

### 2. Player Dashboard
- [ ] Create dashboard page/section
- [ ] Display user's Discord info (avatar, username)
- [ ] Display character information
- [ ] Show stats and data from FiveM server
- [ ] Add character selector if user has multiple characters

### 3. Protected Routes
- [ ] Restrict certain pages to authenticated users only
- [ ] Add loading states during authentication

## Database Schema

### Users Table
```sql
CREATE TABLE web_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    discord_username VARCHAR(255),
    discord_avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Sessions Table (if not using Redis)
```sql
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    data TEXT,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES web_users(id)
);
```

## Security Considerations
- [ ] Use HTTPS in production
- [ ] Implement CORS properly
- [ ] Sanitize all user inputs
- [ ] Rate limit authentication endpoints
- [ ] Secure session tokens
- [ ] Don't expose sensitive server data
- [ ] Implement CSRF protection

## Environment Variables Needed
```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
SESSION_SECRET=random_secret_key
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=random_jwt_secret
WEBSITE_URL=http://localhost:5500
```

## Tech Stack
- **Backend**: Node.js + Express
- **Authentication**: Passport.js (Discord Strategy)
- **Database**: MySQL/MariaDB (same as FiveM server)
- **Session Storage**: Express-session + Redis (optional)
- **Security**: Helmet, CORS, express-rate-limit

## Development Phases

### Phase 1: Backend Setup (Current)
- Setup Node.js project structure
- Configure Discord OAuth
- Connect to FiveM database
- Create basic API endpoints

### Phase 2: Frontend Integration
- [x] Update login flow to use OAuth
- [ ] Create player dashboard
- [ ] Display character data

### Phase 3: Advanced Features
- Multiple character support
- Real-time data updates
- Additional stats and leaderboards
- Admin panel (future)

## Testing Checklist
- [ ] Test Discord OAuth flow
- [ ] Verify CFX data retrieval
- [ ] Test session persistence
- [ ] Test logout functionality
- [ ] Test with multiple characters
- [ ] Test error handling
- [ ] Test rate limiting
- [ ] Security audit

## Notes
- Ensure FiveM server database has Discord identifiers stored
- Consider caching frequently accessed data
- Plan for scalability if player base grows
- Keep sensitive server data private

