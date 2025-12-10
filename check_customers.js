const { sequelize } = require('./src/core/database/sequelize');
const { Customer } = require('./src/modules/customers/customers.model');

async function checkCustomers() {
    try {
        // Sync the model (create table if it doesn't exist)
        await sequelize.sync({ alter: false });

        // Count customers
        const count = await Customer.count();
        console.log(`Total customers in database: ${count}`);

        // Get customers with location
        const customersWithLocation = await Customer.count({
            where: {
                latitude: { [require('sequelize').Op.ne]: null },
                longitude: { [require('sequelize').Op.ne]: null }
            }
        });
        console.log(`Customers with location data: ${customersWithLocation}`);

        // Show sample customers
        const samples = await Customer.findAll({ limit: 3 });
        console.log('\nSample customers:');
        samples.forEach(c => {
            console.log(`- ID: ${c.id}, Name: ${c.name}, Lat: ${c.latitude}, Lng: ${c.longitude}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkCustomers();
