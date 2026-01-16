var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchasePayment, PurchaseReceipt } = require('./purchase.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
class PurchaseOrderRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.status)
                where.status = filters.status;
            if (filters.supplier_id)
                where.supplier_id = filters.supplier_id;
            if (filters.search) {
                where[Op.or] = [
                    { po_number: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield PurchaseOrder.findAndCountAll({
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                            SELECT COALESCE(SUM(pp.amount), 0)
                            FROM purchase_payments AS pp
                            WHERE pp.purchase_order_id = PurchaseOrder.id
                        )`),
                            'total_paid_amount'
                        ]
                    ]
                },
                where,
                limit,
                offset,
                include: [
                    { model: PurchaseOrderItem, as: 'items' },
                    {
                        model: require('../suppliers/suppliers.model').Supplier,
                        as: 'supplier',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']],
                distinct: true
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PurchaseOrder.findByPk(id, {
                include: [
                    {
                        model: require('../suppliers/suppliers.model').Supplier,
                        as: 'supplier',
                        attributes: ['id', 'name', 'email', 'phone', 'contact_person']
                    },
                    {
                        model: PurchaseOrderItem,
                        as: 'items',
                        include: [
                            {
                                model: require('../products/products.model').Product,
                                as: 'product',
                                attributes: ['id', 'name', 'sku', 'price', 'image_url']
                            }
                        ]
                    },
                    { model: PurchaseInvoice, as: 'invoice' },
                    { model: PurchasePayment, as: 'payments' }
                ]
            });
        });
    }
    findByIdSimple(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PurchaseOrder.findByPk(id);
        });
    }
    create(orderData, itemsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield sequelize.transaction();
            try {
                const order = yield PurchaseOrder.create(orderData, { transaction });
                const items = itemsData.map(item => {
                    const discount = item.discount || 0;
                    const subtotal = item.quantity * item.unit_cost;
                    const line_total = subtotal - discount;
                    return Object.assign(Object.assign({}, item), { purchase_order_id: order.id, discount: discount, line_total: line_total, tax_amount: item.tax_amount || 0, purchase_tax_percent: item.purchase_tax_percent || 0 });
                });
                if (items.length > 0) {
                    yield PurchaseOrderItem.bulkCreate(items, { transaction });
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
            const order = yield PurchaseOrder.findByPk(id);
            if (!order)
                return null;
            return yield order.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield PurchaseOrder.findByPk(id);
            if (!order)
                return null;
            yield order.destroy();
            return order;
        });
    }
    findPurchaseOrdersWithSupplierLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const { Supplier } = require('../suppliers/suppliers.model');
            return yield PurchaseOrder.findAll({
                include: [
                    {
                        model: Supplier,
                        as: 'supplier',
                        attributes: ['id', 'name', 'contact_person', 'address', 'city', 'phone', 'email', 'latitude', 'longitude']
                    }
                ],
                order: [['created_at', 'DESC']]
            });
        });
    }
}
class PurchaseInvoiceRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            const orderWhere = {};
            if (filters.status)
                where.status = filters.status;
            if (filters.id)
                where.id = filters.id;
            if (filters.supplier_id) {
                orderWhere.supplier_id = filters.supplier_id;
            }
            if (filters.search) {
                where[Op.or] = [
                    { invoice_number: { [Op.like]: `%${filters.search}%` } },
                    { '$purchase_order.supplier.name$': { [Op.like]: `%${filters.search}%` } }
                ];
                if (!isNaN(filters.search)) {
                    where[Op.or].push({ '$purchase_order.supplier_id$': filters.search });
                    where[Op.or].push({ id: filters.search });
                }
            }
            const { Supplier } = require('../suppliers/suppliers.model');
            return yield PurchaseInvoice.findAndCountAll({
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                            SELECT COALESCE(SUM(amount), 0)
                            FROM purchase_payments AS pp
                            WHERE
                                pp.invoice_id = PurchaseInvoice.id
                        )`),
                            'paid_amount'
                        ]
                    ]
                },
                where,
                limit,
                offset,
                include: [
                    {
                        model: PurchaseOrder,
                        as: 'purchase_order',
                        where: Object.keys(orderWhere).length > 0 ? orderWhere : undefined,
                        include: [
                            {
                                model: Supplier,
                                as: 'supplier',
                                attributes: ['id', 'name', 'email', 'phone', 'contact_person']
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']],
                distinct: true
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Supplier } = require('../suppliers/suppliers.model');
            return yield PurchaseInvoice.findByPk(id, {
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                            SELECT COALESCE(SUM(amount), 0)
                            FROM purchase_payments AS pp
                            WHERE
                                pp.invoice_id = PurchaseInvoice.id
                        )`),
                            'paid_amount'
                        ]
                    ]
                },
                include: [
                    {
                        model: PurchaseOrder,
                        as: 'purchase_order',
                        include: [
                            {
                                model: Supplier,
                                as: 'supplier',
                                attributes: ['id', 'name', 'email', 'phone', 'contact_person', 'address', 'city']
                            },
                            {
                                model: PurchaseOrderItem,
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
                    { model: PurchasePayment, as: 'payments' }
                ]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PurchaseInvoice.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield PurchaseInvoice.findByPk(id);
            if (!invoice)
                return null;
            return yield invoice.update(data);
        });
    }
    findByPurchaseOrderId(purchaseOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PurchaseInvoice.findOne({ where: { purchase_order_id: purchaseOrderId } });
        });
    }
}
class PurchasePaymentRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.purchase_order_id) {
                where.purchase_order_id = filters.purchase_order_id;
            }
            if (filters.payment_method) {
                where.payment_method = filters.payment_method;
            }
            if (filters.search) {
                where[Op.or] = [
                    { reference_number: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield PurchasePayment.findAndCountAll({
                where,
                limit,
                offset,
                include: [
                    {
                        model: PurchaseOrder,
                        as: 'purchase_order',
                        include: [
                            {
                                model: require('../suppliers/suppliers.model').Supplier,
                                as: 'supplier',
                                attributes: ['id', 'name', 'email', 'phone', 'contact_person']
                            }
                        ]
                    },
                    { model: PurchaseInvoice, as: 'invoice' }
                ],
                order: [['created_at', 'DESC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Supplier } = require('../suppliers/suppliers.model');
            return yield PurchasePayment.findByPk(id, {
                include: [
                    {
                        model: PurchaseOrder,
                        as: 'purchase_order',
                        include: [
                            {
                                model: Supplier,
                                as: 'supplier',
                                attributes: ['id', 'name', 'email', 'phone', 'contact_person']
                            }
                        ]
                    },
                    { model: PurchaseInvoice, as: 'invoice' }
                ]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PurchasePayment.create(data);
        });
    }
}
class PurchaseReceiptRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PurchaseReceipt.create(data);
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.purchase_order_id) {
                where.purchase_order_id = filters.purchase_order_id;
            }
            if (filters.status) {
                where.status = filters.status;
            }
            return yield PurchaseReceipt.findAndCountAll({
                where,
                limit,
                offset,
                include: [
                    {
                        model: PurchaseOrder,
                        as: 'purchase_order'
                    }
                ],
                order: [['created_at', 'DESC']]
            });
        });
    }
}
module.exports = {
    PurchaseOrderRepository: new PurchaseOrderRepository(),
    PurchaseInvoiceRepository: new PurchaseInvoiceRepository(),
    PurchasePaymentRepository: new PurchasePaymentRepository(),
    PurchaseReceiptRepository: new PurchaseReceiptRepository()
};
