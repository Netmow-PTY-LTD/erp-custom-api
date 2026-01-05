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

    async getOrdersBySalesRoute(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await OrderRepository.findAllBySalesRoute(filters, limit, offset);

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
        // discount_amount in DB is the sum of item discounts (populated in createOrder)
        // So we strictly use the DB value, or recalculate from items. Let's use DB value.
        orderData.total_discount = parseFloat(orderData.discount_amount) || 0;

        // Net Amount (after discount, before tax)
        // = total_amount - discount_amount OR sum of line_total
        const itemsLineTotal = orderData.items ? orderData.items.reduce((sum, item) => sum + (parseFloat(item.line_total) || 0), 0) : 0;
        orderData.net_amount = itemsLineTotal;

        // Total Payable Amount
        // This is the actual amount customer needs to pay
        // = Sum of line_total (after discount) + tax
        const tax = parseFloat(orderData.tax_amount) || 0;

        orderData.total_payable_amount = itemsLineTotal + tax;

        // Total Paid Amount
        orderData.total_paid_amount = orderData.payments
            ? orderData.payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
            : 0;

        return orderData;
    }

    async createOrder(data, userId) {
        let { items, sales_tax_percent, ...orderInfo } = data;

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

                const total_price = quantity * unit_price; // Before discount
                const line_total = total_price - discount; // After discount

                // Calculate item tax (from product's sales_tax) on line_total
                const item_tax_amount = (line_total * sales_tax_rate) / 100;

                discount_amount += discount;
                total_amount += total_price; // Sum of total_price (before discount)
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

        // Calculate remaining balance for each invoice using order amounts
        const invoicesWithBalance = result.rows.map(invoice => {
            const invoiceData = invoice.toJSON();

            // Calculate total paid amount from completed payments
            const paidAmount = invoiceData.payments
                ? invoiceData.payments
                    .filter(payment => payment.status === 'completed')
                    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
                : 0;

            // Get order amounts
            const orderTotalAmount = invoiceData.order ? parseFloat(invoiceData.order.total_amount) : 0;
            const orderDiscountAmount = invoiceData.order ? parseFloat(invoiceData.order.discount_amount) : 0;
            const orderTaxAmount = invoiceData.order ? parseFloat(invoiceData.order.tax_amount) : 0;

            // Set invoice total_amount from order
            invoiceData.total_amount = orderTotalAmount;

            // Calculate remaining balance from order amounts
            // remaining_balance = total_amount - discount_amount + tax_amount - paid_amount
            const totalPayable = orderTotalAmount - orderDiscountAmount + orderTaxAmount;
            const remainingBalance = totalPayable - paidAmount;

            // Add calculated fields
            invoiceData.paid_amount = paidAmount;
            invoiceData.remaining_balance = remainingBalance;
            invoiceData.total_payable = totalPayable;

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

        // Get order amounts
        const orderTotalAmount = invoiceData.order ? parseFloat(invoiceData.order.total_amount) : 0;
        const orderDiscountAmount = invoiceData.order ? parseFloat(invoiceData.order.discount_amount) : 0;
        const orderTaxAmount = invoiceData.order ? parseFloat(invoiceData.order.tax_amount) : 0;

        // Set invoice total_amount from order
        invoiceData.total_amount = orderTotalAmount;

        // Calculate remaining balance from order amounts
        // remaining_balance = total_amount - discount_amount + tax_amount - paid_amount
        const totalPayable = orderTotalAmount - orderDiscountAmount + orderTaxAmount;
        const remainingBalance = totalPayable - paidAmount;

        // Add calculated fields
        invoiceData.paid_amount = paidAmount;
        invoiceData.remaining_balance = remainingBalance;
        invoiceData.total_payable = totalPayable; // Also add total payable for reference

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

            // Get order amounts for correct calculation
            const orderTotalAmount = invoiceData.order ? parseFloat(invoiceData.order.total_amount) : parseFloat(invoiceData.total_amount);
            const orderDiscountAmount = invoiceData.order ? parseFloat(invoiceData.order.discount_amount) : 0;
            const orderTaxAmount = invoiceData.order ? parseFloat(invoiceData.order.tax_amount) : 0;

            // Calculate remaining balance from order amounts
            // remaining_balance = total_amount - discount_amount + tax_amount - paid_amount
            const totalPayable = orderTotalAmount - orderDiscountAmount + orderTaxAmount;
            const remainingBalance = totalPayable - paidAmount;

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

        const payment = await PaymentRepository.create(paymentData);

        // Update Invoice and Order status based on new balance
        if (invoice) {
            // Re-fetch invoice with payments to get the updated total paid
            const updatedInvoice = await InvoiceRepository.findById(invoice.id);
            const invoiceData = updatedInvoice.toJSON();

            const totalPaid = invoiceData.payments
                ? invoiceData.payments
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                : 0;

            const invoiceTotal = parseFloat(invoiceData.total_amount);

            // Determine statuses
            let newInvoiceStatus = invoiceData.status;
            let newOrderPaymentStatus = 'unpaid';

            if (totalPaid >= invoiceTotal) {
                newInvoiceStatus = 'paid';
                newOrderPaymentStatus = 'paid';
            } else if (totalPaid > 0) {
                newOrderPaymentStatus = 'partially_paid';
            }

            // Update Invoice Status if changed
            if (newInvoiceStatus !== invoiceData.status) {
                await InvoiceRepository.update(invoice.id, { status: newInvoiceStatus });
            }

            // Update Order Payment Status
            if (order) {
                await OrderRepository.update(order.id, { payment_status: newOrderPaymentStatus });
            }
        } else if (order) {
            // If no invoice, just update order based on direct payments? 
            // Current logic forces invoice for validation, but if we allow direct order payments later:
            // checks order total vs order paid... (skipping for now to keep safe)
        }

        return payment;
    }

    // Deliveries
    async createDelivery(orderId, data, userId) {
        // Fetch order to get shipping address if not provided
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const delivery_number = `DEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Use provided delivery address or fallback to order shipping/billing address
        const delivery_address = data.delivery_address || order.shipping_address || order.billing_address;

        if (!delivery_address) {
            throw new Error('Delivery address is required and could not be found in the order.');
        }

        const deliveryData = {
            order_id: orderId,
            ...data,
            delivery_number,
            delivery_address,
            created_by: userId
        };
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

    async getSalesRouteById(id) {
        const route = await SalesRouteRepository.findById(id);
        if (!route) {
            throw new Error('Sales route not found');
        }
        return route;
    }

    async updateSalesRoute(id, data, userId) {
        // Map camelCase to snake_case if present
        const routeData = {
            ...data,
            updated_at: new Date()
        };

        if (data.routeName) routeData.route_name = data.routeName;
        if (data.zoomLevel) routeData.zoom_level = data.zoomLevel;
        if (data.postalCode) routeData.postal_code = data.postalCode;
        if (data.centerLat) routeData.center_lat = data.centerLat;
        if (data.centerLng) routeData.center_lng = data.centerLng;
        if (data.coverageRadius) routeData.coverage_radius = data.coverageRadius;

        const updatedRoute = await SalesRouteRepository.update(id, routeData);
        if (!updatedRoute) {
            throw new Error('Sales route not found');
        }
        return updatedRoute;
    }

    async deleteSalesRoute(id) {
        const result = await SalesRouteRepository.delete(id);
        if (!result) {
            throw new Error('Sales route not found');
        }
        return true;
    }

    async assignSalesRoute(id, staffId, userId) {
        const route = await SalesRouteRepository.update(id, {
            assigned_sales_rep_id: staffId,
            updated_at: new Date()
        });
        if (!route) {
            throw new Error('Sales route not found');
        }
        return route;
    }

    async getSalesRouteAssignment(id) {
        // Reuse getById but we might want to ensure we fetch staff details if not already
        // findById in repo already fetches complex data, maybe too much?
        // But for assignment we specifically care about 'assigned_sales_rep_id'
        const route = await SalesRouteRepository.findById(id);
        if (!route) {
            throw new Error('Sales route not found');
        }
        return {
            id: route.id,
            route_name: route.route_name,
            assigned_sales_rep_id: route.assigned_sales_rep_id,
            // If User/Staff included, return it here.
            // Assuming the repo findById might not include rep details, we return the ID at least.
        };
    }


    // Reports & Charts
    async getReportsCharts(start_date, end_date) {
        const { Op } = require('sequelize');
        const { sequelize } = require('../../core/database/sequelize');

        // Build where condition with date range
        // Use DATE() function to compare only the date part, ignoring time
        const whereCondition = sequelize.where(
            sequelize.fn('DATE', sequelize.col('order_date')),
            {
                [Op.between]: [start_date, end_date]
            }
        );

        // Group by date (MySQL)
        const dateFormat = sequelize.fn('DATE', sequelize.col('order_date'));

        // Query to aggregate sales data
        const results = await OrderRepository.model.findAll({
            attributes: [
                [dateFormat, 'date'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'amount'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'order_count']
            ],
            where: whereCondition,
            group: [dateFormat],
            order: [[dateFormat, 'ASC']],
            raw: true
        });

        // Format the results
        const chartData = results.map(row => ({
            date: row.date,
            amount: parseFloat(row.amount) || 0,
            order_count: parseInt(row.order_count) || 0
        }));

        return {
            start_date,
            end_date,
            data: chartData
        };
    }

    // Sales Summary Report
    async getSalesSummary(start_date, end_date) {
        const { Op } = require('sequelize');
        const { sequelize } = require('../../core/database/sequelize');

        // Build where condition with date range
        // Use DATE() function to compare only the date part, ignoring time
        const whereCondition = sequelize.where(
            sequelize.fn('DATE', sequelize.col('order_date')),
            {
                [Op.between]: [start_date, end_date]
            }
        );

        // Get summary statistics
        const summary = await OrderRepository.model.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_orders'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_sales'],
                [sequelize.fn('AVG', sequelize.col('total_amount')), 'average_order_value'],
                [sequelize.fn('SUM', sequelize.col('tax_amount')), 'total_tax'],
                [sequelize.fn('SUM', sequelize.col('discount_amount')), 'total_discount']
            ],
            where: whereCondition,
            raw: true
        });

        // Get status breakdown
        const statusBreakdown = await OrderRepository.model.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'amount']
            ],
            where: whereCondition,
            group: ['status'],
            raw: true
        });

        // Get payment status breakdown
        const paymentStatusBreakdown = await OrderRepository.model.findAll({
            attributes: [
                'payment_status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'amount']
            ],
            where: whereCondition,
            group: ['payment_status'],
            raw: true
        });

        return {
            start_date,
            end_date,
            summary: {
                total_orders: parseInt(summary.total_orders) || 0,
                total_sales: parseFloat(summary.total_sales) || 0,
                average_order_value: parseFloat(summary.average_order_value) || 0,
                total_tax: parseFloat(summary.total_tax) || 0,
                total_discount: parseFloat(summary.total_discount) || 0
            },
            status_breakdown: statusBreakdown.map(row => ({
                status: row.status,
                count: parseInt(row.count) || 0,
                amount: parseFloat(row.amount) || 0
            })),
            payment_status_breakdown: paymentStatusBreakdown.map(row => ({
                payment_status: row.payment_status,
                count: parseInt(row.count) || 0,
                amount: parseFloat(row.amount) || 0
            }))
        };
    }
    async getOrderStats() {
        const stats = await OrderRepository.getStats();

        // Format to match user request
        return {
            total_orders: stats.totalOrders,
            pending_orders: stats.pendingOrders,
            delivered_orders: stats.deliveredOrders,
            total_value: stats.totalValue.toLocaleString()
        };
    }
}

module.exports = new SalesService();
