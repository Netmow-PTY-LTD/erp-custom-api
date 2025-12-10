const { Leave } = require('./leaves.model');
const { Staff } = require('../staffs/staffs.model');

class LeaveRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.staff_id) where.staff_id = filters.staff_id;
        if (filters.status) where.status = filters.status;
        if (filters.leave_type) where.leave_type = filters.leave_type;

        return await Leave.findAndCountAll({
            where,
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: Staff,
                    as: 'approver',
                    attributes: ['id', 'first_name', 'last_name']
                }
            ],
            order: [['start_date', 'DESC']],
            limit,
            offset
        });
    }

    async findById(id) {
        return await Leave.findByPk(id, {
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: Staff,
                    as: 'approver',
                    attributes: ['id', 'first_name', 'last_name']
                }
            ]
        });
    }

    async create(data) {
        return await Leave.create(data);
    }

    async update(id, data) {
        const leave = await Leave.findByPk(id);
        if (!leave) return null;
        await leave.update(data);
        return await this.findById(id);
    }

    async delete(id) {
        const leave = await Leave.findByPk(id);
        if (!leave) return null;
        await leave.destroy();
        return leave;
    }
}

// Define associations
Leave.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });
Leave.belongsTo(Staff, { foreignKey: 'approved_by', as: 'approver' });

module.exports = new LeaveRepository();
