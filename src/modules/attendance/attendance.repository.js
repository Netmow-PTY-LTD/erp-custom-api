const { Attendance } = require('./attendance.model');
const { Staff } = require('../staffs/staffs.model');

class AttendanceRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.staff_id) where.staff_id = filters.staff_id;
        if (filters.date) where.date = filters.date;
        if (filters.status) where.status = filters.status;

        return await Attendance.findAndCountAll({
            where,
            include: [{
                model: Staff,
                as: 'staff',
                attributes: ['id', 'first_name', 'last_name', 'email']
            }],
            order: [['date', 'DESC'], ['check_in', 'ASC']],
            limit,
            offset
        });
    }

    async findById(id) {
        return await Attendance.findByPk(id, {
            include: [{
                model: Staff,
                as: 'staff',
                attributes: ['id', 'first_name', 'last_name', 'email']
            }]
        });
    }

    async findByStaffAndDate(staffId, date) {
        return await Attendance.findOne({
            where: { staff_id: staffId, date }
        });
    }

    async create(data) {
        return await Attendance.create(data);
    }

    async update(id, data) {
        const attendance = await Attendance.findByPk(id);
        if (!attendance) return null;
        await attendance.update(data);
        return await this.findById(id);
    }

    async delete(id) {
        const attendance = await Attendance.findByPk(id);
        if (!attendance) return null;
        await attendance.destroy();
        return attendance;
    }
}

// Define association
Attendance.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });

module.exports = new AttendanceRepository();
