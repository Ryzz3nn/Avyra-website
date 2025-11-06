# Using Neon Data API (Recommended for Netlify)

## Why Use Data API?

✅ **Perfect for Serverless** - No connection pooling issues  
✅ **HTTP-based** - Works great with Netlify Functions  
✅ **No connection limits** - REST API handles scaling  
✅ **Simpler deployment** - No pg driver complications  

## Setup Instructions

### 1. Enable Data API in Neon

1. Go to your Neon dashboard
2. Select your project
3. Navigate to **Data API** section
4. Enable the Data API
5. Copy the **API Endpoint URL** and **API Key**

Example:
- URL: `https://your-project-id.neon.tech/sql`
- API Key: `neon_api_xxxxxxxxxxxxx`

### 2. Update Your .env File

```env
# Use Neon Data API
NEON_API_URL=https://your-project-id.neon.tech/sql
NEON_API_KEY=neon_api_xxxxxxxxxxxxx
```

### 3. Switch to Data API Database Config

Update `backend/server.js` and other files that import database:

**Before:**
```javascript
const { webDB, fivemDB } = require('./config/database');
```

**After (using Data API):**
```javascript
const { webDB, fivemDB } = require('./config/database-api');
```

### 4. Run SQL Setup in Neon Dashboard

1. Go to Neon dashboard > SQL Editor
2. Copy contents of `backend/database.sql`
3. Paste and execute in SQL Editor
4. This creates the `web_users` table

## Files to Update

To use Data API instead of direct connection, change imports in these files:

### config/passport.js
```javascript
const { webDB } = require('./database-api');  // Changed from './database'
```

### routes/api.js
```javascript
const { webDB, fivemDB } = require('../config/database-api');  // Changed
```

### setup.js
```javascript
const { webDB } = require('./config/database-api');  // Changed
```

## Deployment to Netlify

### netlify.toml Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "cd backend && npm install"
  functions = "backend/functions"
  publish = "."

[[redirects]]
  from = "/auth/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[dev]
  command = "npm start"
  port = 3000
```

### Convert Backend to Netlify Functions

You'll need to convert your Express routes to Netlify Functions:

1. Create `backend/functions/` directory
2. Each route becomes a serverless function
3. Use `@netlify/functions` package

**Example Function (`backend/functions/auth.js`):**
```javascript
const { Handler } = require('@netlify/functions');
const passport = require('passport');
// ... your auth logic

exports.handler = async (event, context) => {
  // Handle Discord OAuth here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Auth response' })
  };
};
```

## Advantages vs Direct Connection

| Feature | Data API | Direct Connection |
|---------|----------|-------------------|
| Serverless | ✅ Perfect | ⚠️ Connection issues |
| Netlify Functions | ✅ Works great | ⚠️ Connection limits |
| Setup | ✅ Simple | ❌ Complex |
| Connection Pooling | ✅ Handled by Neon | ⚠️ Must manage |
| Scaling | ✅ Automatic | ⚠️ Manual |

## Testing Locally

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file with your Neon API credentials

3. Run the server:
```bash
npm start
```

4. Test the connection - you should see:
```
✅ Website database (Neon Data API) connected successfully
```

## Environment Variables in Netlify

Add these in Netlify dashboard > Site Settings > Environment Variables:

```
NEON_API_URL=https://your-project.neon.tech/sql
NEON_API_KEY=neon_api_xxxxx
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=https://your-site.netlify.app/auth/discord/callback
SESSION_SECRET=random_secret
JWT_SECRET=random_jwt_secret
FIVEM_DB_HOST=your_fivem_db_ip
FIVEM_DB_USER=root
FIVEM_DB_PASSWORD=password
FIVEM_DB_NAME=qbox_fef415
WEBSITE_URL=https://your-site.netlify.app
CORS_ORIGIN=https://your-site.netlify.app
```

## Troubleshooting

**Error: "API request failed"**
- Check your API key is correct
- Verify the endpoint URL
- Make sure Data API is enabled in Neon

**Error: "fetch is not defined"**
- Node.js < 18: Install `node-fetch`
```bash
npm install node-fetch
```
Then import it:
```javascript
const fetch = require('node-fetch');
```

**Connection to FiveM database fails**
- Ensure FiveM database allows remote connections
- Check firewall rules
- Consider using SSH tunnel for security

## Next Steps

1. ✅ Enable Neon Data API
2. ✅ Update .env with API credentials
3. ✅ Run SQL setup in Neon dashboard
4. ✅ Test locally
5. ✅ Deploy to Netlify
6. ✅ Configure environment variables in Netlify
7. ✅ Test production deployment

