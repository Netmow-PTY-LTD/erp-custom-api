const { PayrollRun, PayrollItem } = require('./payroll.models');
const { PayrollStructure } = require('./payroll.structure.model');
const { User: Staff } = require('../users/user.model');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

class PayrollRepository {
    async createRun(runData, itemsData) {
        const transaction = await sequelize.transaction();
        try {
            const run = await PayrollRun.create(runData, { transaction });

            const items = itemsData.map(item => ({
                ...item,
                run_id: run.id
            }));

            await PayrollItem.bulkCreate(items, { transaction });

            await transaction.commit();
            return await this.findById(run.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.month) where.month = filters.month;
        if (filters.status) where.status = filters.status;

        return await PayrollRun.findAndCountAll({
            where,
            limit,
            offset,
            order: [['month', 'DESC']]
        });
    }

    async findById(id) {
        return await PayrollRun.findByPk(id, {
            include: [{
                model: PayrollItem,
                as: 'items',
                include: [{
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'position']
                }]
            }]
        });
    }

    async updateStatus(id, status, paymentDate = null) {
        const run = await PayrollRun.findByPk(id);
        if (!run) return null;

        const updateData = { status };
        if (paymentDate) {
            updateData.payment_date = paymentDate;
        }

        return await run.update(updateData);
    }

    async delete(id) {
        const transaction = await sequelize.transaction();
        try {
            await PayrollItem.destroy({ where: { run_id: id }, transaction });
            const result = await PayrollRun.destroy({ where: { id }, transaction });
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
            throw error;
        }
    }

    async getStructure(staffId) {
        return await PayrollStructure.findOne({ where: { user_id: staffId } });
    }

    async upsertStructure(staffId, data) {
        // Data contains basic_salary, allowances, deductions, bank_details
        const [structure, created] = await PayrollStructure.findOrCreate({
            where: { user_id: staffId },
            defaults: { ...data, user_id: staffId }
        });

        if (!created) {
            return await structure.update(data);
        }
        return structure;
    }
}

module.exports = new PayrollRepository();
