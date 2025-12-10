const { Payroll } = require('./payroll.models');
const { Staff } = require('../staffs/staffs.model');

class PayrollRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.staff_id) where.staff_id = filters.staff_id;
        if (filters.month) where.month = filters.month;
        if (filters.year) where.year = filters.year;
        if (filters.status) where.status = filters.status;

        return await Payroll.findAndCountAll({
            where,
            include: [{
                model: Staff,
                as: 'staff',
                attributes: ['id', 'first_name', 'last_name', 'email', 'position']
            }],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });
    }

    async findById(id) {
        return await Payroll.findByPk(id, {
            include: [{
                model: Staff,
                as: 'staff',
                attributes: ['id', 'first_name', 'last_name', 'email', 'position']
            }]
        });
    }

    async create(data) {
        return await Payroll.create(data);
    }

    async update(id, data) {
        const payroll = await Payroll.findByPk(id);
        if (!payroll) return null;
        await payroll.update(data);
        return await this.findById(id);
    }

    async delete(id) {
        const payroll = await Payroll.findByPk(id);
        if (!payroll) return null;
        await payroll.destroy();
        return payroll;
    }
}

// Define association here to ensure it's registered
Payroll.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });

module.exports = new PayrollRepository();
