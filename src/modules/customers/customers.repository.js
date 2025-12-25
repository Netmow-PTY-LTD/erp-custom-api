const { Customer } = require('./customers.model');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

class CustomerRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.customer_type) {
            where.customer_type = filters.customer_type;
        }

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { email: { [Op.like]: `%${filters.search}%` } },
                { phone: { [Op.like]: `%${filters.search}%` } },
                { company: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Customer.findAndCountAll({
            where,
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COALESCE(SUM(total_amount), 0)
                            FROM orders AS o
                            WHERE o.customer_id = Customer.id
                            AND o.status != 'cancelled'
                        )`),
                        'total_sales'
                    ]
                ]
            },
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await Customer.findByPk(id);
    }

    async findByEmail(email) {
        return await Customer.findOne({ where: { email } });
    }

    async create(data) {
        return await Customer.create(data);
    }

    async update(id, data) {
        const customer = await Customer.findByPk(id);
        if (!customer) return null;
        return await customer.update(data);
    }

    async delete(id) {
        const customer = await Customer.findByPk(id);
        if (!customer) return null;
        await customer.destroy();
        return customer;
    }

    async findCustomersWithLocation() {
        return await Customer.findAll({
            where: {
                latitude: { [Op.ne]: null },
                longitude: { [Op.ne]: null },
                is_active: true
            },
            attributes: ['id', 'name', 'company', 'address', 'city', 'latitude', 'longitude', 'phone', 'email']
        });
    }

    async getStats() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [activeCustomers, totalCustomers, newCustomers, revenueResult] = await Promise.all([
            // Active Customers
            Customer.count({ where: { is_active: true } }),

            // Total Customers
            Customer.count(),

            // New Customers (This Month)
            Customer.count({
                where: {
                    created_at: {
                        [Op.gte]: startOfMonth
                    }
                }
            }),

            // Total Revenue (from paid orders)
            sequelize.query(
                `SELECT SUM(total_amount) as total FROM orders WHERE status != 'cancelled' AND payment_status = 'paid'`,
                { type: sequelize.QueryTypes.SELECT }
            )
        ]);

        const totalRevenue = revenueResult[0] && revenueResult[0].total ? parseFloat(revenueResult[0].total) : 0;

        return {
            activeCustomers,
            totalCustomers,
            newCustomers,
            totalRevenue
        };
    }
}

module.exports = new CustomerRepository();
