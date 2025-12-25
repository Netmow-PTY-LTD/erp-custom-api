const { sequelize } = require('./src/core/database/sequelize');

async function fixOrder2() {
    try {
        console.log('🔧 Fixing Order 2...');

        // Check if Order 2 exists
        const [orders] = await sequelize.query("SELECT * FROM orders WHERE id = 2");
        if (orders.length === 0) {
            console.log('Order 2 not found.'); // Should not happen if seed ran
            return;
        }

        // Insert items for Order 2 
        // Product 3 (Office Chair) @ 250.00 x 2 = 500.00
        // Product 2 (Mouse) @ 25.00 x 1 = 25.00
        // Total = 525.00 matches Order 2 total_amount

        await sequelize.query(`
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total, total_price, created_at, updated_at) 
            VALUES 
            (2, 3, 2, 250.00, 500.00, 500.00, NOW(), NOW()),
            (2, 2, 1, 25.00, 25.00, 25.00, NOW(), NOW())
        `);

        console.log('✅ Inserted items for Order 2');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

fixOrder2();
