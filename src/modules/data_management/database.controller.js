const { sequelize } = require('../../core/database/sequelize');
const { success, error } = require('../../core/utils/response');
const AccountingService = require('../accounting/accounting.service');
const { User } = require('../users/user.model');
const { Role, RoleSettings } = require('../roles/role.model');
const bcrypt = require('bcrypt');

class DatabaseController {

  async getTables(req, res) {
    try {
      // Fetch all table names
      const tables = await sequelize.getQueryInterface().showAllTables();
      return success(res, 'Tables retrieved successfully', tables);
    } catch (err) {
      return error(res, err.message, 500);
    }
  }

  async getTableData(req, res) {
    try {
      const { tableName } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Basic validation to prevent SQL injection or viewing sensitive system tables if needed
      // Assuming validation is handled or admin-only access

      // Count total
      const countQuery = `SELECT COUNT(*) as total FROM \`${tableName}\``;
      const [countResult] = await sequelize.query(countQuery);
      const total = countResult[0].total;

      // Fetch paginated data
      const dataQuery = `SELECT * FROM \`${tableName}\` LIMIT ${limit} OFFSET ${offset}`;
      const [data] = await sequelize.query(dataQuery);

      return success(res, 'Table data retrieved successfully', {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPage: Math.ceil(total / limit)
        }
      });

    } catch (err) {
      return error(res, err.message, 500);
    }
  }

  async updateTableRow(req, res) {
    try {
      const { tableName } = req.params;
      const { id, ...updateData } = req.body;

      // Validate that ID is provided
      if (!id) {
        return error(res, 'ID is required to update a record', 400);
      }

      // Validate that there is data to update
      if (Object.keys(updateData).length === 0) {
        return error(res, 'No data provided for update', 400);
      }

      // Build SET clause dynamically
      const setClause = Object.keys(updateData)
        .map(key => `\`${key}\` = ?`)
        .join(', ');

      const values = Object.values(updateData);
      values.push(id); // Add ID for WHERE clause

      // Execute update query
      const updateQuery = `UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`;
      await sequelize.query(updateQuery, {
        replacements: values,
        type: sequelize.QueryTypes.UPDATE
      });

      // Fetch updated record
      const selectQuery = `SELECT * FROM \`${tableName}\` WHERE id = ?`;
      const [updatedRecord] = await sequelize.query(selectQuery, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      });

      return success(res, 'Record updated successfully', updatedRecord);

    } catch (err) {
      return error(res, err.message, 500);
    }
  }

  async deleteAllData(req, res) {
    try {
      const tables = await sequelize.getQueryInterface().showAllTables();
      const skipTables = ['SequelizeMeta', 'migrations']; // Standard sequelize tables to skip

      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      for (const table of tables) {
        if (!skipTables.includes(table)) {
          await sequelize.query(`TRUNCATE TABLE \`${table}\``);
        }
      }

      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

      // --- Seed Accounting Essentials ---
      await AccountingService.seedAccounts();

      // --- Seed Core Roles ---
      const [adminRole] = await Role.findOrCreate({
        where: { name: 'Admin' },
        defaults: {
          display_name: 'Administrator',
          description: 'Full system access',
          status: 'active',
          permissions: ['*']
        }
      });

      await RoleSettings.findOrCreate({
        where: { role_id: adminRole.id },
        defaults: {
          role_id: adminRole.id,
          menu: JSON.stringify([]),
          dashboard: JSON.stringify([]),
          custom: JSON.stringify({})
        }
      });

      const [superadminRole] = await Role.findOrCreate({
        where: { name: 'Superadmin' },
        defaults: {
          display_name: 'Super Administrator',
          description: 'Full system access',
          status: 'active',
          permissions: ['*']
        }
      });

      await RoleSettings.findOrCreate({
        where: { role_id: superadminRole.id },
        defaults: {
          role_id: superadminRole.id,
          menu: JSON.stringify([]),
          dashboard: JSON.stringify([]),
          custom: JSON.stringify({})
        }
      });

      // --- Seed Admin User ---
      const hashedPassword = await bcrypt.hash('password', 10);
      await User.findOrCreate({
        where: { email: 'admin@erp.com' },
        defaults: {
          name: 'Admin User',
          email: 'admin@erp.com',
          password: hashedPassword,
          role_id: adminRole.id,
          status: 'active'
        }
      });

      return success(res, 'All data deleted and accounting essentials seeded successfully');
    } catch (err) {
      // Ensure FK checks are re-enabled even on error
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      return error(res, err.message, 500);
    }
  }
}

module.exports = new DatabaseController();
