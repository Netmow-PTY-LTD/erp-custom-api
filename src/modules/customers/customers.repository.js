const { Customer } = require('./customers.model');
const { Op } = require('sequelize');

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
}

module.exports = new CustomerRepository();
