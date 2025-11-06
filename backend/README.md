# Avyra Website Backend

Backend API for Avyra FiveM roleplay server player portal with Discord OAuth authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

**Required Configuration:**

- **Discord OAuth**: Register an application at [Discord Developer Portal](https://discord.com/developers/applications)
  - Create a new application
  - Go to OAuth2 → Add Redirect: `http://localhost:3000/auth/discord/callback`
  - Copy Client ID and Client Secret to `.env`

- **Database**: Use your FiveM server's database credentials
  - Same database as your QBCore/QBox server
  - Ensure database is accessible from backend server

- **Secrets**: Generate random strings for:
  - `SESSION_SECRET`
  - `JWT_SECRET`

### 3. Setup Database

Run the SQL script to create the web_users table:

```bash
mysql -u your_user -p your_database < database.sql
```

Or manually execute the SQL in your database management tool.

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:3000` (or your configured PORT)

## API Endpoints

### Authentication

- `GET /auth/discord` - Initiate Discord OAuth flow
- `GET /auth/discord/callback` - Discord OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/status` - Check authentication status

### User Data (Protected - requires authentication)

- `GET /api/user/profile` - Get user profile and Discord info
- `GET /api/user/characters` - Get all user's characters
- `GET /api/user/stats` - Get user statistics (playtime, total money, etc.)

## Database Schema

The backend connects to your existing FiveM database and creates one additional table:

**web_users** - Stores Discord authentication data
- `discord_id` - Discord user ID
- `discord_username` - Discord username
- `discord_avatar` - Discord avatar hash
- `discord_email` - Discord email
- Timestamps for creation and last login

## Security Features

- Helmet.js for HTTP security headers
- CORS configured for frontend origin
- Rate limiting on authentication routes
- Session-based authentication
- Environment variable protection

## Frontend Integration

Update your frontend (index.html/script.js) to:

1. Redirect login button to `http://localhost:3000/auth/discord`
2. Check auth status on page load: `GET /auth/status`
3. Fetch user data from API endpoints
4. Display character information in dashboard

## QBCore/QBox Database Structure

The backend expects the following in your `players` table:

- `identifiers` column containing JSON with Discord ID
- `charinfo` column with character information
- `job` column with job data
- `money` column with cash/bank data

Example identifiers format:
```json
["license:abc123", "discord:123456789", "steam:xyz789"]
```

## Troubleshooting

**Database Connection Failed**
- Verify database credentials in `.env`
- Ensure database server is running
- Check firewall/network access

**Discord OAuth Not Working**
- Verify redirect URL matches exactly
- Check Client ID and Secret are correct
- Ensure callback URL is whitelisted in Discord app

**CORS Errors**
- Verify `CORS_ORIGIN` in `.env` matches your frontend URL
- Check frontend is running on correct port

## Production Deployment

For production:

1. Set `NODE_ENV=production` in `.env`
2. Use HTTPS URLs for callback and website
3. Update Discord app with production redirect URL
4. Use a process manager like PM2
5. Consider using Redis for session storage
6. Setup proper logging and monitoring

```bash
npm install -g pm2
pm2 start server.js --name avyra-backend
pm2 startup
pm2 save
```

