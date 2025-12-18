/**
 * Run purchase item tax percent migration
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

async function runPurchaseItemTaxPercentMigration() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.\n');

        // Migration: Add purchase_tax_percent to purchase_order_items
        console.log('▶️  Running: Add purchase_tax_percent to purchase_order_items');
        const migration = require('./src/core/database/migrations/20251218-add-purchase-tax-percent-to-purchase-order-items.js');
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        console.log('✅ Successfully added purchase_tax_percent column to purchase_order_items\n');

        console.log('🎉 Purchase item tax percent migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

runPurchaseItemTaxPercentMigration();
