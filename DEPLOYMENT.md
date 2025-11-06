# Avyra Website Deployment Guide

## Hosting Options

### Option 1: All-in-One Server (Easiest)

Host both frontend and backend on the same VPS/server:

**Requirements:**
- VPS with Node.js installed (DigitalOcean, Linode, AWS, etc.)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt is free)

**Setup:**
1. Upload entire project to server
2. Install Node.js dependencies
3. Configure Nginx to serve frontend and proxy backend
4. Use PM2 to keep backend running

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name avyra.com;

    # Frontend (static files)
    location / {
        root /var/www/avyra-website;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /auth {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Deployment Steps:**
```bash
# On your server
cd /var/www/avyra-website/backend
npm install
npm run setup  # Creates database table
pm2 start server.js --name avyra-backend
pm2 startup
pm2 save

# Configure Nginx
sudo nano /etc/nginx/sites-available/avyra
# Paste config above
sudo ln -s /etc/nginx/sites-available/avyra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Separate Hosting

**Frontend:** Static hosting (GitHub Pages, Netlify, Vercel)
**Backend:** VPS or PaaS (Heroku, Railway, Render)

Pros: Frontend is free/cheap, easy to deploy
Cons: Need CORS configuration, two deployments

### Option 3: Same Server as FiveM (If it has public access)

If your FiveM server allows it:
```bash
# On FiveM server
cd /path/to/fivem
git clone https://github.com/Ryzz3nn/Avyra-website.git
cd Avyra-website/backend
npm install
npm run setup
pm2 start server.js
```

Then use Nginx/Apache to serve the frontend and proxy the backend.

## Recommended: All-in-One Setup

For your use case, I recommend **Option 1** - hosting everything on one VPS:

1. **Cheap VPS** ($5-10/month):
   - DigitalOcean Droplet
   - Linode
   - Vultr
   - Hetzner

2. **Domain name** (optional):
   - avyra.com or similar
   - Point to your VPS IP

3. **SSL Certificate** (free):
   - Certbot/Let's Encrypt

4. **Setup takes ~30 minutes**

## Quick Deploy Script

I can create a deployment script for you. Would you like that?

## Database Access

**Important:** Your website backend needs access to your FiveM database:

**If FiveM and website are on same server:**
- Use `localhost` or `127.0.0.1`
- No additional configuration needed

**If FiveM and website are on different servers:**
- Allow remote MySQL connections
- Use FiveM server IP in backend `.env`
- Configure MySQL firewall rules
- **Security:** Use SSH tunnel or VPN for production

