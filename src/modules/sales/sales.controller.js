const SalesService = require('./sales.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class SalesController {
    // Orders
    async getAllOrders(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                status: req.query.status,
                customer_id: req.query.customer_id,
                search: req.query.search
            };

            const result = await SalesService.getAllOrders(filters, page, limit);
            return successWithPagination(res, 'Orders retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await SalesService.getOrderById(req.params.id);
            return success(res, 'Order retrieved successfully', order);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createOrder(req, res) {
        try {
            const order = await SalesService.createOrder(req.body, req.user.id);
            return success(res, 'Order created successfully', order, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateOrder(req, res) {
        try {
            const order = await SalesService.updateOrder(req.params.id, req.body);
            return success(res, 'Order updated successfully', order);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteOrder(req, res) {
        try {
            await SalesService.deleteOrder(req.params.id);
            return success(res, 'Order deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async getOrderStats(req, res) {
        try {
            const stats = await SalesService.getOrderStats();
            return success(res, 'Order stats retrieved successfully', stats);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getOrdersBySalesRoute(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                sales_route_id: req.query.sales_route_id || req.params.routeId,
                status: req.query.status,
                search: req.query.search
            };

            const result = await SalesService.getOrdersBySalesRoute(filters, page, limit);
            return successWithPagination(res, 'Route-wise orders retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // Invoices
    async getAllInvoices(req, res) {
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

            const result = await SalesService.getAllInvoices(filters, page, limit);
            return successWithPagination(res, 'Invoices retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getUnpaidInvoices(req, res) {
        try {
            req.query.unpaid = true;
            return this.getAllInvoices(req, res);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getUnpaidInvoicesByCustomer(req, res) {
        try {
            req.query.unpaid = true;
            req.query.customer_id = req.params.customerId;
            return this.getAllInvoices(req, res);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getInvoiceById(req, res) {
        try {
            const invoice = await SalesService.getInvoiceById(req.params.id);
            return success(res, 'Invoice retrieved successfully', invoice);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createInvoice(req, res) {
        try {
            const invoice = await SalesService.createInvoice(req.body, req.user.id);
            return success(res, 'Invoice created successfully', invoice, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateInvoiceStatus(req, res) {
        try {
            const invoice = await SalesService.updateInvoiceStatus(req.params.id, req.body.status, req.user.id);
            return success(res, 'Invoice status updated successfully', invoice);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getInvoicesByCustomer(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                customer_id: req.params.customerId,
                status: req.query.status,
                search: req.query.search
            };

            const result = await SalesService.getAllInvoices(filters, page, limit);
            return successWithPagination(res, 'Customer invoices retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // Warehouses
    async getAllWarehouses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                is_active: req.query.is_active,
                search: req.query.search
            };

            const result = await SalesService.getAllWarehouses(filters, page, limit);
            return successWithPagination(res, 'Warehouses retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getWarehouseById(req, res) {
        try {
            const warehouse = await SalesService.getWarehouseById(req.params.id);
            return success(res, 'Warehouse retrieved successfully', warehouse);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createWarehouse(req, res) {
        try {
            const warehouse = await SalesService.createWarehouse(req.body, req.user.id);
            return success(res, 'Warehouse created successfully', warehouse, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getAllPayments(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                order_id: req.query.order_id,
                payment_method: req.query.payment_method,
                search: req.query.search
            };
            const result = await SalesService.getAllPayments(filters, page, limit);
            return successWithPagination(res, 'Payments retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getPaymentById(req, res) {
        try {
            const payment = await SalesService.getPaymentById(req.params.id);
            return success(res, 'Payment retrieved successfully', payment);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createPayment(req, res) {
        try {
            const payment = await SalesService.createPayment(req.body, req.user.id);
            return success(res, 'Payment recorded successfully', payment, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async createDelivery(req, res) {
        try {
            const delivery = await SalesService.createDelivery(req.params.id, req.body, req.user.id);
            return success(res, 'Delivery recorded successfully', delivery, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    // Sales Routes
    async getSalesRoutes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                is_active: req.query.is_active,
                search: req.query.search
            };
            const result = await SalesService.getAllSalesRoutes(filters, page, limit);
            return successWithPagination(res, 'Sales routes retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createSalesRoute(req, res) {
        try {
            const route = await SalesService.createSalesRoute(req.body, req.user.id);
            return success(res, 'Sales route created successfully', route, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getSalesRouteById(req, res) {
        try {
            const route = await SalesService.getSalesRouteById(req.params.id);
            return success(res, 'Sales route retrieved successfully', route);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async updateSalesRoute(req, res) {
        try {
            const route = await SalesService.updateSalesRoute(req.params.id, req.body, req.user.id);
            return success(res, 'Sales route updated successfully', route);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteSalesRoute(req, res) {
        try {
            await SalesService.deleteSalesRoute(req.params.id);
            return success(res, 'Sales route deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async assignSalesRoute(req, res) {
        try {
            const { staff_id } = req.body;
            if (!staff_id) {
                return error(res, 'staff_id is required', 400);
            }
            const route = await SalesService.assignSalesRoute(req.params.id, staff_id, req.user.id);
            return success(res, 'Sales route assigned successfully', route);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getSalesRouteAssignment(req, res) {
        try {
            const assignment = await SalesService.getSalesRouteAssignment(req.params.id);
            return success(res, 'Sales route assignment retrieved successfully', assignment);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    // Reports & Charts
    async getReportsCharts(req, res) {
        try {
            const start_date = req.query.start_date;
            const end_date = req.query.end_date;

            if (!start_date || !end_date) {
                return error(res, 'start_date and end_date are required', 400);
            }

            const chartData = await SalesService.getReportsCharts(start_date, end_date);
            return success(res, 'Chart data retrieved successfully', chartData);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getSalesSummary(req, res) {
        try {
            const start_date = req.query.start_date;
            const end_date = req.query.end_date;

            if (!start_date || !end_date) {
                return error(res, 'start_date and end_date are required', 400);
            }

            const summaryData = await SalesService.getSalesSummary(start_date, end_date);
            return success(res, 'Sales summary retrieved successfully', summaryData);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

}

module.exports = new SalesController();
