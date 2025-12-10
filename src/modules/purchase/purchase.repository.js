const { PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchasePayment, PurchaseReceipt } = require('./purchase.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

class PurchaseOrderRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.status) where.status = filters.status;
        if (filters.supplier_id) where.supplier_id = filters.supplier_id;

        if (filters.search) {
            where[Op.or] = [
                { po_number: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await PurchaseOrder.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                { model: PurchaseOrderItem, as: 'items' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await PurchaseOrder.findByPk(id, {
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
    }

    async findByIdSimple(id) {
        return await PurchaseOrder.findByPk(id);
    }

    async create(orderData, itemsData) {
        const transaction = await sequelize.transaction();
        try {
            const order = await PurchaseOrder.create(orderData, { transaction });

            const items = itemsData.map(item => {
                const discount = item.discount || 0;
                const subtotal = item.quantity * item.unit_cost;
                const line_total = subtotal - discount;

                return {
                    ...item,
                    purchase_order_id: order.id,
                    discount: discount,
                    line_total: line_total
                };
            });

            if (items.length > 0) {
                await PurchaseOrderItem.bulkCreate(items, { transaction });
            }

            await transaction.commit();
            return await this.findById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const order = await PurchaseOrder.findByPk(id);
        if (!order) return null;
        return await order.update(data);
    }

    async delete(id) {
        const order = await PurchaseOrder.findByPk(id);
        if (!order) return null;
        await order.destroy();
        return order;
    }

    async findPurchaseOrdersWithSupplierLocation() {
        const { Supplier } = require('../suppliers/suppliers.model');
        return await PurchaseOrder.findAll({
            include: [
                {
                    model: Supplier,
                    as: 'supplier',
                    attributes: ['id', 'name', 'contact_person', 'address', 'city', 'phone', 'email', 'latitude', 'longitude']
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
}

class PurchaseInvoiceRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};
        const orderWhere = {};

        if (filters.status) where.status = filters.status;
        if (filters.id) where.id = filters.id;

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

        return await PurchaseInvoice.findAndCountAll({
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
    }

    async findById(id) {
        const { Supplier } = require('../suppliers/suppliers.model');
        return await PurchaseInvoice.findByPk(id, {
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
                { model: PurchasePayment, as: 'payments' }
            ]
        });
    }

    async create(data) {
        return await PurchaseInvoice.create(data);
    }

    async findByPurchaseOrderId(purchaseOrderId) {
        return await PurchaseInvoice.findOne({ where: { purchase_order_id: purchaseOrderId } });
    }
}

class PurchasePaymentRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
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

        return await PurchasePayment.findAndCountAll({
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
    }

    async findById(id) {
        const { Supplier } = require('../suppliers/suppliers.model');
        return await PurchasePayment.findByPk(id, {
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
    }

    async create(data) {
        return await PurchasePayment.create(data);
    }
}

class PurchaseReceiptRepository {
    async create(data) {
        return await PurchaseReceipt.create(data);
    }

    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.purchase_order_id) {
            where.purchase_order_id = filters.purchase_order_id;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return await PurchaseReceipt.findAndCountAll({
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
    }
}

module.exports = {
    PurchaseOrderRepository: new PurchaseOrderRepository(),
    PurchaseInvoiceRepository: new PurchaseInvoiceRepository(),
    PurchasePaymentRepository: new PurchasePaymentRepository(),
    PurchaseReceiptRepository: new PurchaseReceiptRepository()
};
