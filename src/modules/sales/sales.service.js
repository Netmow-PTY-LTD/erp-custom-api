const { OrderRepository, InvoiceRepository, WarehouseRepository, PaymentRepository, DeliveryRepository } = require('./sales.repository');


class SalesService {
    // Orders
    async getAllOrders(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await OrderRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getOrderById(id) {
        const order = await OrderRepository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async createOrder(data, userId) {
        const { items, ...orderInfo } = data;

        // Generate a unique order number
        const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Calculate total amount
        let total_amount = 0;
        if (items && Array.isArray(items)) {
            total_amount = items.reduce((sum, item) => {
                return sum + (Number(item.quantity) * Number(item.unit_price));
            }, 0);
        }

        const orderData = {
            ...orderInfo,
            order_number,
            total_amount,
            created_by: userId
        };

        const order = await OrderRepository.create(orderData, items || []);

        // Deduct stock and record movements for each item
        const StockMovement = require('../products/stock-movement.model');
        const { ProductRepository } = require('../products/products.repository');

        if (items && Array.isArray(items)) {
            for (const item of items) {
                // Get current product stock
                const product = await ProductRepository.findById(item.product_id);
                if (!product) {
                    throw new Error(`Product with ID ${item.product_id} not found`);
                }

                // Check if sufficient stock
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Required: ${item.quantity}`);
                }

                // Deduct stock
                const newStock = product.stock_quantity - item.quantity;
                await ProductRepository.update(item.product_id, { stock_quantity: newStock });

                // Record stock movement
                await StockMovement.create({
                    product_id: item.product_id,
                    movement_type: 'sale',
                    quantity: -item.quantity, // Negative for stock out
                    reference_type: 'order',
                    reference_id: order.id,
                    notes: `Stock deducted for order ${order_number}`,
                    created_by: userId
                });
            }
        }

        return order;
    }

    async updateOrder(id, data) {
        const order = await OrderRepository.update(id, data);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async deleteOrder(id) {
        const order = await OrderRepository.delete(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    // Invoices
    async getAllInvoices(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await InvoiceRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getInvoiceById(id) {
        const invoice = await InvoiceRepository.findById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }

    async createInvoice(data, userId) {
        // Verify order exists and get its total_amount
        const order = await OrderRepository.findById(data.order_id);
        if (!order) {
            throw new Error('Order not found');
        }

        // Generate unique invoice number
        const invoice_number = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create invoice with auto-generated fields
        const invoiceData = {
            ...data,
            invoice_number,
            total_amount: order.total_amount,
            created_by: userId
        };

        return await InvoiceRepository.create(invoiceData);
    }

    // Warehouses
    async getAllWarehouses(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await WarehouseRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getWarehouseById(id) {
        const warehouse = await WarehouseRepository.findById(id);
        if (!warehouse) {
            throw new Error('Warehouse not found');
        }
        return warehouse;
    }

    async createWarehouse(data, userId) {
        return await WarehouseRepository.create({ ...data, created_by: userId });
    }

    // Payments
    async getAllPayments(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await PaymentRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getPaymentById(id) {
        const payment = await PaymentRepository.findById(id);
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    }

    async createPayment(data, userId) {
        // Verify order exists
        const order = await OrderRepository.findByIdSimple(data.order_id);
        if (!order) {
            throw new Error('Order not found');
        }

        // Generate reference number if not provided
        const reference_number = data.reference_number || `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        let invoice_id = data.invoice_id;
        if (!invoice_id) {
            const invoice = await InvoiceRepository.findByOrderId(order.id);
            if (invoice) {
                invoice_id = invoice.id;
            }
        }

        const paymentData = {
            ...data,
            invoice_id,
            reference_number,
            created_by: userId
        };

        return await PaymentRepository.create(paymentData);
    }

    // Deliveries
    async createDelivery(orderId, data, userId) {
        // Verify order exists
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Generate delivery number
        const delivery_number = `DEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const deliveryData = {
            ...data,
            order_id: orderId,
            delivery_number,
            delivery_address: data.delivery_address || order.shipping_address,
            created_by: userId
        };

        // Convert delivery_date string to Date object if provided
        if (data.delivery_date) {
            deliveryData.delivery_date = new Date(data.delivery_date);
        }

        // If status is 'delivered', set delivered_at
        if (data.status === 'delivered' && !data.delivered_at) {
            deliveryData.delivered_at = data.delivery_date ? new Date(data.delivery_date) : new Date();
        }

        const delivery = await DeliveryRepository.create(deliveryData);

        // Update Order status
        if (data.status === 'delivered') {
            await OrderRepository.update(orderId, { status: 'delivered' });
        } else if (data.status === 'in_transit') {
            await OrderRepository.update(orderId, { status: 'shipped' });
        }

        return delivery;
    }
}

module.exports = new SalesService();
