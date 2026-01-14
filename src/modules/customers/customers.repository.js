const { Customer, CustomerImage } = require('./customers.model');
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
            include: [
                {
                    model: CustomerImage,
                    as: 'images',
                    attributes: ['image_url']
                }
            ],
            limit,
            offset,
            distinct: true, // Fix for correct pagination count with includes
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await Customer.findByPk(id, {
            include: [
                {
                    model: CustomerImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'is_primary', 'sort_order', 'caption']
                }
            ]
        });
    }

    async findByEmail(email) {
        return await Customer.findOne({ where: { email } });
    }

    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            const { images, ...customerData } = data;
            const customer = await Customer.create(customerData, { transaction });

            if (images && images.length > 0) {
                const imageRecords = images.map((img, index) => ({
                    customer_id: customer.id,
                    image_url: img.image_url,
                    is_primary: img.is_primary || false,
                    sort_order: img.sort_order || index,
                    caption: img.caption
                }));
                await CustomerImage.bulkCreate(imageRecords, { transaction });
            }

            await transaction.commit();
            return await this.findById(customer.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const transaction = await sequelize.transaction();
        try {
            const customer = await Customer.findByPk(id);
            if (!customer) {
                await transaction.commit();
                return null;
            }

            const { images, ...customerData } = data;
            await customer.update(customerData, { transaction });

            if (images !== undefined) {
                // Delete existing images
                await CustomerImage.destroy({
                    where: { customer_id: id },
                    transaction
                });

                // Create new images
                if (images && images.length > 0) {
                    const imageRecords = images.map((img, index) => ({
                        customer_id: id,
                        image_url: img.image_url,
                        is_primary: img.is_primary || false,
                        sort_order: img.sort_order || index,
                        caption: img.caption
                    }));
                    await CustomerImage.bulkCreate(imageRecords, { transaction });
                }
            }

            await transaction.commit();
            return await this.findById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
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
