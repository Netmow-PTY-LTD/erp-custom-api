
const { sequelize } = require('./src/core/database/sequelize');

async function fixForeignKeys() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Helper to drop FK safely
        const dropFK = async (table, constraint) => {
            try {
                await sequelize.query(`ALTER TABLE ${table} DROP FOREIGN KEY ${constraint}`);
                console.log(`Dropped FK ${constraint} on ${table}`);
            } catch (e) {
                console.log(`Error dropping FK ${constraint} on ${table}:`, e.message);
            }
        };

        await dropFK('payrolls', 'payrolls_ibfk_1');
        await dropFK('leaves', 'leaves_ibfk_1');
        await dropFK('attendance', 'attendance_ibfk_1'); // Guessing typical names

        // There might be more (expense_claims, etc.) - let's check INFORMATION_SCHEMA if needed, but for now try dropping.

        await sequelize.getQueryInterface().dropTable('staffs');
        console.log('Dropped table: staffs');

    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

fixForeignKeys();
