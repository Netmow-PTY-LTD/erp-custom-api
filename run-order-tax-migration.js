/**
 * Run order-level sales tax migration
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

async function runOrderTaxMigration() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.\n');

        // Migration: Add sales_tax_percent to orders
        console.log('▶️  Running: Add sales_tax_percent to orders');
        const migration = require('./src/core/database/migrations/20251218-add-sales-tax-percent-to-orders.js');
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        console.log('✅ Successfully added sales_tax_percent column to orders\n');

        console.log('🎉 Order-level tax migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

runOrderTaxMigration();
