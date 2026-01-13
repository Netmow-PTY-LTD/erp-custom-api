const { User: Staff } = require('../users/user.model');
const { Department } = require('../departments/departments.model');
const { Op } = require('sequelize');

class StaffRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.department_id) {
            where.department_id = filters.department_id;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.search) {
            where[Op.or] = [
                { first_name: { [Op.like]: `%${filters.search}%` } },
                { last_name: { [Op.like]: `%${filters.search}%` } },
                { name: { [Op.like]: `%${filters.search}%` } },
                { email: { [Op.like]: `%${filters.search}%` } },
                { position: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Staff.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [{
                model: Department,
                as: 'department',
                attributes: ['id', 'name', 'description']
            }]
        });
    }

    async findById(id) {
        return await Staff.findByPk(id, {
            include: [{
                model: Department,
                as: 'department',
                attributes: ['id', 'name', 'description']
            }]
        });
    }

    async findByEmail(email) {
        return await Staff.findOne({ where: { email } });
    }

    async create(data) {
        return await Staff.create(data);
    }

    async update(id, data) {
        const staff = await Staff.findByPk(id);
        if (!staff) return null;
        return await staff.update(data);
    }

    async delete(id) {
        const staff = await Staff.findByPk(id);
        if (!staff) return null;
        await staff.destroy();
        return staff;
    }
}

module.exports = new StaffRepository();
