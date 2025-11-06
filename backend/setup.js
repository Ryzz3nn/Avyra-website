const { webDB } = require('./config/database');

async function setupDatabase() {
    try {
        console.log('🔧 Setting up website database...');
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS web_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                discord_id VARCHAR(255) UNIQUE NOT NULL,
                discord_username VARCHAR(255),
                discord_avatar VARCHAR(255),
                discord_email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_discord_id (discord_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await webDB.query(createTableQuery);
        console.log('✅ Website database table created successfully!');
        console.log('📝 Table created: web_users');
        console.log('\n🎉 Setup complete! You can now run: npm start');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();

