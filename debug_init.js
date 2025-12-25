const { sequelize } = require('./src/core/database/sequelize');
const { Role, RoleSettings } = require('./src/modules/roles/role.model');
const { User } = require('./src/modules/users/user.model');
const bcrypt = require('bcrypt');

async function debugInit() {
    try {
        console.log('Checking Superadmin...');

        let superRole = await Role.findOne({ where: { name: 'Superadmin' } });
        console.log('Role found:', superRole ? superRole.id : 'No');

        if (!superRole) {
            console.log('Creating Role...');
            superRole = await Role.create({
                name: 'Superadmin',
                display_name: 'Super Administrator',
                description: 'God mode access',
                status: 'active',
                permissions: ['*'] // Permissions field in model is JSON text? model.js says type TEXT, set/get JSON.
            });
            console.log('Creating Settings...');
            await RoleSettings.create({
                role_id: superRole.id,
                menu: JSON.stringify(['all']),
                dashboard: JSON.stringify(['all']),
                custom: JSON.stringify({ theme: 'system' })
            });
            console.log('✅ Auto-created Superadmin Role');
        }

        const adminEmail = 'admin@gmail.com';
        let adminUser = await User.findOne({ where: { email: adminEmail } });
        console.log('User found:', adminUser ? adminUser.id : 'No');

        if (!adminUser) {
            console.log('Creating User...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role_id: superRole.id
            });
            console.log('✅ Auto-created Superadmin User');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

debugInit();
