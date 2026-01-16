const { sequelize } = require('./src/core/database/sequelize');

async function cleanDatabase() {
    try {
        console.log('🧹 Cleaning database...');

        // Disable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        // Truncate tables in specific order to be safe (though FK checks are off)
        const tables = [
            'purchase_receipts', 'purchase_payments', 'purchase_invoices', 'purchase_order_items', 'purchase_orders', // Purchase module
            'deliveries', 'payments', 'invoices', 'order_items', 'orders', 'stock_movements', 'sales_routes', 'warehouses', // Sales module
            'staffs', 'departments', // HR
            'products', 'suppliers', 'customers', 'units', 'categories', // Core data
            'users', 'roles' // Auth
        ];

        for (const table of tables) {
            try {
                await sequelize.query(`TRUNCATE TABLE ${table}`);
                console.log(`✅ Truncated ${table}`);
            } catch (err) {
                // If table doesn't exist, just ignore
                if (err.parent && err.parent.code === 'ER_NO_SUCH_TABLE') {
                    // console.log(`⚠️ Table ${table} does not exist, skipping.`);
                } else {
                    console.error(`❌ Error truncating ${table}:`, err.message);
                }
            }
        }

        // Enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✨ All tables cleaned successfully.');
    } catch (error) {
        console.error('❌ Database cleaning failed:', error);
    } finally {
        await sequelize.close();
    }
}

cleanDatabase();
