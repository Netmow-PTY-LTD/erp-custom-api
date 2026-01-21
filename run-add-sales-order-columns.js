const { sequelize } = require('./src/core/database/sequelize');
const { DataTypes } = require('sequelize');

async function migrate() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const ordersTableInfo = await queryInterface.describeTable('orders');

        if (!ordersTableInfo.delivery_date) {
            await queryInterface.addColumn('orders', 'delivery_date', {
                type: DataTypes.DATE,
                allowNull: true,
            });
            console.log('Added delivery_date column to orders table');
        } else {
            console.log('delivery_date column already exists in orders table');
        }

        const orderItemsTableInfo = await queryInterface.describeTable('order_items');

        if (!orderItemsTableInfo.notes) {
            await queryInterface.addColumn('order_items', 'notes', {
                type: DataTypes.TEXT,
                allowNull: true,
            });
            console.log('Added notes column to order_items table');
        } else {
            console.log('notes column already exists in order_items table');
        }

        if (!orderItemsTableInfo.remark) {
            await queryInterface.addColumn('order_items', 'remark', {
                type: DataTypes.TEXT,
                allowNull: true,
            });
            console.log('Added remark column to order_items table');
        } else {
            console.log('remark column already exists in order_items table');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
