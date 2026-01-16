require('dotenv').config();
const { sequelize } = require('./src/core/database/sequelize');

async function runMigration() {
    try {
        console.log('🔄 Running migration: Add authentication fields to staffs table...\n');

        // Add password column
        try {
            await sequelize.query(`
        ALTER TABLE staffs 
        ADD COLUMN password VARCHAR(255) NULL 
        COMMENT 'Hashed password for authentication. Null if staff member has no login access.' 
        AFTER email
      `);
            console.log('✅ Added password column');
        } catch (err) {
            if (err.message.includes('Duplicate column name')) {
                console.log('ℹ️  password column already exists');
            } else {
                throw err;
            }
        }

        // Add role_id column
        try {
            await sequelize.query(`
        ALTER TABLE staffs 
        ADD COLUMN role_id INT NULL 
        COMMENT 'Role ID for permissions. Null if staff member has no login access.' 
        AFTER password
      `);
            console.log('✅ Added role_id column');
        } catch (err) {
            if (err.message.includes('Duplicate column name')) {
                console.log('ℹ️  role_id column already exists');
            } else {
                throw err;
            }
        }

        // Add foreign key constraint if it doesn't exist
        try {
            await sequelize.query(`
        ALTER TABLE staffs 
        ADD CONSTRAINT fk_staffs_role_id 
        FOREIGN KEY (role_id) REFERENCES roles(id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
      `);
            console.log('✅ Added foreign key constraint');
        } catch (err) {
            if (err.message.includes('Duplicate key') || err.message.includes('already exists')) {
                console.log('ℹ️  Foreign key constraint already exists');
            } else {
                throw err;
            }
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('   1. Staff members can now have login credentials');
        console.log('   2. Use POST /api/staffs/add with password and role_id to create staff with login access');
        console.log('   3. Staff can login using their email and password at POST /api/auth/login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

runMigration();
