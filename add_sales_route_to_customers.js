const { sequelize } = require('./src/core/database/sequelize');

async function addSalesRouteIdToCustomers() {
    try {
        console.log('🔧 Adding sales_route_id column to customers table...');

        // Check if column exists
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'customers' 
            AND COLUMN_NAME = 'sales_route_id'
        `);

        if (results.length > 0) {
            console.log('✅ Column sales_route_id already exists');
        } else {
            await sequelize.query(`
                ALTER TABLE customers 
                ADD COLUMN sales_route_id INT NULL,
                ADD CONSTRAINT fk_customers_sales_route 
                FOREIGN KEY (sales_route_id) REFERENCES sales_routes(id) 
                ON DELETE SET NULL
            `);
            console.log('✅ Column sales_route_id added successfully');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await sequelize.close();
    }
}

addSalesRouteIdToCustomers();
