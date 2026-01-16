var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SalesService = require('./sales.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class SalesController {
    // Orders
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    status: req.query.status,
                    customer_id: req.query.customer_id,
                    search: req.query.search
                };
                const result = yield SalesService.getAllOrders(filters, page, limit);
                return successWithPagination(res, 'Orders retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield SalesService.getOrderById(req.params.id);
                return success(res, 'Order retrieved successfully', order);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield SalesService.createOrder(req.body, req.user.id);
                return success(res, 'Order created successfully', order, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield SalesService.updateOrder(req.params.id, req.body);
                return success(res, 'Order updated successfully', order);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SalesService.deleteOrder(req.params.id);
                return success(res, 'Order deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    // Invoices
    getAllInvoices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    status: req.query.status,
                    customer_id: req.query.customer_id,
                    search: req.query.search,
                    id: req.query.id,
                    unpaid: req.query.unpaid
                };
                const result = yield SalesService.getAllInvoices(filters, page, limit);
                return successWithPagination(res, 'Invoices retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getUnpaidInvoices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.unpaid = true;
                return this.getAllInvoices(req, res);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getUnpaidInvoicesByCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.unpaid = true;
                req.query.customer_id = req.params.customerId;
                return this.getAllInvoices(req, res);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getInvoiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = yield SalesService.getInvoiceById(req.params.id);
                return success(res, 'Invoice retrieved successfully', invoice);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = yield SalesService.createInvoice(req.body, req.user.id);
                return success(res, 'Invoice created successfully', invoice, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateInvoiceStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = yield SalesService.updateInvoiceStatus(req.params.id, req.body.status, req.user.id);
                return success(res, 'Invoice status updated successfully', invoice);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    getInvoicesByCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    customer_id: req.params.customerId,
                    status: req.query.status,
                    search: req.query.search
                };
                const result = yield SalesService.getAllInvoices(filters, page, limit);
                return successWithPagination(res, 'Customer invoices retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // Warehouses
    getAllWarehouses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield SalesService.getAllWarehouses(filters, page, limit);
                return successWithPagination(res, 'Warehouses retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getWarehouseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield SalesService.getWarehouseById(req.params.id);
                return success(res, 'Warehouse retrieved successfully', warehouse);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield SalesService.createWarehouse(req.body, req.user.id);
                return success(res, 'Warehouse created successfully', warehouse, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    getAllPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    order_id: req.query.order_id,
                    payment_method: req.query.payment_method,
                    search: req.query.search
                };
                const result = yield SalesService.getAllPayments(filters, page, limit);
                return successWithPagination(res, 'Payments retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getPaymentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield SalesService.getPaymentById(req.params.id);
                return success(res, 'Payment retrieved successfully', payment);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield SalesService.createPayment(req.body, req.user.id);
                return success(res, 'Payment recorded successfully', payment, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    createDelivery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const delivery = yield SalesService.createDelivery(req.params.id, req.body, req.user.id);
                return success(res, 'Delivery recorded successfully', delivery, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // Sales Routes
    getSalesRoutes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield SalesService.getAllSalesRoutes(filters, page, limit);
                return successWithPagination(res, 'Sales routes retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    createSalesRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield SalesService.createSalesRoute(req.body, req.user.id);
                return success(res, 'Sales route created successfully', route, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // Reports & Charts
    getReportsCharts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start_date = req.query.start_date;
                const end_date = req.query.end_date;
                if (!start_date || !end_date) {
                    return error(res, 'start_date and end_date are required', 400);
                }
                const chartData = yield SalesService.getReportsCharts(start_date, end_date);
                return success(res, 'Chart data retrieved successfully', chartData);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getSalesSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start_date = req.query.start_date;
                const end_date = req.query.end_date;
                if (!start_date || !end_date) {
                    return error(res, 'start_date and end_date are required', 400);
                }
                const summaryData = yield SalesService.getSalesSummary(start_date, end_date);
                return success(res, 'Sales summary retrieved successfully', summaryData);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
}
module.exports = new SalesController();
