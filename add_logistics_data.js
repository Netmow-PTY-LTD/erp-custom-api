const { sequelize } = require('./src/core/database/sequelize');

async function addLogisticsData() {
    try {
        // Update product 1 with logistics data
        await sequelize.query(`
            UPDATE products 
            SET 
                weight = 0.15,
                length = 12.5,
                width = 7.0,
                height = 4.0
            WHERE id = 1
        `);

        console.log('✅ Logistics data added to product 1');

        // Check the product
        const [results] = await sequelize.query(`
            SELECT id, name, sku, weight, length, width, height
            FROM products 
            WHERE id = 1
        `);

        if (results.length > 0) {
            const product = results[0];
            console.log(`\n📦 Product: ${product.name} (${product.sku})`);
            console.log(`   Weight: ${product.weight} kg`);
            console.log(`   Dimensions: ${product.length} x ${product.width} x ${product.height} cm`);

            // Calculate volume
            if (product.length && product.width && product.height) {
                const volume = (product.length * product.width * product.height) / 1000; // in liters
                console.log(`   Volume: ${volume.toFixed(2)} L`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

addLogisticsData();
