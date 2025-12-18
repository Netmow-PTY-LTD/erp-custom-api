/**
 * Run sales tax migration
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: console.log
    }
);

async function runSalesTaxMigration() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.\n');

        // Migration: Add tax_amount to order_items
        console.log('▶️  Running: Add tax_amount to order_items');
        const migration = require('./src/core/database/migrations/20251218-add-tax-to-order-items.js');
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        console.log('✅ Successfully added tax_amount column to order_items\n');

        console.log('🎉 Sales tax migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

runSalesTaxMigration();
