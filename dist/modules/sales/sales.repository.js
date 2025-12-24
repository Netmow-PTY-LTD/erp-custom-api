var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Warehouse, SalesRoute, Order, OrderItem, Invoice, Payment, Delivery } = require('./sales.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
class OrderRepository {
    constructor() {
        this.model = Order;
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.status)
                where.status = filters.status;
            if (filters.customer_id)
                where.customer_id = filters.customer_id;
            if (filters.search) {
                where[Op.or] = [
                    { order_number: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Order.findAndCountAll({
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
                    },
                    {
                        model: Delivery,
                        as: 'deliveries',
                        limit: 1,
                        order: [['created_at', 'DESC']],
                        separate: true
                    }
                ],
                order: [['created_at', 'DESC']],
                distinct: true
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Order.findByPk(id, {
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
                    { model: Payment, as: 'payments' },
                    { model: Delivery, as: 'deliveries' }
                ]
            });
        });
    }
    findByIdSimple(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Order.findByPk(id);
        });
    }
    create(orderData, itemsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield sequelize.transaction();
            try {
                const order = yield Order.create(orderData, { transaction });
                const items = itemsData.map(item => {
                    const discount = item.discount || 0;
                    const subtotal = item.quantity * item.unit_price;
                    const line_total = item.line_total || (subtotal - discount);
                    return Object.assign(Object.assign({}, item), { order_id: order.id, discount: discount, line_total: line_total, tax_amount: item.tax_amount || 0, sales_tax_percent: item.sales_tax_percent || 0, total_price: line_total });
                });
                if (items.length > 0) {
                    yield OrderItem.bulkCreate(items, { transaction });
                }
                yield transaction.commit();
                return yield this.findById(order.id);
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield Order.findByPk(id);
            if (!order)
                return null;
            return yield order.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield Order.findByPk(id);
            if (!order)
                return null;
            yield order.destroy();
            return order;
        });
    }
}
class InvoiceRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            const orderWhere = {};
            if (filters.status)
                where.status = filters.status;
            // Filter for unpaid invoices (not paid and not cancelled)
            if (filters.unpaid === true || filters.unpaid === 'true') {
                where.status = { [Op.notIn]: ['paid', 'cancelled'] };
            }
            if (filters.id)
                where.id = filters.id;
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
            return yield Invoice.findAndCountAll({
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
                    },
                    {
                        model: Payment,
                        as: 'payments',
                        attributes: ['id', 'amount', 'payment_date', 'payment_method', 'status']
                    }
                ],
                order: [['created_at', 'DESC']],
                distinct: true // Ensure correct count with includes
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Customer } = require('../customers/customers.model');
            return yield Invoice.findByPk(id, {
                include: [
                    {
                        model: Order,
                        as: 'order',
                        include: [
                            {
                                model: Customer,
                                as: 'customer'
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
                        ]
                    },
                    { model: Payment, as: 'payments' }
                ]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Invoice.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield Invoice.findByPk(id);
            if (!invoice)
                return null;
            return yield invoice.update(data);
        });
    }
    findByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Invoice.findOne({ where: { order_id: orderId } });
        });
    }
}
class WarehouseRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
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
            return yield Warehouse.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Warehouse.findByPk(id);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Warehouse.create(data);
        });
    }
}
class PaymentRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
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
            return yield Payment.findAndCountAll({
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
                            },
                            {
                                model: Invoice,
                                as: 'invoice'
                            }
                        ]
                    },
                    { model: Invoice, as: 'invoice' }
                ],
                order: [['created_at', 'DESC']],
                distinct: true,
                col: 'id'
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Customer } = require('../customers/customers.model');
            return yield Payment.findByPk(id, {
                include: [
                    {
                        model: Order,
                        as: 'order',
                        include: [
                            {
                                model: Customer,
                                as: 'customer',
                                attributes: ['id', 'name', 'email', 'phone', 'company']
                            },
                            {
                                model: Invoice,
                                as: 'invoice'
                            }
                        ]
                    },
                    { model: Invoice, as: 'invoice' }
                ]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payment.create(data);
        });
    }
}
class DeliveryRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Delivery.create(data);
        });
    }
}
class SalesRouteRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SalesRoute.create(data);
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.is_active !== undefined)
                where.is_active = filters.is_active;
            if (filters.search) {
                where[Op.or] = [
                    { route_name: { [Op.like]: `%${filters.search}%` } },
                    { description: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield SalesRoute.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SalesRoute.findByPk(id);
        });
    }
}
module.exports = {
    OrderRepository: new OrderRepository(),
    InvoiceRepository: new InvoiceRepository(),
    WarehouseRepository: new WarehouseRepository(),
    PaymentRepository: new PaymentRepository(),
    DeliveryRepository: new DeliveryRepository(),
    SalesRouteRepository: new SalesRouteRepository()
};
