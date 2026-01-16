require('dotenv').config();
const { sequelize } = require('./src/core/database/sequelize');

async function runMigration() {
    try {
        console.log('🔄 Running migration: Add profile fields to users table...\n');

        // Add phone column
        try {
            await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN phone VARCHAR(50) NULL 
        AFTER email
      `);
            console.log('✅ Added phone column');
        } catch (err) {
            if (err.message.includes('Duplicate column name')) {
                console.log('ℹ️  phone column already exists');
            } else {
                throw err;
            }
        }

        // Add thumb_url column
        try {
            await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN thumb_url VARCHAR(500) NULL 
        AFTER phone
      `);
            console.log('✅ Added thumb_url column');
        } catch (err) {
            if (err.message.includes('Duplicate column name')) {
                console.log('ℹ️  thumb_url column already exists');
            } else {
                throw err;
            }
        }

        console.log('\n✅ Migration completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

runMigration();
