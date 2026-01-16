const { sequelize } = require('./src/core/database/sequelize');
const { RoleSettings } = require('./src/modules/roles/role.model');
const { Op } = require('sequelize');

async function cleanupDuplicateSettings() {
    try {
        console.log('🔍 Checking for duplicate RoleSettings...');

        // Find all role_ids that appear more than once
        const duplicates = await RoleSettings.findAll({
            attributes: ['role_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['role_id'],
            having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id')), '>', 1)
        });

        for (const dup of duplicates) {
            const roleId = dup.role_id;
            console.log(`⚠️ Found duplicate settings for Role ID: ${roleId}`);

            // Get all settings for this role
            const settings = await RoleSettings.findAll({
                where: { role_id: roleId },
                order: [['id', 'DESC']] // Keep the latest one
            });

            // Keep the first one (latest), delete the rest
            const [keep, ...remove] = settings;

            for (const item of remove) {
                console.log(`🗑️ Deleting duplicate setting ID: ${item.id}`);
                await item.destroy();
            }
        }

        console.log('✅ Cleanup complete');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

cleanupDuplicateSettings();
