const { sequelize } = require('./src/core/database/sequelize');

async function migrate() {
    const tables = [
        'users',
        'departments',
        'boms',
        'roles',
        'warehouses',
        'sales_routes',
        'products',
        'categories',
        'units'
    ];

    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return;
    }

    for (const table of tables) {
        try {
            // Check if column exists first to avoid error spam
            const [columns] = await sequelize.query(`SHOW COLUMNS FROM ${table} LIKE 'created_by'`);

            if (columns.length === 0) {
                await sequelize.query(`
                    ALTER TABLE ${table}
                    ADD COLUMN created_by INT NULL;
                `);
                console.log(`Added created_by to ${table}`);

                try {
                    await sequelize.query(`
                        CREATE INDEX idx_${table}_created_by ON ${table}(created_by);
                    `);
                    console.log(`Added index to ${table}`);
                } catch (idxError) {
                    console.log(`Index creation failed for ${table} (might exist):`, idxError.message);
                }
            } else {
                console.log(`created_by already exists in ${table}`);
            }

        } catch (error) {
            console.error(`Error updating ${table}:`, error.message);
        }
    }
}

migrate().then(() => {
    console.log('Migration complete');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
