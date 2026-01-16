const { sequelize } = require('./src/core/database/sequelize');
const { User } = require('./src/modules/users/user.model');

async function checkUser() {
    try {
        const user = await User.findOne({ where: { email: 'admin@gmail.com' } });
        if (user) {
            console.log('User found:', user.toJSON());
        } else {
            console.log('User NOT found');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

checkUser();
