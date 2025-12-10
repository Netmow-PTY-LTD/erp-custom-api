const { sequelize } = require('./src/core/database/sequelize');
const { User } = require('./src/modules/users/users.model');

async function checkUsers() {
    try {
        const users = await User.findAll({ limit: 5, attributes: ['id', 'name', 'email'] });
        console.log('Available users:');
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
