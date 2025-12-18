/**
 * Run specific migrations for purchase order tax support
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

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

async function runPurchaseTaxMigrations() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.\n');

        // Migration 1: Add tax_amount, discount_amount, payment_status to purchase_orders
        console.log('▶️  Running: Add tax_amount, discount_amount, payment_status to purchase_orders');
        const migration1 = require('./src/core/database/migrations/20251218-add-tax-discount-payment-status-to-purchase-orders.js');
        await migration1.up(sequelize.getQueryInterface(), Sequelize);
        console.log('✅ Successfully added columns to purchase_orders\n');

        // Migration 2: Add discount and tax_amount to purchase_order_items
        console.log('▶️  Running: Add discount and tax_amount to purchase_order_items');
        const migration2 = require('./src/core/database/migrations/20251218-add-discount-tax-to-purchase-order-items.js');
        await migration2.up(sequelize.getQueryInterface(), Sequelize);
        console.log('✅ Successfully added columns to purchase_order_items\n');

        console.log('🎉 All purchase tax migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

runPurchaseTaxMigrations();
