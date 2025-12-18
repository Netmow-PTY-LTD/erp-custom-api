const { OrderRepository, InvoiceRepository, WarehouseRepository, PaymentRepository, DeliveryRepository, SalesRouteRepository } = require('./sales.repository');


class SalesService {
    // Orders
    async getAllOrders(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await OrderRepository.findAll(filters, limit, offset);

        // Transform deliveries array to single delivery object
        const transformedRows = result.rows.map(order => {
            const orderData = order.toJSON();
            // Convert deliveries array to single delivery object (latest one)
            orderData.delivery = orderData.deliveries && orderData.deliveries.length > 0
                ? orderData.deliveries[0]
                : null;

            // Add delivery_status field
            orderData.delivery_status = orderData.delivery ? orderData.delivery.status : null;

            delete orderData.deliveries;
            return orderData;
        });

        return {
            data: transformedRows,
            total: result.count
        };
    }

    async getOrderById(id) {
        const order = await OrderRepository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        const orderData = order.toJSON();

        // Add delivery_status from the latest delivery
        if (orderData.deliveries && orderData.deliveries.length > 0) {
            orderData.delivery_status = orderData.deliveries[0].status;
        } else {
            orderData.delivery_status = null;
        }

        // Calculate totals
        orderData.total_invoice_amount = orderData.invoice ? parseFloat(orderData.invoice.total_amount) : 0;

        // Total Discount
        const itemsDiscount = orderData.items ? orderData.items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0) : 0;
        const orderDiscount = parseFloat(orderData.discount_amount) || 0;
        orderData.total_discount = itemsDiscount + orderDiscount;

        // Total Payable Amount
        // Sum(items.total_price) + tax - orderDiscount
        const itemsTotal = orderData.items ? orderData.items.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0) : 0;
        const tax = parseFloat(orderData.tax_amount) || 0;
        orderData.total_payable_amount = itemsTotal + tax - orderDiscount;

        // Total Paid Amount
        orderData.total_paid_amount = orderData.payments
            ? orderData.payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
            : 0;

        return orderData;
    }

    async createOrder(data, userId) {
        const { items, sales_tax_percent, ...orderInfo } = data;

        // Generate a unique order number
        const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Calculate total amount, discount amount, and tax amount
        let total_amount = 0;
        let discount_amount = 0;
        let item_level_tax = 0; // Tax from individual products

        if (items && Array.isArray(items)) {
            const { ProductRepository } = require('../products/products.repository');

            // Use Promise.all to handle async product fetching
            items = await Promise.all(items.map(async (item) => {
                const quantity = Number(item.quantity) || 0;
                const unit_price = Number(item.unit_price) || 0;
                const discount = Number(item.discount) || 0;

                // Fetch product to get sales_tax
                const product = await ProductRepository.findById(item.product_id);
                const sales_tax_rate = product && product.sales_tax ? Number(product.sales_tax) : 0;

                const subtotal = quantity * unit_price;
                const line_total = subtotal - discount;

                // Calculate item tax (from product's sales_tax)
                const item_tax_amount = (line_total * sales_tax_rate) / 100;

                discount_amount += discount;
                total_amount += line_total;
                item_level_tax += item_tax_amount;

                return {
                    ...item,
                    tax_amount: item_tax_amount,
                    sales_tax_percent: sales_tax_rate  // Store the tax percentage
                };
            }));
        }

        // Calculate order-level tax if sales_tax_percent is provided
        let order_level_tax = 0;
        const tax_percent = sales_tax_percent ? Number(sales_tax_percent) : 0;

        if (tax_percent > 0) {
            // Apply order-level tax on total_amount (after item discounts)
            order_level_tax = (total_amount * tax_percent) / 100;
        }

        // Total tax is sum of item-level tax and order-level tax
        const tax_amount = item_level_tax + order_level_tax;

        const orderData = {
            ...orderInfo,
            order_number,
            total_amount,
            discount_amount,
            tax_amount,
            sales_tax_percent: tax_percent,
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

        // Calculate remaining balance for each invoice
        const invoicesWithBalance = result.rows.map(invoice => {
            const invoiceData = invoice.toJSON();

            // Calculate total paid amount from completed payments
            const paidAmount = invoiceData.payments
                ? invoiceData.payments
                    .filter(payment => payment.status === 'completed')
                    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
                : 0;

            const totalAmount = parseFloat(invoiceData.total_amount);
            const remainingBalance = totalAmount - paidAmount;

            // Add calculated fields
            invoiceData.paid_amount = paidAmount;
            invoiceData.remaining_balance = remainingBalance;

            return invoiceData;
        });

        return {
            data: invoicesWithBalance,
            total: result.count
        };
    }

    async getInvoiceById(id) {
        const invoice = await InvoiceRepository.findById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        const invoiceData = invoice.toJSON();

        // Calculate total paid amount from completed payments
        const paidAmount = invoiceData.payments
            ? invoiceData.payments
                .filter(payment => payment.status === 'completed')
                .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
            : 0;

        const totalAmount = parseFloat(invoiceData.total_amount);
        const remainingBalance = totalAmount - paidAmount;

        // Add calculated fields
        invoiceData.paid_amount = paidAmount;
        invoiceData.remaining_balance = remainingBalance;

        return invoiceData;
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

    async updateInvoiceStatus(id, status, userId) {
        const invoice = await InvoiceRepository.findById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        const updatedInvoice = await InvoiceRepository.update(id, {
            status,
            updated_at: new Date()
        });

        // If invoice is marked as paid, update the Order payment_status to 'paid'
        if (status === 'paid' && invoice.order_id) {
            const { OrderRepository } = require('./sales.repository');
            await OrderRepository.update(invoice.order_id, { payment_status: 'paid' });
        }

        return updatedInvoice;
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

        const processedIds = new Set();
        const data = [];

        for (const row of result.rows) {
            if (processedIds.has(row.id)) continue;
            processedIds.add(row.id);

            const payment = row.toJSON();
            if (!payment.invoice && payment.order && payment.order.invoice) {
                payment.invoice = payment.order.invoice;
            }
            data.push(payment);
        }

        return {
            data,
            total: result.count
        };
    }

    async getPaymentById(id) {
        const payment = await PaymentRepository.findById(id);
        if (!payment) {
            throw new Error('Payment not found');
        }

        const paymentData = payment.toJSON();
        if (!paymentData.invoice && paymentData.order && paymentData.order.invoice) {
            paymentData.invoice = paymentData.order.invoice;
        }

        return paymentData;
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
        let invoice = null;

        if (!invoice_id) {
            invoice = await InvoiceRepository.findByOrderId(order.id);
            if (invoice) {
                invoice_id = invoice.id;
            }
        } else {
            invoice = await InvoiceRepository.findById(invoice_id);
        }

        // If invoice exists, validate payment amount against remaining balance
        if (invoice) {
            const invoiceData = invoice.toJSON ? invoice.toJSON() : invoice;

            // Calculate total paid amount from completed payments
            const paidAmount = invoiceData.payments
                ? invoiceData.payments
                    .filter(payment => payment.status === 'completed')
                    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
                : 0;

            const totalAmount = parseFloat(invoiceData.total_amount);
            const remainingBalance = totalAmount - paidAmount;

            // Check if invoice is already fully paid
            if (remainingBalance <= 0) {
                throw new Error('Invoice is already fully paid');
            }

            // Check if payment amount exceeds remaining balance
            if (parseFloat(data.amount) > remainingBalance) {
                throw new Error(`Payment amount (${data.amount}) exceeds remaining balance (${remainingBalance.toFixed(2)})`);
            }
        }

        const paymentData = {
            ...data,
            invoice_id,
            reference_number,
            created_by: userId,
            status: data.status || 'completed' // Default to completed
        };

        return await PaymentRepository.create(paymentData);
    }

    // Deliveries
    async createDelivery(orderId, data, userId) {
        // ... (existing implementation)
        const delivery = await DeliveryRepository.create(deliveryData);

        // Update Order status based on delivery status
        if (data.status === 'delivered') {
            await OrderRepository.update(orderId, { status: 'delivered' });
        } else if (data.status === 'in_transit') {
            await OrderRepository.update(orderId, { status: 'shipped' });
        } else if (data.status === 'confirmed') {
            await OrderRepository.update(orderId, { status: 'confirmed' });
        }

        return delivery;
    }

    // Sales Routes
    async getAllSalesRoutes(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await SalesRouteRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async createSalesRoute(data, userId) {
        // Map camelCase to snake_case if present
        const routeData = {
            ...data,
            route_name: data.routeName || data.route_name,
            zoom_level: data.zoomLevel || data.zoom_level,
            postal_code: data.postalCode || data.postal_code,
            center_lat: data.centerLat || data.center_lat,
            center_lng: data.centerLng || data.center_lng,
            coverage_radius: data.coverageRadius || data.coverage_radius,
            created_by: userId
        };

        // Remove camelCase keys to be clean (optional, but good practice if model has strict checking, though Sequelize ignores extras usually)

        return await SalesRouteRepository.create(routeData);
    }
}

module.exports = new SalesService();
