const { StaffCheckIn } = require('./checkin.model');
const { Staff } = require('../../modules/staffs/staffs.model');
const { Customer } = require('../../modules/customers/customers.model');
const { SalesRoute } = require('../../modules/sales/sales.models');

class CheckInRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        // ... (existing code, not shown in replacement chunk but preserved in file via tool context) ...
        const where = {};
        if (filters.staff_id) where.staff_id = filters.staff_id;
        if (filters.customer_id) where.customer_id = filters.customer_id;
        if (filters.date) {
            const startOfDay = new Date(filters.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filters.date);
            endOfDay.setHours(23, 59, 59, 999);
            where.check_in_time = {
                [require('sequelize').Op.between]: [startOfDay, endOfDay]
            };
        }

        return await StaffCheckIn.findAndCountAll({
            where,
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'position']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'company', 'email', 'phone', 'address', 'city']
                }
            ],
            order: [['check_in_time', 'DESC']],
            limit,
            offset
        });
    }

    async findById(id) {
        return await StaffCheckIn.findByPk(id, {
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'position']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'company', 'email', 'phone', 'address', 'city']
                }
            ]
        });
    }

    async create(data) {
        return await StaffCheckIn.create(data);
    }

    async update(id, data) {
        const checkIn = await StaffCheckIn.findByPk(id);
        if (!checkIn) return null;
        return await checkIn.update(data);
    }

    async delete(id) {
        const checkIn = await StaffCheckIn.findByPk(id);
        if (!checkIn) return null;
        await checkIn.destroy();
        return checkIn;
    }

    async findCustomersWithCheckIns(date, limit = 10, offset = 0) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Note: When using include with where on unrelated tables or required: false, 
        // findAndCountAll might count rows differently (result rows vs main table rows) if not careful with distinct:true
        return await Customer.findAndCountAll({
            distinct: true, // Important for correct count with includes
            include: [
                {
                    model: StaffCheckIn,
                    as: 'checkins',
                    required: false,
                    where: {
                        check_in_time: {
                            [require('sequelize').Op.between]: [startOfDay, endOfDay]
                        }
                    },
                    include: [{
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email', 'position']
                    }]
                },
                {
                    model: SalesRoute,
                    as: 'salesRoute',
                    attributes: ['id', 'route_name', 'description', 'start_location', 'end_location']
                }
            ],
            order: [['name', 'ASC']],
            limit,
            offset
        });
    }
}

module.exports = new CheckInRepository();
