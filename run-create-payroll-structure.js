const { sequelize } = require('./src/core/database/sequelize');
// Ensure User model is loaded for relation
const { User } = require('./src/modules/users/user.model');
const { PayrollStructure } = require('./src/modules/payroll/payroll.structure.model');

async function migrate() {
    try {
        await PayrollStructure.sync({ alter: true });
        console.log('PayrollStructure table created/updated');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
