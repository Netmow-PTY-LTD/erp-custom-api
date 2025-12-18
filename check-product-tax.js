/**
 * Check products table for purchase_tax column and values
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
        logging: false
    }
);

async function checkProductTax() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Check if purchase_tax column exists
        console.log('📋 Products table columns (tax-related):');
        const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME LIKE '%tax%'
      ORDER BY ORDINAL_POSITION
    `);
        console.table(columns);

        // Check sample products
        console.log('\n📊 Sample products with tax info:');
        const [products] = await sequelize.query(`
      SELECT id, name, sku, price, cost, purchase_tax, sales_tax
      FROM products
      WHERE id IN (5, 6)
      LIMIT 10
    `);
        console.table(products);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

checkProductTax();
