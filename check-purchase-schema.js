/**
 * Check database schema for purchase order tables
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

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Check purchase_orders columns
        console.log('📋 purchase_orders table columns:');
        const [poColumns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      AND TABLE_NAME = 'purchase_orders'
      ORDER BY ORDINAL_POSITION
    `);
        console.table(poColumns);

        // Check purchase_order_items columns
        console.log('\n📋 purchase_order_items table columns:');
        const [poiColumns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      AND TABLE_NAME = 'purchase_order_items'
      ORDER BY ORDINAL_POSITION
    `);
        console.table(poiColumns);

        // Check sample data
        console.log('\n📊 Sample purchase order with items:');
        const [sampleData] = await sequelize.query(`
      SELECT 
        po.id, po.po_number, po.total_amount, po.tax_amount, po.discount_amount,
        poi.id as item_id, poi.product_id, poi.quantity, poi.unit_cost, 
        poi.discount as item_discount, poi.line_total, poi.tax_amount as item_tax_amount
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      ORDER BY po.id DESC
      LIMIT 5
    `);
        console.table(sampleData);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkSchema();
