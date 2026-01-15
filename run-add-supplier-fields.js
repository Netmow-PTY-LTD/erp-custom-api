const { sequelize } = require('./src/core/database/sequelize');
const { DataTypes } = require('sequelize');

async function migrate() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('suppliers');

        if (!tableInfo.thumb_url) {
            await queryInterface.addColumn('suppliers', 'thumb_url', {
                type: DataTypes.STRING(255),
                allowNull: true,
            });
            console.log('Added thumb_url column');
        }

        if (!tableInfo.gallery_items) {
            await queryInterface.addColumn('suppliers', 'gallery_items', {
                type: DataTypes.JSON,
                allowNull: true,
            });
            console.log('Added gallery_items column');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
