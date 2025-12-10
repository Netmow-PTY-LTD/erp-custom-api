const { sequelize } = require('./src/core/database/sequelize');

async function addSupplierLocations() {
    try {
        // Update existing suppliers with location data
        await sequelize.query(`
            UPDATE suppliers 
            SET latitude = 40.7128, longitude = -74.0060 
            WHERE id = 1
        `);

        await sequelize.query(`
            UPDATE suppliers 
            SET latitude = 34.0522, longitude = -118.2437 
            WHERE id = 2
        `);

        console.log('✅ Supplier locations updated successfully');

        // Check purchase orders with supplier locations
        const [results] = await sequelize.query(`
            SELECT po.id, po.po_number, po.status, s.name as supplier_name, s.latitude, s.longitude
            FROM purchase_orders po
            JOIN suppliers s ON po.supplier_id = s.id
            WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL
            LIMIT 5
        `);

        console.log(`\n📍 Found ${results.length} purchase orders with supplier locations:`);
        results.forEach(po => {
            console.log(`- PO: ${po.po_number}, Supplier: ${po.supplier_name}, Location: (${po.latitude}, ${po.longitude})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

addSupplierLocations();
