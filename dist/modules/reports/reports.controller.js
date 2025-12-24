var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ReportService = require('./reports.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class ReportController {
    // Sales
    getSalesSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start_date = req.query.start_date || req.query.startDate;
                const end_date = req.query.end_date || req.query.endDate;
                if (!start_date || !end_date) {
                    return error(res, 'start_date and end_date are required', 400);
                }
                const data = yield ReportService.getSalesSummary(start_date, end_date);
                return success(res, 'Sales summary retrieved successfully', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getTopCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const limit = req.query.limit ? parseInt(req.query.limit) : 5;
                const data = yield ReportService.getTopCustomers(startDate, endDate, limit);
                return successWithPagination(res, 'Top customers retrieved', data, {
                    total: data.length,
                    page: 1,
                    limit,
                    totalPage: 1
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getTopProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const limit = req.query.limit ? parseInt(req.query.limit) : 5;
                const data = yield ReportService.getTopProducts(startDate, endDate, limit);
                return successWithPagination(res, 'Top products retrieved', data, {
                    total: data.length,
                    page: 1,
                    limit,
                    totalPage: 1
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getSalesByCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = req.query.start_date || req.query.startDate;
                const endDate = req.query.end_date || req.query.endDate;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield ReportService.getSalesByCustomer(startDate, endDate, page, limit);
                return successWithPagination(res, 'Sales by customer retrieved', result.rows, {
                    total: result.total,
                    page,
                    limit,
                    totalPage: Math.ceil(result.total / limit)
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getAccountReceivables(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = req.query.start_date || req.query.startDate;
                const endDate = req.query.end_date || req.query.endDate;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield ReportService.getAccountReceivables(startDate, endDate, page, limit);
                return successWithPagination(res, 'Account receivables retrieved', result.rows, {
                    total: result.total,
                    page,
                    limit,
                    totalPage: Math.ceil(result.total / limit)
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // Purchase
    getPurchaseSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const data = yield ReportService.getPurchaseSummary(startDate, endDate);
                return success(res, 'Purchase summary retrieved', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getSpendingBySupplier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                const data = yield ReportService.getSpendingBySupplier(startDate, endDate, limit);
                return successWithPagination(res, 'Supplier spending retrieved', data, {
                    total: data.length,
                    page: 1,
                    limit,
                    totalPage: 1
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // Inventory
    getInventoryStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ReportService.getInventoryStatus();
                return success(res, 'Inventory status retrieved', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getInventoryValuation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ReportService.getInventoryValuation();
                return success(res, 'Inventory valuation retrieved', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getLowStockList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield ReportService.getLowStockList(page, limit);
                return successWithPagination(res, 'Low stock list retrieved', result.rows, {
                    total: result.total,
                    page,
                    limit,
                    totalPage: Math.ceil(result.total / limit)
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // HR
    getAttendanceSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { month, year } = req.query;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                if (!month || !year) {
                    return error(res, 'Month and Year are required', 400);
                }
                const result = yield ReportService.getAttendanceSummary(month, year, page, limit);
                return successWithPagination(res, 'Attendance summary retrieved', result.rows, {
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
    getPayrollSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { year } = req.query;
                if (!year) {
                    return error(res, 'Year is required', 400);
                }
                const data = yield ReportService.getPayrollSummary(year);
                return successWithPagination(res, 'Payroll summary retrieved', data, {
                    total: data.length,
                    page: 1,
                    limit: 12,
                    totalPage: 1
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // Finance
    getProfitLoss(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const data = yield ReportService.getProfitLoss(startDate, endDate);
                return success(res, 'Profit & Loss statement retrieved', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
}
module.exports = new ReportController();
