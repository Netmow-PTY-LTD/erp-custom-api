const { sequelize } = require('./src/core/database/sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function generateTestToken() {
    try {
        // Query to get a user
        const [users] = await sequelize.query('SELECT id, email, role_id FROM users LIMIT 1');

        if (users.length === 0) {
            console.log('No users found in database');
            process.exit(1);
        }

        const user = users[0];
        console.log('User found:', user.email);

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log('\nGenerated Token:');
        console.log(token);
        console.log('\nTest the /maps endpoint with:');
        console.log(`curl -H "Authorization: Bearer ${token}" http://192.168.68.103:5000/api/customers/maps`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

generateTestToken();
