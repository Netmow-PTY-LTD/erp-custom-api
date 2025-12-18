const { PurchaseOrderRepository, PurchaseInvoiceRepository, PurchasePaymentRepository, PurchaseReceiptRepository } = require('./purchase.repository');

class PurchaseService {
    // Purchase Orders
    async getAllPurchaseOrders(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await PurchaseOrderRepository.findAll(filters, limit, offset);

        const data = result.rows.map(row => {
            const order = row.get({ plain: true });
            const paid = parseFloat(order.total_paid_amount || 0);
            const total = parseFloat(order.total_amount || 0);
            return {
                ...order,
                total_paid_amount: paid,
                total_due_amount: total - paid
            };
        });

        return {
            data,
            total: result.count
        };
    }

    async getPurchaseOrderById(id) {
        const po = await PurchaseOrderRepository.findById(id);
        if (!po) {
            throw new Error('Purchase order not found');
        }
        return po;
    }

    async createPurchaseOrder(data, userId) {
        const { items, ...orderInfo } = data;

        // Generate PO number
        const po_number = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Calculate total amount, discount amount, and tax amount
        let total_amount = 0;
        let discount_amount = 0;
        let tax_amount = 0;

        if (items && Array.isArray(items)) {
            const { ProductRepository } = require('../products/products.repository');

            // Use Promise.all to handle async product fetching
            items = await Promise.all(items.map(async (item) => {
                const quantity = Number(item.quantity) || 0;
                const unit_cost = Number(item.unit_cost) || 0;
                const discount = Number(item.discount) || 0;

                // Fetch product to get purchase_tax
                const product = await ProductRepository.findById(item.product_id);
                const purchase_tax_rate = product && product.purchase_tax ? Number(product.purchase_tax) : 0;

                const subtotal = quantity * unit_cost;
                const line_total = subtotal - discount;

                // Calculate item tax
                const item_tax_amount = (line_total * purchase_tax_rate) / 100;

                discount_amount += discount;
                total_amount += line_total;
                tax_amount += item_tax_amount;

                return {
                    ...item,
                    tax_amount: item_tax_amount,
                    purchase_tax_percent: purchase_tax_rate  // Store the tax percentage
                };
            }));
        }

        const orderData = {
            ...orderInfo,
            po_number,
            total_amount,
            discount_amount,
            tax_amount,
            created_by: userId
        };

        const order = await PurchaseOrderRepository.create(orderData, items || []);
        return order;
    }

    async updatePurchaseOrder(id, data) {
        const order = await PurchaseOrderRepository.update(id, data);
        if (!order) {
            throw new Error('Purchase order not found');
        }
        return order;
    }

    async deletePurchaseOrder(id) {
        const order = await PurchaseOrderRepository.delete(id);
        if (!order) {
            throw new Error('Purchase order not found');
        }
        return order;
    }

    // Purchase Invoices
    async getAllPurchaseInvoices(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await PurchaseInvoiceRepository.findAll(filters, limit, offset);

        const data = result.rows.map(row => {
            const invoice = row.get({ plain: true });
            const paid = parseFloat(invoice.paid_amount || 0);
            const total = parseFloat(invoice.total_amount || 0);
            return {
                ...invoice,
                paid_amount: paid,
                due_amount: total - paid
            };
        });

        return {
            data,
            total: result.count
        };
    }

    async getPurchaseInvoiceById(id) {
        const invoice = await PurchaseInvoiceRepository.findById(id);
        if (!invoice) {
            throw new Error('Purchase invoice not found');
        }

        const data = invoice.toJSON();
        data.paid_amount = parseFloat(data.paid_amount || 0);
        data.due_amount = parseFloat(data.total_amount || 0) - data.paid_amount;

        return data;
    }

    async createPurchaseInvoice(data, userId) {
        // Verify purchase order exists
        const order = await PurchaseOrderRepository.findById(data.purchase_order_id);
        if (!order) {
            throw new Error('Purchase order not found');
        }

        // Generate unique invoice number
        const invoice_number = `PINV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create invoice with auto-generated fields
        const invoiceData = {
            ...data,
            invoice_number,
            total_amount: order.total_amount,
            created_by: userId
        };

        return await PurchaseInvoiceRepository.create(invoiceData);
    }

    async updatePurchaseInvoice(id, data) {
        const invoice = await PurchaseInvoiceRepository.update(id, data);
        if (!invoice) {
            throw new Error('Purchase invoice not found');
        }
        return invoice;
    }

    // Purchase Payments
    async getAllPurchasePayments(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await PurchasePaymentRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getPurchasePaymentById(id) {
        const payment = await PurchasePaymentRepository.findById(id);
        if (!payment) {
            throw new Error('Purchase payment not found');
        }
        return payment;
    }

    async createPurchasePayment(data, userId) {
        // Verify purchase order exists
        const order = await PurchaseOrderRepository.findByIdSimple(data.purchase_order_id);
        if (!order) {
            throw new Error('Purchase order not found');
        }

        // Generate reference number if not provided
        const reference_number = data.reference_number || `PREF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        let invoice_id = data.invoice_id;
        if (!invoice_id) {
            const invoice = await PurchaseInvoiceRepository.findByPurchaseOrderId(order.id);
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

        return await PurchasePaymentRepository.create(paymentData);
    }

    // Purchase Receipts (Goods Receiving)
    async createPurchaseReceipt(purchaseOrderId, data, userId) {
        // Verify purchase order exists
        const order = await PurchaseOrderRepository.findById(purchaseOrderId);
        if (!order) {
            throw new Error('Purchase order not found');
        }

        // Generate receipt number
        const receipt_number = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const receiptData = {
            ...data,
            purchase_order_id: purchaseOrderId,
            receipt_number,
            created_by: userId
        };

        // Convert receipt_date string to Date object if provided
        if (data.receipt_date) {
            receiptData.receipt_date = new Date(data.receipt_date);
        }

        // If status is 'completed', set received_at
        if (data.status === 'completed' && !data.received_at) {
            receiptData.received_at = data.receipt_date ? new Date(data.receipt_date) : new Date();
        }

        const receipt = await PurchaseReceiptRepository.create(receiptData);

        // Update stock when goods are received
        if (data.status === 'completed') {
            const StockMovement = require('../products/stock-movement.model');
            const { ProductRepository } = require('../products/products.repository');

            // Add stock for each item in the purchase order
            if (order.items && Array.isArray(order.items)) {
                for (const item of order.items) {
                    // Get current product stock
                    const product = await ProductRepository.findById(item.product_id);
                    if (!product) {
                        throw new Error(`Product with ID ${item.product_id} not found`);
                    }

                    // Add stock
                    const newStock = product.stock_quantity + item.quantity;
                    await ProductRepository.update(item.product_id, { stock_quantity: newStock });

                    // Record stock movement
                    await StockMovement.create({
                        product_id: item.product_id,
                        movement_type: 'purchase',
                        quantity: item.quantity, // Positive for stock in
                        reference_type: 'purchase_order',
                        reference_id: order.id,
                        notes: `Stock added from purchase order ${order.po_number}`,
                        created_by: userId
                    });
                }
            }

            // Update purchase order status
            await PurchaseOrderRepository.update(purchaseOrderId, { status: 'received' });
        } else if (data.status === 'partial') {
            await PurchaseOrderRepository.update(purchaseOrderId, { status: 'partial' });
        }

        return receipt;
    }

    async getPurchaseOrderLocations() {
        const purchaseOrders = await PurchaseOrderRepository.findPurchaseOrdersWithSupplierLocation();

        return {
            total: purchaseOrders.length,
            locations: purchaseOrders.map(po => ({
                id: po.id,
                po_number: po.po_number,
                status: po.status,
                total_amount: parseFloat(po.total_amount),
                order_date: po.order_date,
                expected_delivery_date: po.expected_delivery_date,
                supplier: {
                    id: po.supplier.id,
                    name: po.supplier.name,
                    contact_person: po.supplier.contact_person,
                    address: po.supplier.address,
                    city: po.supplier.city,
                    phone: po.supplier.phone,
                    email: po.supplier.email
                },
                coordinates: {
                    lat: parseFloat(po.supplier.latitude),
                    lng: parseFloat(po.supplier.longitude)
                }
            }))
        };
    }
}

module.exports = new PurchaseService();
