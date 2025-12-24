const { Role } = require('./src/modules/roles/role.model');
const { sequelize } = require('./src/core/database/sequelize');

async function migrate() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('roles');

        if (!tableInfo.display_name) {
            await queryInterface.addColumn('roles', 'display_name', {
                type: require('sequelize').DataTypes.STRING(255),
                allowNull: true,
            });
            console.log('Added display_name column');
        }

        if (!tableInfo.description) {
            await queryInterface.addColumn('roles', 'description', {
                type: require('sequelize').DataTypes.TEXT,
                allowNull: true,
            });
            console.log('Added description column');
        }

        if (!tableInfo.status) {
            await queryInterface.addColumn('roles', 'status', {
                type: require('sequelize').DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
            });
            console.log('Added status column');
        }

        if (!tableInfo.permissions) {
            await queryInterface.addColumn('roles', 'permissions', {
                type: require('sequelize').DataTypes.TEXT,
                allowNull: true,
            });
            console.log('Added permissions column');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
