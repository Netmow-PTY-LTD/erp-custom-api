const { Warehouse, SalesRoute, Order, OrderItem, Invoice, Payment, Delivery } = require('./sales.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

class OrderRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.status) where.status = filters.status;
        if (filters.customer_id) where.customer_id = filters.customer_id;

        if (filters.search) {
            where[Op.or] = [
                { order_number: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Order.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                {
                    model: require('../customers/customers.model').Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'email', 'phone', 'company']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: require('../products/products.model').Product,
                            as: 'product',
                            attributes: ['id', 'name', 'sku', 'price', 'image_url']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await Order.findByPk(id, {
            include: [
                {
                    model: require('../customers/customers.model').Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'email', 'phone', 'company']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: require('../products/products.model').Product,
                            as: 'product',
                            attributes: ['id', 'name', 'sku', 'price', 'image_url']
                        }
                    ]
                },
                { model: Invoice, as: 'invoice' },
                { model: Payment, as: 'payments' }
            ]
        });
    }

    async findByIdSimple(id) {
        return await Order.findByPk(id);
    }

    async create(orderData, itemsData) {
        const transaction = await sequelize.transaction();
        try {
            const order = await Order.create(orderData, { transaction });

            const items = itemsData.map(item => {
                const discount = item.discount || 0;
                const subtotal = item.quantity * item.unit_price;
                const line_total = item.line_total || (subtotal - discount);

                return {
                    ...item,
                    order_id: order.id,
                    discount: discount,
                    line_total: line_total,
                    total_price: line_total
                };
            });

            if (items.length > 0) {
                await OrderItem.bulkCreate(items, { transaction });
            }

            await transaction.commit();
            return await this.findById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const order = await Order.findByPk(id);
        if (!order) return null;
        return await order.update(data);
    }

    async delete(id) {
        const order = await Order.findByPk(id);
        if (!order) return null;
        await order.destroy();
        return order;
    }
}

class InvoiceRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        const orderWhere = {};

        if (filters.status) where.status = filters.status;
        if (filters.id) where.id = filters.id;

        // Filter by customer_id (belongs to Order)
        if (filters.customer_id) {
            orderWhere.customer_id = filters.customer_id;
        }

        if (filters.search) {
            where[Op.or] = [
                { invoice_number: { [Op.like]: `%${filters.search}%` } },
                { '$order.customer.name$': { [Op.like]: `%${filters.search}%` } }
            ];
            // If search is numeric, also search by customer ID and invoice ID
            if (!isNaN(filters.search)) {
                where[Op.or].push({ '$order.customer_id$': filters.search });
                where[Op.or].push({ id: filters.search });
            }
        }

        const { Customer } = require('../customers/customers.model');

        return await Invoice.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                {
                    model: Order,
                    as: 'order',
                    where: Object.keys(orderWhere).length > 0 ? orderWhere : undefined,
                    include: [
                        {
                            model: Customer,
                            as: 'customer',
                            attributes: ['id', 'name', 'email', 'phone', 'company']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']],
            distinct: true // Ensure correct count with includes
        });
    }

    async findById(id) {
        const { Customer } = require('../customers/customers.model');
        return await Invoice.findByPk(id, {
            include: [
                {
                    model: Order,
                    as: 'order',
                    include: [
                        {
                            model: Customer,
                            as: 'customer',
                            attributes: ['id', 'name', 'email', 'phone', 'company']
                        }
                    ]
                },
                { model: Payment, as: 'payments' }
            ]
        });
    }

    async create(data) {
        return await Invoice.create(data);
    }

    async findByOrderId(orderId) {
        return await Invoice.findOne({ where: { order_id: orderId } });
    }
}

class WarehouseRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { location: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Warehouse.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await Warehouse.findByPk(id);
    }

    async create(data) {
        return await Warehouse.create(data);
    }
}

class PaymentRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.order_id) {
            where.order_id = filters.order_id;
        }

        if (filters.payment_method) {
            where.payment_method = filters.payment_method;
        }

        if (filters.search) {
            where[Op.or] = [
                { reference_number: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Payment.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                {
                    model: Order,
                    as: 'order',
                    include: [
                        {
                            model: require('../customers/customers.model').Customer,
                            as: 'customer',
                            attributes: ['id', 'name', 'email', 'phone', 'company']
                        }
                    ]
                },
                { model: Invoice, as: 'invoice' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        const { Customer } = require('../customers/customers.model');
        return await Payment.findByPk(id, {
            include: [
                {
                    model: Order,
                    as: 'order',
                    include: [
                        {
                            model: Customer,
                            as: 'customer',
                            attributes: ['id', 'name', 'email', 'phone', 'company']
                        }
                    ]
                },
                { model: Invoice, as: 'invoice' }
            ]
        });
    }

    async create(data) {
        return await Payment.create(data);
    }
}

class DeliveryRepository {
    async create(data) {
        return await Delivery.create(data);
    }
}

module.exports = {
    OrderRepository: new OrderRepository(),
    InvoiceRepository: new InvoiceRepository(),
    WarehouseRepository: new WarehouseRepository(),
    PaymentRepository: new PaymentRepository(),
    DeliveryRepository: new DeliveryRepository()
};
