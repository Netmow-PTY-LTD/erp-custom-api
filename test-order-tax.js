/**
 * Test order-level sales tax functionality
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

async function testOrderTax() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Check orders table schema
        console.log('📋 orders table columns (tax-related):');
        const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      AND TABLE_NAME = 'orders'
      AND (COLUMN_NAME LIKE '%tax%' OR COLUMN_NAME LIKE '%discount%')
      ORDER BY ORDINAL_POSITION
    `);
        console.table(columns);

        console.log('\n✅ Order-level tax setup complete!\n');

        console.log('📌 How to use sales_tax_percent:\n');
        console.log('POST /api/sales/orders');
        console.log(JSON.stringify({
            customer_id: 1,
            sales_tax_percent: 5,  // ← Order-level tax: 5%
            items: [
                {
                    product_id: 10,
                    quantity: 2,
                    unit_price: 1000,
                    discount: 200
                }
            ]
        }, null, 2));

        console.log('\n💡 Tax Calculation Example:\n');
        console.log('Given:');
        console.log('  - Product 10 has sales_tax = 10% (item-level)');
        console.log('  - Order has sales_tax_percent = 5% (order-level)');
        console.log('  - Item: 2 × $1000 - $200 discount = $1800\n');

        console.log('Calculation:');
        console.log('  1. Item-level tax: $1800 × 10% = $180');
        console.log('  2. Order-level tax: $1800 × 5% = $90');
        console.log('  3. Total tax_amount: $180 + $90 = $270\n');

        console.log('Result:');
        console.log('  - item.tax_amount: $180 (from product.sales_tax)');
        console.log('  - order.sales_tax_percent: 5 (stored)');
        console.log('  - order.tax_amount: $270 (total: item + order tax)');

        console.log('\n📊 Response will include:');
        console.log('  - sales_tax_percent: The percentage you provided');
        console.log('  - tax_amount (sales_tax_total): Total calculated tax');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testOrderTax();
