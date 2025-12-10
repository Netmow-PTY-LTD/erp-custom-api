const AccountingService = require('./accounting.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class AccountingController {
    // --- Overview ---
    async getOverview(req, res) {
        try {
            const { start_date, end_date } = req.query;
            const overview = await AccountingService.getOverview(start_date, end_date);
            return success(res, 'Financial overview retrieved successfully', overview);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // --- Income ---
    async getIncomes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await AccountingService.getAllIncomes(req.query, page, limit);
            return successWithPagination(res, 'Income records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createIncome(req, res) {
        try {
            const income = await AccountingService.createIncome(req.body, req.user.id);
            return success(res, 'Income record created successfully', income, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    // --- Expense ---
    async getExpenses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await AccountingService.getAllExpenses(req.query, page, limit);
            return successWithPagination(res, 'Expense records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createExpense(req, res) {
        try {
            const expense = await AccountingService.createExpense(req.body, req.user.id);
            return success(res, 'Expense record created successfully', expense, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    // --- Payroll ---
    async getPayrolls(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await AccountingService.getAllPayrolls(req.query, page, limit);
            return successWithPagination(res, 'Payroll records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createPayroll(req, res) {
        try {
            const payroll = await AccountingService.createPayroll(req.body, req.user.id);
            return success(res, 'Payroll record created successfully', payroll, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }
}

module.exports = new AccountingController();
