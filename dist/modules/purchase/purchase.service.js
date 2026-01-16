var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const { PurchaseOrderRepository, PurchaseInvoiceRepository, PurchasePaymentRepository, PurchaseReceiptRepository } = require('./purchase.repository');
class PurchaseService {
    // Purchase Orders
    getAllPurchaseOrders() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield PurchaseOrderRepository.findAll(filters, limit, offset);
            const data = result.rows.map(row => {
                const order = row.get({ plain: true });
                const paid = parseFloat(order.total_paid_amount || 0);
                const total = parseFloat(order.total_amount || 0);
                return Object.assign(Object.assign({}, order), { total_paid_amount: paid, total_due_amount: total - paid });
            });
            return {
                data,
                total: result.count
            };
        });
    }
    getPurchaseOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const po = yield PurchaseOrderRepository.findById(id);
            if (!po) {
                throw new Error('Purchase order not found');
            }
            return po;
        });
    }
    createPurchaseOrder(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items } = data, orderInfo = __rest(data, ["items"]);
            // Generate PO number
            const po_number = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            // Calculate total amount, discount amount, and tax amount
            let total_amount = 0;
            let discount_amount = 0;
            let tax_amount = 0;
            if (items && Array.isArray(items)) {
                const { ProductRepository } = require('../products/products.repository');
                // Use Promise.all to handle async product fetching
                items = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const quantity = Number(item.quantity) || 0;
                    const unit_cost = Number(item.unit_cost) || 0;
                    const discount = Number(item.discount) || 0;
                    // Fetch product to get purchase_tax
                    const product = yield ProductRepository.findById(item.product_id);
                    const purchase_tax_rate = product && product.purchase_tax ? Number(product.purchase_tax) : 0;
                    const subtotal = quantity * unit_cost;
                    const line_total = subtotal - discount;
                    // Calculate item tax
                    const item_tax_amount = (line_total * purchase_tax_rate) / 100;
                    discount_amount += discount;
                    total_amount += line_total;
                    tax_amount += item_tax_amount;
                    return Object.assign(Object.assign({}, item), { tax_amount: item_tax_amount, purchase_tax_percent: purchase_tax_rate // Store the tax percentage
                     });
                })));
            }
            const orderData = Object.assign(Object.assign({}, orderInfo), { po_number,
                total_amount,
                discount_amount,
                tax_amount, created_by: userId });
            const order = yield PurchaseOrderRepository.create(orderData, items || []);
            return order;
        });
    }
    updatePurchaseOrder(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield PurchaseOrderRepository.update(id, data);
            if (!order) {
                throw new Error('Purchase order not found');
            }
            return order;
        });
    }
    deletePurchaseOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield PurchaseOrderRepository.delete(id);
            if (!order) {
                throw new Error('Purchase order not found');
            }
            return order;
        });
    }
    // Purchase Invoices
    getAllPurchaseInvoices() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield PurchaseInvoiceRepository.findAll(filters, limit, offset);
            const data = result.rows.map(row => {
                const invoice = row.get({ plain: true });
                const paid = parseFloat(invoice.paid_amount || 0);
                const total = parseFloat(invoice.total_amount || 0);
                return Object.assign(Object.assign({}, invoice), { paid_amount: paid, due_amount: total - paid });
            });
            return {
                data,
                total: result.count
            };
        });
    }
    getPurchaseInvoiceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield PurchaseInvoiceRepository.findById(id);
            if (!invoice) {
                throw new Error('Purchase invoice not found');
            }
            const data = invoice.toJSON();
            data.paid_amount = parseFloat(data.paid_amount || 0);
            data.due_amount = parseFloat(data.total_amount || 0) - data.paid_amount;
            return data;
        });
    }
    createPurchaseInvoice(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify purchase order exists
            const order = yield PurchaseOrderRepository.findById(data.purchase_order_id);
            if (!order) {
                throw new Error('Purchase order not found');
            }
            // Generate unique invoice number
            const invoice_number = `PINV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            // Create invoice with auto-generated fields
            const invoiceData = Object.assign(Object.assign({}, data), { invoice_number, total_amount: order.total_amount, created_by: userId });
            return yield PurchaseInvoiceRepository.create(invoiceData);
        });
    }
    updatePurchaseInvoice(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield PurchaseInvoiceRepository.update(id, data);
            if (!invoice) {
                throw new Error('Purchase invoice not found');
            }
            return invoice;
        });
    }
    // Purchase Payments
    getAllPurchasePayments() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield PurchasePaymentRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getPurchasePaymentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield PurchasePaymentRepository.findById(id);
            if (!payment) {
                throw new Error('Purchase payment not found');
            }
            return payment;
        });
    }
    createPurchasePayment(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify purchase order exists
            const order = yield PurchaseOrderRepository.findByIdSimple(data.purchase_order_id);
            if (!order) {
                throw new Error('Purchase order not found');
            }
            // Generate reference number if not provided
            const reference_number = data.reference_number || `PREF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            let invoice_id = data.invoice_id;
            if (!invoice_id) {
                const invoice = yield PurchaseInvoiceRepository.findByPurchaseOrderId(order.id);
                if (invoice) {
                    invoice_id = invoice.id;
                }
            }
            const paymentData = Object.assign(Object.assign({}, data), { invoice_id,
                reference_number, created_by: userId });
            return yield PurchasePaymentRepository.create(paymentData);
        });
    }
    // Purchase Receipts (Goods Receiving)
    createPurchaseReceipt(purchaseOrderId, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify purchase order exists
            const order = yield PurchaseOrderRepository.findById(purchaseOrderId);
            if (!order) {
                throw new Error('Purchase order not found');
            }
            // Generate receipt number
            const receipt_number = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const receiptData = Object.assign(Object.assign({}, data), { purchase_order_id: purchaseOrderId, receipt_number, created_by: userId });
            // Convert receipt_date string to Date object if provided
            if (data.receipt_date) {
                receiptData.receipt_date = new Date(data.receipt_date);
            }
            // If status is 'completed', set received_at
            if (data.status === 'completed' && !data.received_at) {
                receiptData.received_at = data.receipt_date ? new Date(data.receipt_date) : new Date();
            }
            const receipt = yield PurchaseReceiptRepository.create(receiptData);
            // Update stock when goods are received
            if (data.status === 'completed') {
                const StockMovement = require('../products/stock-movement.model');
                const { ProductRepository } = require('../products/products.repository');
                // Add stock for each item in the purchase order
                if (order.items && Array.isArray(order.items)) {
                    for (const item of order.items) {
                        // Get current product stock
                        const product = yield ProductRepository.findById(item.product_id);
                        if (!product) {
                            throw new Error(`Product with ID ${item.product_id} not found`);
                        }
                        // Add stock
                        const newStock = product.stock_quantity + item.quantity;
                        yield ProductRepository.update(item.product_id, { stock_quantity: newStock });
                        // Record stock movement
                        yield StockMovement.create({
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
                yield PurchaseOrderRepository.update(purchaseOrderId, { status: 'received' });
            }
            else if (data.status === 'partial') {
                yield PurchaseOrderRepository.update(purchaseOrderId, { status: 'partial' });
            }
            return receipt;
        });
    }
    getPurchaseOrderLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseOrders = yield PurchaseOrderRepository.findPurchaseOrdersWithSupplierLocation();
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
        });
    }
}
module.exports = new PurchaseService();
