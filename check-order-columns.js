const { sequelize } = require('./src/core/database/sequelize');

async function checkColumns() {
    try {
        const [results] = await sequelize.query("DESCRIBE orders;");
        console.log('Orders Table Columns:', results.map(c => c.Field));

        const [itemResults] = await sequelize.query("DESCRIBE order_items;");
        console.log('Order Items Table Columns:', itemResults.map(c => c.Field));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkColumns();
