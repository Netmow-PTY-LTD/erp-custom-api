const { sequelize } = require('./src/core/database/sequelize');
const { DataTypes } = require('sequelize');

async function migrate() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('products');

        if (!tableInfo.specification) {
            await queryInterface.addColumn('products', 'specification', {
                type: DataTypes.TEXT,
                allowNull: true,
            });
            console.log('Added specification column to products table');
        } else {
            console.log('specification column already exists');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
