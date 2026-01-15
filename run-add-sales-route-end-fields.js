const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./src/core/database/sequelize');
const { SalesRoute } = require('./src/modules/sales/sales.models');

async function up() {
    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('sales_routes');

    const columnsToAdd = [
        { name: 'end_lat', type: DataTypes.FLOAT, allowNull: true },
        { name: 'end_lng', type: DataTypes.FLOAT, allowNull: true },
        { name: 'end_city', type: DataTypes.STRING(100), allowNull: true },
        { name: 'end_state', type: DataTypes.STRING(100), allowNull: true },
        { name: 'end_country', type: DataTypes.STRING(100), allowNull: true },
        { name: 'end_postal_code', type: DataTypes.STRING(20), allowNull: true }
    ];

    for (const column of columnsToAdd) {
        if (!tableInfo[column.name]) {
            console.log(`Adding column: ${column.name}`);
            await queryInterface.addColumn('sales_routes', column.name, {
                type: column.type,
                allowNull: column.allowNull
            });
        } else {
            console.log(`Column ${column.name} already exists.`);
        }
    }
}

up()
    .then(() => {
        console.log('Migration successful');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
